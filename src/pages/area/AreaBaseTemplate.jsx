import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@components/common/Footer';
import '@assets/css/landing.css';

import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';

const AreaBaseTemplate = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '40px 50px' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
};

export default AreaBaseTemplate;