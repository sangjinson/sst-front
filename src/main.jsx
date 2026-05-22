import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// 글로벌 스타일이 있다면 여기서 import 합니다.
import './App.css';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);