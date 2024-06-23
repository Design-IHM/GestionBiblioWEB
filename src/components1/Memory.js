import React from 'react';
import { Card } from 'react-bootstrap';
import img2 from '../assets/img2.jpg';

export default function MemoryCard({ titre, image, stock }) {
  stock = 10;
  titre = 'Analyse 2';
  image = img2;
  return (
    <Card> {/* Ajouter la classe "d-flex" pour rendre le contenu flexible */}
      <Card.Img variant="top" src={image} className="img-fluid" />
      <Card.Body>
        <Card.Text>Titre: {titre}</Card.Text>
        <Card.Text>Stock: {stock}</Card.Text>
      </Card.Body>
    </Card>
  );
}