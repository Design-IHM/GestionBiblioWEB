import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import ReactJsAlert from "reactjs-alert";
import firebase from '../metro.config';
import { storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components1/Sidebar';
import Navbar from '../components1/Navbar';
import styled from 'styled-components';

export default function Profil() {
    const [name, setName] = useState('');
    const [cathegorie] = useState('');
    const [desc, setDesc] = useState('');
    const [etagere] = useState('');
    const [Email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [salle] = useState('');
    const [typ, setTyp] = useState('');
    const formRef = useRef();
    const navigate = useNavigate();

    // Alert states
    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");

    const handleChangeImage = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        const imageRef = ref(storage, `images/${image.name + v4()}`);
        uploadBytes(imageRef, image).then(() => {
            getDownloadURL(imageRef).then((url) => {
                setUrl(url);
            }).catch((error) => {
                console.log(error.message, "error getting the image url");
            });
            setImage(null);
        }).catch((error) => {
            console.log(error.message);
        });
    };

    const res = async () => {
        await firebase.firestore().collection('BiblioInformatique').doc(name).set({
            name,
            Email,
            etagere,
            salle,
            image: url,
            type: typ,
            nomBD: name,
            cathegorie,
            desc,
            commentaire: [{
                heure: new Date(),
                nomUser: '',
                texte: '',
                note: 0
            }]
        });
        setStatus(true);
        setType("success");
        setTitle("Document ajouté avec succès");
    };

    return (
        <div className="content-box">
            <Sidebar />
            <Navbar />
            <Content>
                <FormContainer>
                    <Form ref={formRef} onSubmit={res}>
                        <AvatarSection>
                            <Avatar
                                src={url}
                                sx={{ width: 150, height: 150 }}
                                style={{ marginBottom: '1rem' }}
                            />
                            <UploadButton type="button" onClick={handleSubmit}>
                                Changer la photo de profil
                            </UploadButton>
                            <Form.Control
                                className="image-input"
                                type="file"
                                onChange={handleChangeImage}
                                style={{ marginTop: '1rem' }}
                                required
                            />
                        </AvatarSection>

                        <FormGroup>
                            <Label>Nom</Label>
                            <Form.Control
                                type="text"
                                placeholder="ex: Jason Derulo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>E-mail</Label>
                            <Form.Control
                                type="email"
                                placeholder="ex: exemple@email.com"
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Genre</Label>
                            <Form.Select
                                value={typ}
                                onChange={(e) => setTyp(e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez votre genre</option>
                                <option value="Homme">Homme</option>
                                <option value="Femme">Femme</option>
                            </Form.Select>
                        </FormGroup>

                        <FormGroup>
                            <Label>Description</Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Description"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                            />
                        </FormGroup>

                        <ButtonGroup>
                            <Button type="submit" primary>
                                Enregistrer
                            </Button>
                            <Button type="button" onClick={() => navigate("/")}>
                                Annuler
                            </Button>
                        </ButtonGroup>
                    </Form>
                </FormContainer>

                <ReactJsAlert
                    status={status}
                    type={type}
                    title={title}
                    quotes={true}
                    quote=""
                    Close={() => setStatus(false)}
                />
            </Content>
        </div>
    );
}

const Content = styled.div`
    padding: 2rem;
    margin-top: 60px; // Pour la navbar fixe
    margin-left: 250px; // Pour la sidebar
    display: flex;
    justify-content: center;
    align-items: flex-start;

    @media (max-width: 768px) {
        margin-left: 0;
        padding: 1rem;
    }
`;

const FormContainer = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
`;

const AvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;

    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const Button = styled.button`
    padding: 0.5rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    background-color: ${props => props.primary ? '#4CAF50' : '#9e9e9e'};
    color: white;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }

    @media (max-width: 480px) {
        width: 100%;
        margin: 0.5rem 0;
    }
`;

const UploadButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #e0e0e0;
    }
`;