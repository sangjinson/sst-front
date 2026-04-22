import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '220px', backgroundColor: '#1f2937', color: 'white', padding: '20px' }}>
        <h3>관리자 패널</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          <Link to="/admin" style={{ color: '#d1d5db', textDecoration: 'none' }}>대시보드</Link>
          <Link to="/" style={{ color: '#d1d5db', textDecoration: 'none' }}>메인으로</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f3f4f6' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;