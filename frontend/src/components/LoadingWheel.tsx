import React from 'react'
import '../styles/LoadingWheel.css'

function LoadingWheel() {
  return (
    <div className="spinner w-10 h-10 relative my-52 mx-auto">
      <div className="double-bounce1 w-full h-full rounded-full bg-primaryText bg-opacity-60 absolute top-0 left-0"></div>
      <div className="double-bounce2 w-full h-full rounded-full bg-primaryText bg-opacity-60 absolute top-0 left-0"></div>
    </div>
  )
}

export default LoadingWheel