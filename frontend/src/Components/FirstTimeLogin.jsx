import React, { useState, useEffect } from 'react';
import { motion, scale } from 'framer-motion';
import { Info } from 'lucide-react';

const FirstTimeLogin = () => {
  const [name, setName] = useState('');
//   const [language, setLanguage] = useState('English');

  // Handle input changes for name and language
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

// function reloadWindow () {
//     setTimeout(
//         , 500)
// }

  // Save to local storage
const handleSubmit = (e) => {
    e.preventDefault();

    // Set default name if empty
    const userName = name.trim() === "" ? "User" : name;

    if (userName) {
        localStorage.setItem('userName', userName);
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    } else {
        console.log("Language is required.");
    }
};

  return (
    <>
    
    <motion.div               
    initial={{ opacity: 0, scale: 0.8, translateY: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1, translateY: 300 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl flex flex-col p-5 m-2 border-2 shadow-2xl shadow-white">
      <h1 className="text-4xl text-center boldonse mt-5 mb-5">Welcome</h1>
      
      <label htmlFor="Name" className='mt-5 text-xl'>Enter Your Name <p className='inline-flex text-lg text-black/40'>(optional)</p> </label>
      <input
        className="mb-5 mt-2 text-3xl outline-1 p-1 rounded-lg"
        type="text"
        value={name}
        onChange={handleNameChange}
      />

      {/* <label htmlFor="language" className='mt-5 text-xl'>Select Your Music Language *</label>
      <select
        name="language"
        id="lang"
        value={language}
        onChange={handleLanguageChange}
        className='mt-2 mb-5 outline-1 p-2 pb-2 rounded-lg pr-4 transition-all duration-200'
      >
        <option value="English">English</option>
        <option value="French">Français (French)</option>
        <option value="Hindi">हिन्दी (Hindi)</option>
        <option value="Bengali">বাংলা (Bengali)</option>
        <option value="Spanish">Español (Spanish)</option>
        <option value="Russian">Русский (Russian)</option>
        <option value="Arabic">العربية (Arabic)</option>
        <option value="Korean">한국어 (Korean)</option>
        <option value="Japanese">日本語 (Japanese)</option>
      </select> */}
    <p className='inline-flex'><Info className='inline-flex w-5 mr-2'/><p>Your name is for greeting purposes. It is only stored on device</p></p>
      <motion.button
    initial={{ opacity: 0, scale: 0.8, translateY: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1, translateY: 300 }}
    whileTap={{scale: 0.9,}}
    transition={{ duration: 0.2 }}
      onClick={handleSubmit} className="mt-4 p-2 bg-black rounded-md text-white">
        Continue
      </motion.button>
    </motion.div>
    </>
  );
};

export default FirstTimeLogin;
