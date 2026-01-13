require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('@notionhq/client');

const app = express();
app.use(cors());
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const categories = [
  { key: 'humanoid', name: 'Humanoid', dbId: process.env.DB_HUMANOID },
  { key: 'quadruped', name: 'Quadruped', dbId: process.env.DB_QUADRUPED },
  { key: 'vacuum', name: 'Vacuum', dbId: process.env.DB_VACUUM },
  { key: 'pool', name: 'Pool Cleaner', dbId: process.env.DB_POOL },
  { key: 'lawn', name: 'Lawn Mower', dbId: process.env.DB_LAWN },
  { key: 'industrial', name: 'Industrial', dbId: process.env.DB_INDUSTRIAL },
  { key: 'wheeled', name: 'Wheeled', dbId: process.env.DB_WHEELED },
  { key: 'companion', name: 'Companion', dbId: process.env.DB_COMPANION },
  { key: 'drone', name: 'Drone', dbId: process.env.DB_DRONE },
  { key: 'others', name: 'Others', dbId: process.env.DB_OTHERS }
];

const configStore = {};

app.get('/api/categories', (req, res) => {
  res.json(categories.map(c => ({ key: c.key, name: c.name })));
});

app.get('/api/robots/:category', async (req, res) => {
  try {
    const cat = categories.find(c => c.key === req.params.category);
    if (!cat || !cat.dbId) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const response = await notion.databases.query({ database_id: cat.dbId });
    const robots = response.results.map(pg => {
      const props = pg.properties;
      const robot = { id: pg.id };
      for (const key in props) {
        const prop = props[key];
        if (prop.title) {
          robot[key] = prop.title.map(t => t.plain_text).join('');
        } else if (prop.rich_text) {
          robot[key] = prop.rich_text.map(t => t.plain_text).join('');
        } else if (prop.number !== undefined) {
          robot[key] = prop.number;
        } else if (prop.select) {
          robot[key] = prop.select ? prop.select.name : null;
        } else if (prop.multi_select) {
          robot[key] = prop.multi_select.map(s => s.name);
        } else if (prop.checkbox !== undefined) {
          robot[key] = prop.checkbox;
        } else if (prop.url) {
          robot[key] = prop.url;
        } else if (prop.files && prop.files.length > 0) {
          const file = prop.files[0];
          robot[key] = file.file ? file.file.url : file.external ? file.external.url : null;
        }
      }
      return robot;
    });
    res.json(robots);
  } catch (error) {
    console.error('Error fetching robots:', error);
    res.status(500).json({ error: 'Failed to fetch robots' });
  }
});

app.get('/api/config/:category', (req, res) => {
  const config = configStore[req.params.category] || null;
  res.json(config);
});

app.post('/api/config/:category', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  const base64 = authHeader.replace('Basic ', '');
  const decoded = Buffer.from(base64, 'base64').toString('utf-8');
  const [user, pass] = decoded.split(':');
  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return res.status(403).json({ error: 'Invalid credentials' });
  }
  configStore[req.params.category] = req.body;
  res.json({ success: true });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
