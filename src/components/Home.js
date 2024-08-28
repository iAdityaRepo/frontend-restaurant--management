import React from 'react';
import './Home.css'; // Add your CSS styling here

const Home = () => {
    const restaurants = [
        { name: 'Restaurant 1', imgSrc: '/path/to/image1.jpg' },
        { name: 'Restaurant 2', imgSrc: '/path/to/image2.jpg' },
        { name: 'Restaurant 3', imgSrc: '/path/to/image3.jpg' },
        // Add more restaurants as needed
    ];

    return (
        <div className="home">
            <h1>Choose Your Favorite Restaurant</h1>
            <div className="restaurants-grid">
                {restaurants.map((restaurant, index) => (
                    <div key={index} className="restaurant-card">
                        <img src={restaurant.imgSrc} alt={restaurant.name} />
                        <h2>{restaurant.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
