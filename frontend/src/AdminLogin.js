import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ setIsAuthenticated }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost/AddAndRemove/backend/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verify_passcode',
          passcode: passcode
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        navigate('/add-person');
      } else {
        setError(data.message || 'Invalid passcode');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className='flex flex-col align-center text-center p-20'>
      <h2 className='text-xl  p-6'>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='m-16 p-10'>Passcode:</label> <br/>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className='bg-gray-300 border-none text-center'
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className='bg-blue-400 p-2 px-10 m-6'>Go</button>
      </form>
    </div>
  );
}

export default AdminLogin;