import React from 'react'
import { SpotifyButton, YouTubeButton} from './MusicButtons'

const Card = ({ url, title, artist, spoURL, YTURL }) => {
  return (
    <div className='border-xl-sky-100 m-5 bg-gray-500 rounded-xl flex flex-col bg-cardBg hover:bg-pink-400 hover:scale-105 custom-card transition-all duration-300 w-xs'>
        <img src={url} alt="" className='rounded-t-xl'/>
        <h1 className='text-4xl font-sbold dark:text-white pt-3 pl-3 pb-0'>{title}</h1>
        <p className='text-lg font-ultralight dark:text-white pt-0 pl-3 pb-3'>{artist}</p>
        {/* <SpotifyButton /> */}
        <SpotifyButton clickHandle={spoURL}/>
        <YouTubeButton clickHandle={YTURL}/>
    </div>
  )
}

export default Card