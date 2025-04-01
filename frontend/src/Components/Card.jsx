import React from 'react'
import { SpotifyButton, YouTubeButton } from './MusicButtons'

const Card = ({ url, title, artist, spoURL}) => {
  // Define truncation logic
  let displayedTitle = title;
  if (title.length > 30) {
    displayedTitle = title.slice(0, 27) + '...'; // Shorten and add ellipsis
  }

  return (
    <div className='m-5 rounded-xl flex flex-col hover:scale-105 transition-all duration-300 w-3xs 
                    bg-white/10 border border-white/30 shadow-lg'>

        {/* Image */}
        <img src={url} alt="" className='rounded-t-xl' />

        {/* Content */}
        <div className='flex flex-col flex-grow p-3'>
          <h1 className='text-4xl font-sbold text-white 
                         whitespace-nowrap overflow-hidden text-ellipsis max-w-full' title={title}>
            {displayedTitle}
          </h1>
          <p className='text-lg font-ultralight text-gray-300'>{artist}</p>
        </div>

        {/* Buttons at the bottom */}
        <div className='flex flex-col mt-auto p-0'>
          <SpotifyButton clickHandle={spoURL} />
          <YouTubeButton/>
        </div>

    </div>
  )
}

export default Card
