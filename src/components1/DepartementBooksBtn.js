import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaPlus } from 'react-icons/fa';
import img1 from '../assets/img1.jpg';

export default function DepartementMemoriesBtn(props) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { nom_du_departement } = props;

  const handleVisualiser = () => {
    // Redirection vers la page catalogue avec le nom du département
    navigate('/catalogue', { state: { departement: nom_du_departement } });
  };

  const handleAjouter = () => {
    setShowModal(true);
    setFormValues({ ...formValues, departement: nom_du_departement });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Traitez les valeurs du formulaire ici
    console.log(formValues);
    // Réinitialisez les valeurs du formulaire
    setFormValues({
      titre: '',
      nombreExemplaires: 0,
      departement: '',
      etagere: '',
      description: '',
    });
    // Fermez la modal
    setShowModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle = {
    backgroundImage: `url(${img1})`,
    backgroundSize: 'cover',
    width: '200px',
    height: '200px',

    cursor: 'pointer',
    position: 'relative',
    transition: 'box-shadow 0.3s ease',
    boxShadow: isHovered ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto', // Centrer horizontalement
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    padding: '10px',
  };

  const buttonAjouterStyle = {
    width: '100px',
    backgroundColor: isHovered ? '#28a745' : 'success',
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '5px',
  };

  const buttonVisualiserStyle = {
    width: '100px',
    backgroundColor: isHovered ? 'blue' : 'primary', // Couleur bleue pour le bouton "Visualiser"
    borderColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: '5px',
  };

  const iconStyle = {
    fontSize: '1.2rem',
  };

  const bookIconStyle = {
    fontSize: '1.5rem',
    marginRight: '5px',
  };

  return (
    <div
      className="card "
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-body">
        <div style={buttonContainerStyle}>
          <Button variant="primary" onClick={handleVisualiser} style={buttonVisualiserStyle}>
            Visualiser
          </Button>
          <Button variant="success" onClick={handleAjouter} style={buttonAjouterStyle}>
            <FaPlus style={iconStyle} /> Ajouter
          </Button>
        </div>
        <h4>
          <FaBook style={bookIconStyle} /> <span className="text-dark">{nom_du_departement}</span>
        </h4>
      </div>
      <Modal show={showModal} onHide={handleModalClose} style={{ backgroundColor: 'transparent' }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-center'><h2 className='text-center'>Ajouter un mémoire</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formTitre">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={formValues.titre}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formNombreExemplaires">
              <Form.Label>Nombre d'exemplaires</Form.Label>
              <Form.Control
                type="number"
                name="nombreExemplaires"
                value={formValues.nombreExemplaires}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDepartement">
              <Form.Label>Département</Form.Label>
              <Form.Control
                type="text"
                name="departement"
                value={formValues.departement}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formEtagere">
              <Form.Label>Étagère</Form.Label>
              <Form.Control
                type="text"
                name="etagere"
                value={formValues.etagere}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="success" type="submit" className='mt-3' style={buttonAjouterStyle}>
              Ajouter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}