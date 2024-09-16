import React, { useState } from 'react';
import axios from 'axios';

function Login({ setAuthToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://your-server-ip:5000/login', {
        username,
        password,
      });
      const { token } = response.data;
      setAuthToken(token);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br/>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;