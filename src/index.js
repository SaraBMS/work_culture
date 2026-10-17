import React from 'react';
import ReactDOM from 'react-dom/client';
import './api/mockAdapter';
import './index.css';
import App from './App';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { EmailProvider } from './hook/EmailProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EmailProvider>
      <Router>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </Router>
    </EmailProvider>
  </React.StrictMode>
);
