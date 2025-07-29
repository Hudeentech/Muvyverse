import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import DetailsPage from './pages/DetailsPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<DetailsPage />} />
        <Route path="/search/:query" element={<SearchResultsPage />} />
      </Routes>
    </Router>
  );
}