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
import { FaCamera } from 'react-icons/fa';

export default function Profil() {
    // ... [Tout le code des states et des fonctions reste identique] ...
    const [name, setName] = useState('');
    const [cathegorie] = useState('');
    const [desc, setDesc] = useState('');
    const [etagere] = useState('');
    const [Email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [salle] = useState('');
    const [typ, setTyp] = useState('');
    const fileInputRef = useRef();
    const formRef = useRef();
    const navigate = useNavigate();

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

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
        <Container>
            <Sidebar />
            <Navbar />
            <Content>
                <FormContainer>
                    <Form ref={formRef} onSubmit={res}>
                        <AvatarSection>
                            <AvatarWrapper>
                                <StyledAvatar src={url} />
                                <UploadOverlay onClick={triggerFileInput}>
                                    <FaCamera size={24} />
                                    <span>Modifier</span>
                                </UploadOverlay>
                            </AvatarWrapper>
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleChangeImage}
                                style={{ display: 'none' }}
                            />
                        </AvatarSection>

                        <FormGrid>
                            <FormGroup>
                                <Label>Nom</Label>
                                <StyledInput
                                    type="text"
                                    placeholder="ex: Jason Derulo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>E-mail</Label>
                                <StyledInput
                                    type="email"
                                    placeholder="ex: exemple@email.com"
                                    value={Email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Genre</Label>
                                <StyledSelect
                                    value={typ}
                                    onChange={(e) => setTyp(e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionnez votre genre</option>
                                    <option value="Homme">Homme</option>
                                    <option value="Femme">Femme</option>
                                </StyledSelect>
                            </FormGroup>

                            <FormGroup>
                                <Label>Description</Label>
                                <StyledTextarea
                                    rows={3}
                                    placeholder="Description"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                />
                            </FormGroup>
                        </FormGrid>

                        <ButtonGroup>
                            <Button type="submit" $primary>
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
        </Container>
    );
}

// Tous les styles restent identiques
const Container = styled.div`
    min-height: 100vh;
    background-color: #f5f5f5;
`;

const Content = styled.div`
    padding: 2rem;
    margin-top: 60px;
    margin-left: 250px;
    display: flex;
    justify-content: center;

    @media (max-width: 1024px) {
        margin-left: 0;
        padding: 1rem;
    }
`;

const FormContainer = styled.div`
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
`;

const AvatarSection = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
`;

const AvatarWrapper = styled.div`
    position: relative;
    cursor: pointer;
    
    &:hover div {
        opacity: 1;
    }
`;

const StyledAvatar = styled(Avatar)`
    width: 150px !important;
    height: 150px !important;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UploadOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    color: white;
    
    span {
        font-size: 14px;
        margin-top: 4px;
    }
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
`;

const FormGroup = styled.div`
    &:nth-last-child(1) {
        grid-column: 1 / -1;
    }
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
`;

const inputStyles = `
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    
    &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
        color: #9ca3af;
    }
`;

const StyledInput = styled.input`
    ${inputStyles}
`;

const StyledSelect = styled.select`
    ${inputStyles}
`;

const StyledTextarea = styled.textarea`
    ${inputStyles}
    resize: vertical;
    min-height: 100px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 3rem;

    @media (max-width: 480px) {
        flex-direction: column;
    }
`;

const Button = styled.button`
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    background-color: ${props => props.$primary ? '#3b82f6' : '#9ca3af'};
    color: white;
    min-width: 150px;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: ${props => props.$primary ? '#2563eb' : '#6b7280'};
    }

    &:active {
        transform: translateY(0);
    }

    @media (max-width: 480px) {
        width: 100%;
    }
`;