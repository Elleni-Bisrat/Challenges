import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='flex align-center text-center p-20 flex-col '>
      <h1 className='text-4xl text-darkblue-400 p-10'>Welcome!!!</h1>
      <p className='text-lg p-4'>If you have the passcode you can have the access to enter to the add and remove page</p>
      <Link to="/admin">
      <button className='bg-blue-400 p-4'>Go to Admin pannel</button></Link>
    </div>
  );
}

export default Home;