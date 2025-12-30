import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('请提供密码参数')
  console.log('用法: npm run generate-password <your-password>')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 10)

console.log('\n生成的密码哈希值:')
console.log('-------------------')
console.log(hash)
console.log('-------------------')
console.log('\n请将此哈希值复制到 src/app/api/auth/[...nextauth]/route.ts 中\n')
