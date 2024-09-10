import React, { useState } from 'react';
import './style.scss';

const Rating = () => {
  // State to manage visibility of the dropdowns
  const [dropdownVisible, setDropdownVisible] = useState({
    left: false,
    right: false
  });

  // Toggle dropdown visibility
  const toggleDropdown = (position) => {
    setDropdownVisible(prevState => ({
      ...prevState,
      [position]: !prevState[position]
    }));
  };

  // Handle click outside to close the dropdown
  const handleClickOutside = (e) => {
    if (!e.target.closest('.container')) {
      setDropdownVisible({
        left: false,
        right: false
      });
    }
  };

  // Add event listener for clicks outside of the dropdown
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="two-containers">
      <div className={`container left-container ${dropdownVisible.left ? 'expanded' : ''}`}>
        <div className='rating-value'>30%</div>
        <a
          href='#'
          className='comment-link'
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown('left');
          }}
        >
          Comment
        </a>
        {dropdownVisible.left && (
          <div className='dropdown-content'>
            <a href="#item1" className="dropdown-item">Option 1</a>
            <a href="#item2" className="dropdown-item">Option 2</a>
            <a href="#item3" className="dropdown-item">Option 3</a>
          </div>
        )}
      </div>
      <div className={`container right-container ${dropdownVisible.right ? 'expanded' : ''}`}>
        <div className='rating-value'>80%</div>
        <a
          href='#'
          className='comment-link'
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown('right');
          }}
        >
          Comment
        </a>
        {dropdownVisible.right && (
          <div className='dropdown-content'>
            <a href="#item1" className="dropdown-item">Option 1</a>
            <a href="#item2" className="dropdown-item">Option 2</a>
            <a href="#item3" className="dropdown-item">Option 3</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rating;
