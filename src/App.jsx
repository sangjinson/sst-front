import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import AppRoutes from '@routes/AppRoutes';
/* 안녕 난 인이라고 해~ */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;