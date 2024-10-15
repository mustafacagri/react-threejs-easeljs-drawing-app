import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  isActive?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full space-x-2 text-gray-100 p-3 rounded-md 
        transition-all duration-150 transform hover:scale-105 hover:text-white 
        focus:outline-none focus:shadow-outline 
        ${isActive ? 'scale-105 text-white bg-red-500' : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button
