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
import { useI18n } from '../Context/I18nContext';

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
const { language } = useI18n();
const translations = {
  admin : language === "FR" ? "Administration des livres" : "Book's administration"
}
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
        <h1 className="mr-2 text-secondary">{translations.admin}</h1>
        
      </div>
      <diV className='mt-2'>
        {departementRows}
      </diV>
    </div>
  );
}