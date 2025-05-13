import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import AdminLogin from './AdminLogin';
import AddPerson from './AddPerson';
import PeopleList from './PeopleList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/admin" 
          element={isAuthenticated ? <Navigate to="/add-person" /> : <AdminLogin setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/add-person" 
          element={isAuthenticated ? <AddPerson /> : <Navigate to="/admin" />} 
        />
        <Route 
          path="/people-list" 
          element={isAuthenticated ? <PeopleList /> : <Navigate to="/admin" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;