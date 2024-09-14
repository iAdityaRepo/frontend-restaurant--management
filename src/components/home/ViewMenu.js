import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams hook
import './ViewMenu.css';

const ViewMenu = () => {
  const { restaurantId } = useParams(); // Get restaurant ID from URL parameters
  const [foodItems, setFoodItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState(''); // Add state for restaurant name
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      setLoading(true);
      axios.get(`http://localhost:8081/foodItem/getAll/${restaurantId}`)
        .then(response => {
          const data = response.data;

          if (Array.isArray(data)) {
            setFoodItems(data);

            // Extract restaurant name from the first item
            if (data.length > 0) {
              setRestaurantName(data[0].restaurantName || 'Unknown Restaurant');
            } else {
              setRestaurantName('No food items available');
            }
          } else {
            console.error('Unexpected data format:', data);
            setError('Failed to fetch food items: Unexpected data format.');
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching the food items!", error);
          setError('Failed to fetch food items.');
          setLoading(false);
        });
    }
  }, [restaurantId]);

  if (loading) return <div className="loading">Loading food items...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="view-menu">
      <h3>Food Items for Restaurant: {restaurantName}</h3> {/* Display restaurant name */}
      {foodItems.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map(item => (
              <tr key={item.id}>
                <td>{item.foodName || 'No name available'}</td>
                <td>{item.description || 'No description available'}</td>
                <td>{item.categoryName || 'No category available'}</td>
                <td>{item.price != null ? `$${item.price.toFixed(2)}` : 'No price available'}</td>
                <td>{item.isAvailable ? 'Available' : 'Not Available'}</td>
                <td>
                  {item.imageData ? (
                    <img
                      src={`data:image/jpeg;base64,${item.imageData}`}
                      alt={item.foodName}
                      className="food-item-image"
                    />
                  ) : (
                    'No image available'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No food items available for the selected restaurant.</p>
      )}
    </div>
  );
};

export default ViewMenu;
