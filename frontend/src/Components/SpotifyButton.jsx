import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons' // ✅ Correct import

const SpotifyButton = () => {
  return (
    <button className='inline-flex justify-center align-middle font-heavy text-center bg-green-500 text-white px-4 py-2 rounded items-center gap-2 m-5'>
      Play on Spotify
      <FontAwesomeIcon icon={faSpotify} className="text-2xl font-heavy" /> {/* ✅ Proper usage */}
    </button>
  )
}

export default SpotifyButton
