import React, { useState } from 'react';
import Chip from './Chip';
import CategorySelector from './CategorySelector';
import '../index.css';

const ChipSection = ({ onChipSelect }) => {
  const categories = {
    Moods: [
      "Happy", "Sad", "Romantic", "Melancholy", "Upbeat",
      "Focus", "Calm", "Workout", "Motivational",
      "Instrumental", "Feel-Good", "Gothic"
    ],
    Genres: [
      "Pop", "Hip Hop", "Electronic", "Rock", "R & B",
      "K-Pop", "Jazz", "Classical", "Blues", "Country"
    ],
    "Editor's Choice": [
      "Trending", "New Releases", "Top 10", "Hidden Gems",
      "Underground Hits", "Fan Favorites"
    ]
  };

  const [activeChip, setActiveChip] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Genres");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setActiveChip(null); // Reset selection when changing category
  };
  
  const handleChipClick = (chipText) => {
    console.log(`Getting ${chipText} recommendation`);
    setActiveChip(chipText);
  };
  
  


  return (
    <div className='flex flex-col justify-center'>
      {/* Dropdown Selector */}
      <CategorySelector
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />

      {/* Chips Section */}
      <div className='pl-2 pr-2 flex overflow-auto [&::-webkit-scrollbar]:hidden h-13 overflow-y-hidden chips-container mt-4'>
        {categories[selectedCategory].map((element, index) => (
          <Chip 
            text={element} 
            key={index} 
            isActive={activeChip === element} 
            handleClick={() => {
                handleChipClick(element);
                onChipSelect(element);
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default ChipSection;
