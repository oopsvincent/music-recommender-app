import React from 'react'

const Account = ({src, username, email, followers}) => {
  return (
    <div className='max-w-[90%] w-full m-auto rounded-4xl border-2 text-white flex justify-start md:items-center bg-black p-5 font-h flex-col md:flex-row md:p-10'>
        <div className='self-center m-5'>
        <img src={src} alt="pp-img" className='rounded-4xl' />
        </div>
        <div className='flex flex-col text-white gap-2'>
        <h1 className='text-6xl pt-2 md:p-5'>{username}</h1>
        <h2 className='text-2xl md:pl-5 pt-0'>{email}</h2>
        <h4 className='text-2xl md:pl-5'>{followers}</h4>
        </div>
    </div>
  )
}

export default Account