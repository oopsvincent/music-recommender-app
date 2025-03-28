import React from 'react'
import Chip from './Chip'
import '../index.css'

const ChipSection = () => {
  return (
    <div className='flex overflow-auto [&::-webkit-scrollbar]:hidden h-15 overflow-y-hidden chips-container'>
        <Chip text={"Hip Hop"}/>
        <Chip text={"Pop"}/>
        <Chip text={"Classic"}/>
        <Chip text={"Rock"}/>
        <Chip text={"Jazz"}/>
        <Chip text={"R & B"}/>
        <Chip text={"Country"}/>
        <Chip text={"Country"}/>
        <Chip text={"Country"}/>
        <Chip text={"Country"}/>
    </div>
  )
}

export default ChipSection