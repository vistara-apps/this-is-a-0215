import React from 'react'
import { clsx } from 'clsx'

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card