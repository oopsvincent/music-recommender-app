import React from 'react'

const Chip = ({ text }) => {
  return (
    <button className='pt-1 h-auto min-w-max dark:text-white text-xl border-2 bg-black p-2 rounded-lg inline-flex align-middle justify-center m-2 hover:dark:text-white-200 hover:bg-gray-400 transition-all duration-200 hover:scale-105 active:bg-white active:text-black'><p>{text}</p></button>
  )
}

export default Chip