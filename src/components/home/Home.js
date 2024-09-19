import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Import static food images
import foodImage1 from '../../assets/images/foodImage1.jpg';
import foodImage2 from '../../assets/images/foodImage2.jpg';
import foodImage3 from '../../assets/images/foodImage3.jpg';
import foodImage4 from '../../assets/images/foodImage4.jpg';
import foodImage5 from '../../assets/images/foodImage5.jpg';
import foodImage6 from '../../assets/images/foodImage6.jpg';
import foodImage7 from '../../assets/images/foodImage7.jpg';
import foodImage8 from '../../assets/images/foodImage8.jpg';
import foodImage9 from '../../assets/images/foodImage9.jpg';
import foodImage10 from '../../assets/images/foodImage10.jpg';

const Home = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const imagesToShow = 6; // Number of images to show at a time
  const sliderImages = [
    foodImage1, foodImage2, foodImage3, foodImage4, foodImage5, 
    foodImage6, foodImage7, foodImage8, foodImage9, foodImage10
  ];

  // Duplicate images for infinite scrolling effect
  const allImages = [...sliderImages, ...sliderImages]; 

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(imagesToShow); // Start in the middle of the duplicated images
  const imageTrackRef = useRef(null);

  useEffect(() => {
    // Fetch all restaurants
    axios.get('http://localhost:8081/restaurant/getAll')
      .then(response => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching restaurants', error);
        setError('Failed to fetch restaurants');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const track = imageTrackRef.current;
    if (track) {
      track.style.transition = 'transform 0.5s ease-in-out';
      track.style.transform = `translateX(-${currentIndex * (100 / imagesToShow)}%)`;

      // Reset position for smooth infinite scroll
      if (currentIndex === 0) {
        setTimeout(() => {
          track.style.transition = 'none';
          track.style.transform = `translateX(-${imagesToShow * (100 / imagesToShow)}%)`;
          setCurrentIndex(imagesToShow);
        }, 500); // Match this duration with the CSS transition duration
      } else if (currentIndex >= allImages.length - imagesToShow) {
        setTimeout(() => {
          track.style.transition = 'none';
          track.style.transform = `translateX(-${imagesToShow * (100 / imagesToShow)}%)`;
          setCurrentIndex(imagesToShow);
        }, 500); // Match this duration with the CSS transition duration
      }
    }
  }, [currentIndex, allImages.length]); // Include allImages.length in the dependency array

  // Function to move to next slide
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = allImages.length - imagesToShow;
      return prevIndex < maxIndex ? prevIndex + 1 : imagesToShow;
    });
  };

  // Function to move to previous slide
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex > imagesToShow ? prevIndex - 1 : allImages.length - imagesToShow;
    });
  };

  // Function to handle card click and navigate to ViewMenu
  const handleCardClick = (restaurantId) => {
    navigate(`/viewMenu/${restaurantId}`);
  };

  if (loading) return <div>Loading restaurants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-container">
      {/* Image slider */}
      <div className="image-slider">
        <div className="arrow left-arrow" onClick={handlePrevious}>&lt;</div>
        <div
          className="image-track"
          ref={imageTrackRef}
          style={{
            transform: `translateX(-${currentIndex * (100 / imagesToShow)}%)`
          }}
        >
          {allImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Food ${index + 1}`}
              className="slider-image"
            />
          ))}
        </div>
        <div className="arrow right-arrow" onClick={handleNext}>&gt;</div>
      </div>

      {/* Restaurants cards */}
      <h2>Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.map(restaurant => (
          <div
            key={restaurant.id}
            className="restaurant-card"
            onClick={() => handleCardClick(restaurant.id)} // Add onClick handler
          >
            {restaurant.imageData ? (
              <img
                src={`data:image/jpeg;base64,${restaurant.imageData}`}
                alt={restaurant.restaurantName}
                className="restaurant-image"
              />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
            <div className="restaurant-info">
              <h4>{restaurant.restaurantName || 'No name available'}</h4>
              <p>{restaurant.address || 'No address available'}</p>
              <p>{restaurant.contactNumber || 'No contact number available'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
