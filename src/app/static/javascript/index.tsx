import { ReactNode } from 'react'

import '../styles/star.scss'

export default function Background({ children }: { children: ReactNode }) {
  return (
    <div className="background-container">
      {children}
      {Array.apply(null, Array(20)).map((e, idx) => (
        <div className="circle-container" key={idx}>
          <div className="circle" />
        </div>
      ))}
    </div>
  )
}
