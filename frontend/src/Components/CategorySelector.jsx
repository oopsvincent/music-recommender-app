import React from 'react';

const CategorySelector = ({ selectedCategory, handleCategoryChange }) => {
  const categories = ["Genres", "Moods", "Editor's Choice"];

  return (
    <div className="relative flex justify-around items-center">
        <h2 className='text-white text-2xl'>Filter By Category</h2>
      <select
        className="w-25 h-auto border-2 rounded-lg bg-black text-white text-xs p-1.5 focus:outline-none md:w-40 md:text-xl"
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
