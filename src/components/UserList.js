// src/UserList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);
 
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8081/user/getAll');
            console.log('Response Data:', response.data);  // Log the data to verify
            setUsers(response.data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Error fetching users');
        }
    };

    return (
        <div>
            <h1>User List</h1>
            {error && <p>{error}</p>}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.phoneNo} - {user.walletBalance} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
