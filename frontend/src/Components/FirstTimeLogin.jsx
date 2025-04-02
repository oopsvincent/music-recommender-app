import React, { useState } from 'react';

const FirstTimeLogin = () => {
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('English');

  // Handle input changes for name and language
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Save to local storage
  const handleSubmit = (e) => {
    e.preventDefault();
  // Call the onSubmit prop to save user info in localStorage
    if (name == "") {
        localStorage.setItem('userName', "User");
        window.location.reload();  // Reload the window after saving info
    }
    else if (name !== "") {
        localStorage.setItem('userName', name);
        window.location.reload();  // Reload the window after saving info
    }
    if (language) {
        // Save the name and language to localStorage
        localStorage.setItem('musicLanguage', language);
        alert('Your information has been saved!');
        window.location.reload();  // Reload the window after saving info
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <div className="bg-white rounded-2xl flex flex-col p-5 m-2 border-2 shadow-2xl shadow-white">
      <h1 className="text-4xl text-center boldonse mt-5 mb-5">Welcome</h1>
      
      <label htmlFor="Name" className='mt-5 text-xl'>Enter Your Name</label>
      <input
        className="mb-5 mt-2 text-3xl outline-1 p-1 rounded-lg"
        type="text"
        value={name}
        onChange={handleNameChange}
      />

      <label htmlFor="language" className='mt-5 text-xl'>Select Your Music Language *</label>
      <select
        name="language"
        id="lang"
        value={language}
        onChange={handleLanguageChange}
        className='mt-2 mb-5 outline-1 p-2 pb-2 rounded-lg pr-4'
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
      </select>
    <p>Everything is Confidential and can be changed later</p>
      <button onClick={handleSubmit} className="mt-4 p-2 bg-black rounded-md text-white">
        Save Information
      </button>
    </div>
  );
};

export default FirstTimeLogin;
