'use client'

import { ReactNode } from 'react'
import Masonry from 'react-masonry-css'

interface MasonryGridProps {
  children: ReactNode
}

const breakpointColumns = {
  default: 3,
  1280: 3,
  1024: 2,
  640: 1,
}

export default function MasonryGrid({ children }: MasonryGridProps) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-6 w-auto"
      columnClassName="pl-6 bg-clip-padding"
    >
      {children}
    </Masonry>
  )
}
