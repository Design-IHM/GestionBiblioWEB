import React from 'react';
import BookCard from './Book';

export default function Books() {
  const books = [
    {
      titre: "Livre 1",
      image: "../assets/img1.jpg",
      stock: 5,
    },
    {
      titre: "Livre 2",
      image: "../assets/img2.jpg",
      stock: 10,
    },
    {
      titre: "Livre 2",
      image: "../assets/img2.jpg",
      stock: 10,
    },
    {
      titre: "Livre 3",
      image: "../assets/img3.jpg",
      stock: 3,
    },
    {
      titre: "Livre 3",
      image: "../assets/img3.jpg",
      stock: 3,
    },
    {
        titre: "Livre 2",
        image: "../assets/img2.jpg",
        stock: 10,
      },
      {
        titre: "Livre 3",
        image: "../assets/img3.jpg",
        stock: 3,
      },
      {
        titre: "Livre 2",
        image: "../assets/img2.jpg",
        stock: 10,
      },
      {
        titre: "Livre 3",
        image: "../assets/img3.jpg",
        stock: 3,
      },
      {
        titre: "Livre 2",
        image: "../assets/img2.jpg",
        stock: 10,
      },
      {
        titre: "Livre 3",
        image: "../assets/img3.jpg",
        stock: 3,
      },
      {
        titre: "Livre 2",
        image: "../assets/img2.jpg",
        stock: 10,
      },
      {
        titre: "Livre 3",
        image: "../assets/img3.jpg",
        stock: 3,
      },
      {
        titre: "Livre 2",
        image: "../assets/img2.jpg",
        stock: 10,
      },
      {
        titre: "Livre 3",
        image: "../assets/img3.jpg",
        stock: 3,
      },
      {
        titre: "Livre 2",
        image: "../assets/img2.jpg",
        stock: 10,
      },
      {
        titre: "Livre 3",
        image: "../assets/img3.jpg",
        stock: 3,
      },
    // Ajoutez les détails des autres livres ici...
  ];

  const booksPerRow = 5; // Nombre de livres par ligne

  const rows = [];
  let currentRow = [];

  books.forEach((book, index) => {
    currentRow.push(
      <div key={index} className="col-md-2 mb-4 m-2">
        <BookCard
          titre={book.titre}
          image={book.image}
          stock={book.stock}
        />
      </div>
    );

    if ((index + 1) % booksPerRow === 0 || index === books.length - 1) {
      rows.push(
        <div key={index} className="row">
          {currentRow}
        </div>
      );
      currentRow = [];
    }
  });

  return (
     <div className='container text-center'>
       <div className='mb-3'>
          <h1>Liste des livres du génie civil</h1>
       </div> 
       {rows}
     </div>);
}