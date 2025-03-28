import React from 'react'
import Chip from './Chip'

const ChipSection = () => {
  return (
    <div className='flex overflow-auto [&::-webkit-scrollbar]:hidden h-14 overflow-y-hidden'>
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