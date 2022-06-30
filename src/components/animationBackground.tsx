import { ReactNode } from 'react'

import 'static/styles/star.scss'

const AnimationBackground = ({ children }: { children: ReactNode }) => {
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

export default AnimationBackground
