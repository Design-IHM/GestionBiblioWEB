import React from 'react';
import { FaBook } from 'react-icons/fa';

import DepartementBooksBtn from './DepartementBooksBtn';

export default function DepartementsList() {
  const departements = [
    "Département 1",
    "Département 2",
    "Département 3",
    "Département 4",
    "Département 5",
    "Département 6",
    
  ];

  const departementRows = [];
  let currentRow = [];

  departements.forEach((departement, index) => {
    currentRow.push(
      <div key={index} className="col-md-4 mb-4">
        <DepartementBooksBtn nom_du_departement={departement} />
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
    <div>
      <div
        className="d-flex align-items-center justify-content-center mb-4"
        style={{ backgroundColor: 'orange' }}
      >
        <h1 className="mr-2">Page d'administration des livres</h1>
        <FaBook style={{ fontSize: '2rem' }} />
      </div>
      {departementRows}
    </div>  
  );
}