import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 글로벌 스타일이 있다면 여기서 import 합니다.
// import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);