import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons'
import { faYoutube } from '@fortawesome/free-brands-svg-icons' // ✅ Added YouTube icon

export const SpotifyButton = ({clickHandle}) => {
  return (
    <button onClick={clickHandle} className='mr-5 ml-5 mt-1 inline-flex justify-center align-middle font-heavy text-center bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2'>
      Play on Spotify
      <FontAwesomeIcon icon={faSpotify} className="text-2xl" />
    </button>
  )
}

export const YouTubeButton = ({clickHandle}) => {
  return (
    <button onClick={clickHandle} className='mt-2 ml-5 mr-5 mb-5 inline-flex justify-center align-middle font-heavy text-center bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2'>
      Watch on YouTube
      <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
    </button>
  )
}

const MusicButtons = () => {
  return (
    <div className="flex gap-4">
      <SpotifyButton />
      <YouTubeButton />
    </div>
  )
}

export default MusicButtons
