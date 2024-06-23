import React from 'react';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import "./catlivres.css";

const catlivre = () => {
    return (
        <div className='livre'>
           
            <Sidebar />
            <Navbar />
            <div className='livre1'>
                <button >Genie informatique</button>
                <button>Genie civil</button>
                <button >Genie telecommunication</button>
                <button>Genie mecanique</button>
                <button >Genie industriel</button>
                <button>Genie electrique</button>
            </div>
        </div>
    );
};

export default catlivre;