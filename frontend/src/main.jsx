import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NotFound from './pages/NotFound';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

