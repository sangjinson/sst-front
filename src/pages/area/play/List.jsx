import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@components/common/Footer';
import '@assets/css/landing.css';

import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';
import IconSVG from '../../../components/Icon/IconSVG';

const PlayList = () => {
    return (
        <>
        <div>PlayLis</div>
        <IconSVG name="park" className="text-blue-500 hover:text-red-500" strokeWidth={5} />
        <IconSVG name="huney" className="text-blue-500 hover:text-red-500" />
        </>
    )
};

export default PlayList;