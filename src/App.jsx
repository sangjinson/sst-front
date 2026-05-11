import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@layouts/admin/tailadmin/context/ThemeContext';
import AppRoutes from '@routes/AppRoutes';
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;