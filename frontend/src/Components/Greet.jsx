// Greet.jsx
import React from 'react'

function greetBasedOnTime() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return "Good Morning, ";
    } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon, ";
    } else {
        return "Good Evening, ";
    }
}

const userName = localStorage.getItem('userName');

const Greet = () => {
  return (
    <h1
      className="text-white text-lg md:text-2xl font-semibold tracking-tight px-5 py-3 md:px-8 md:py-4 border-b border-white/10 bg-black/80 backdrop-blur-md"
      title={userName}
    >
      {greetBasedOnTime()} {userName}
    </h1>
  );
}

export default Greet;
