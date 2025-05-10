// src/pages/NotFound.jsx
import React from 'react';
import UseAnimations from "react-useanimations";
import alertTriangle from 'react-useanimations/lib/alertTriangle';

function NotFound() {
return (
    <div className='bg-transparent h-[80vh] p-4 rounded-lg flex flex-col justify-center items-center'>
        <div className='text-center text-white text-2xl flex flex-col justify-center items-center bg-black rounded-xl p-5'>
             <UseAnimations animation={alertTriangle} size={80} strokeColor="red" />
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you are looking for doesn't exist.</p>
            {/* You can add a link to your homepage or other helpful elements */}
            <a href="/" className='bg-white rounded-2xl text-black m-2 mt-5 px-4 py-2'>Go To HomePage</a>
        </div>
    </div>
);
}

export default NotFound;