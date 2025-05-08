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
    className="text-white pt-5 pl-5 text-xl dark:text-white m-1 mb-4 boldonse line-h line-clamp-3 md:text-4xl md:p-4"
    title={userName}
>
    {greetBasedOnTime()} {userName}
</h1>
  )
}

export default Greet