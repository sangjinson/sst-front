import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>403 Forbidden</h1>
      <p>해당 페이지에 접근할 권한이 없습니다.</p>
      <Link to="/" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#0F9B73', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>메인으로 돌아가기</Link>
    </div>
  );
};

export default Unauthorized;