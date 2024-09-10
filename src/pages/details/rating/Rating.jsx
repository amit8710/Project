import React, { useState } from 'react';
import './style.scss'; // Ensure this path is correct

const Rating = () => {
  const [dropdownVisible, setDropdownVisible] = useState({
    left: false,
    right: false
  });

  const [itemsToShow, setItemsToShow] = useState({
    left: 3,
    right: 3
  });

  const profiles = [
    { icon: 'profile.png', name: 'John Doe', comment: 'This is a comment by John Doe.' },
    { icon: 'profile.png', name: 'Jane Smith', comment: 'This is a comment by Jane Smith.' },
    { icon: 'profile.png', name: 'Alice Johnson', comment: 'This is a comment by Alice Johnson.' },
    { icon: 'profile.png', name: 'Michael Brown', comment: 'This is a comment by Michael Brown.' },
    { icon: 'profile.png', name: 'Emily Davis', comment: 'This is a comment by Emily Davis.' },
    { icon: 'profile.png', name: 'Chris Wilson', comment: 'This is a comment by Chris Wilson.' },
    { icon: 'profile.png', name: 'David Lee', comment: 'This is a comment by David Lee.' },
    { icon: 'profile.png', name: 'Sarah Green', comment: 'This is a comment by Sarah Green.' },
    { icon: 'profile.png', name: 'Paul King', comment: 'This is a comment by Paul King.' },
    { icon: 'profile.png', name: 'Laura Adams', comment: 'This is a comment by Laura Adams.' }
  ];

  const toggleDropdown = (position) => {
    setDropdownVisible(prevState => ({
      ...prevState,
      [position]: !prevState[position]
    }));
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.container')) {
      setDropdownVisible({
        left: false,
        right: false
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadMoreItems = (position) => {
    setItemsToShow(prevState => ({
      ...prevState,
      [position]: prevState[position] + 3
    }));
  };

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
            {profiles.slice(0, itemsToShow.left).map((profile, index) => (
              <div key={index} className='dropdown-item'>
                <img src={profile.icon} alt='Profile Icon' className='profile-icon' />
                <div className='profile-info'>
                  <span className='profile-name'>{profile.name}</span>
                  <p className='profile-comment'>{profile.comment}</p>
                </div>
              </div>
            ))}
            {itemsToShow.left < profiles.length && (
              <a
                href='#'
                className='load-more'
                onClick={(e) => {
                  e.preventDefault();
                  loadMoreItems('left');
                }}
              >
                Load More
              </a>
            )}
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
            {profiles.slice(0, itemsToShow.right).map((profile, index) => (
              <div key={index} className='dropdown-item'>
                <img src={profile.icon} alt='Profile Icon' className='profile-icon' />
                <div className='profile-info'>
                  <span className='profile-name'>{profile.name}</span>
                  <p className='profile-comment'>{profile.comment}</p>
                </div>
              </div>
            ))}
            {itemsToShow.right < profiles.length && (
              <a
                href='#'
                className='load-more'
                onClick={(e) => {
                  e.preventDefault();
                  loadMoreItems('right');
                }}
              >
                Load More
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rating;
