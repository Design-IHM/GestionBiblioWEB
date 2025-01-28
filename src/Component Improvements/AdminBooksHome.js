import React from 'react';
import { FaBook } from 'react-icons/fa';
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import DepartementBooksBtn from './DepartementBooksBtn';

import img1 from '../assets/genie_info.jpg';
import img2 from '../assets/genie_civil.jpg';
import img3 from  '../assets/genie_telecom.jpg';
import img4 from  '../assets/genie_electrique.jpg';
import img5 from '../assets/genie_meca.jpg';
import img6 from  '../assets/Msp.jpg';

export default function DepartementsList() {
  const departements = [
    "Genie Informatique",
    "Genie Civile",
    "Genie Telecom",
    "Genie Electrique",
    "Genie Mecanique",
    "MSP",
    
  ];


const images = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,

]  

  const departementRows = [];
  let currentRow = [];

  departements.forEach((departement, index) => {
    currentRow.push(
      <div key={index} className="col-md-4 mb-4">
        <DepartementBooksBtn myimage ={images[index]} nom_du_departement={departement} />
      </div>
    );

    if ((index + 1) % 3 === 0 || index === departements.length - 1) {
      departementRows.push(
        <div key={index} className="row">
          {currentRow}
        </div>
      );
      currentRow = [];
    }
  });

  return (
    <div className="content-box">
      <Sidebar />
      <Navbar />
      <div
        className="d-flex align-items-center justify-content-center mb-4 "
        
      >
        <h1 className="mr-2 text-secondary">Administration des livres</h1>
        <FaBook style={{ fontSize: '2rem' }} className='text-dark'/>
      </div>
      <diV className='mt-2'>
        {departementRows}
      </diV>
    </div>
  );
}