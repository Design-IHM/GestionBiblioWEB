import React, { useState, useRef, useEffect } from "react";
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
import { FaCamera, FaEdit } from 'react-icons/fa';
import { useI18n } from "../Context/I18nContext";

export default function Profil() {
    const [name, setName] = useState('');
    const { language } = useI18n();
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [gender, setGender] = useState('');
    const fileInputRef = useRef();
    const formRef = useRef();
    const navigate = useNavigate();

    const [status, setStatus] = useState(false);
    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchAdminData = async () => {
            if (user_id) {
                const adminDoc = await firebase.firestore().collection('BiblioAdmin').doc(user_id).get();
                if (adminDoc.exists) {
                    const adminData = adminDoc.data();
                    setName(adminData.name);
                    setEmail(adminData.email);
                    setGender(adminData.gender);
                    setUrl(adminData.image);
                }
            }
        };
        fetchAdminData();
    }, [user_id]);

    const handleChangeImage = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (image) {
            const imageRef = ref(storage, `images/${image.name + v4()}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);
            setUrl(imageUrl);
            setImage(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const updateAdmin = async (e) => {
        e.preventDefault();
        if (user_id) {
            await firebase.firestore().collection('BiblioAdmin').doc(user_id).update({
                name,
                email,
                gender,
                image: url,
                updated_at: new Date()
            });
            setStatus(true);
            setType("success");
            setTitle("Informations mises à jour avec succès");
            setIsEditing(false);
        }
    };

    const translations = {
        nom: language === "FR" ? "Nom " : "Name",
        email: language === "FR" ? "E-mail" : "E-mail",
        genre: language === "FR" ? "Genre" : "Gender",
        save: language === "FR" ? "Enregistrer" : "Save",
        ann: language === "FR" ? "Annuler" : "Close",
        select: language === "FR" ? "Selectionner votre genre" : "Select your gender",
        male: language === "FR" ? "Homme" : "male",
        femelle: language === "FR" ? "Femme" : "Female",
        modify: language === "FR" ? "modifier" : "modify"
    };

    return (
        <div className="content-box">
            <Container>
                <Sidebar />
                <Navbar />
                <Content>
                    <FormContainer>
                        <Form ref={formRef} onSubmit={updateAdmin}>
                            <AvatarSection>
                                <AvatarWrapper>
                                    <StyledAvatar src={url} />
                                    <UploadOverlay onClick={triggerFileInput}>
                                        <FaCamera size={24} />
                                        <span>{translations.modify}</span>
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
                                    <Label>{translations.nom}</Label>
                                    <StyledInput
                                        type="text"
                                        placeholder="ex: Jason Derulo"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={!isEditing}
                                    />
                                    <FaEdit onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                </FormGroup>

                                <FormGroup>
                                    <Label>{translations.email}</Label>
                                    <StyledInput
                                        type="email"
                                        placeholder="ex: exemple@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={!isEditing}
                                    />
                                    <FaEdit onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                </FormGroup>

                                <FormGroup>
                                    <Label>{translations.genre}</Label>
                                    <StyledSelect
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required
                                        disabled={!isEditing}
                                    >
                                        <option value="">{translations.select}</option>
                                        <option value="Male">{translations.male}</option>
                                        <option value="Female">{translations.femelle}</option>
                                    </StyledSelect>
                                    <FaEdit onClick={() => setIsEditing(true)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                                </FormGroup>
                            </FormGrid>

                            <ButtonGroup>
                                <Button type="submit" $primary style={{ backgroundColor: "chocolate" }}>
                                    {translations.save}
                                </Button>
                                <Button type="button" onClick={() => navigate("/")}>
                                    {translations.ann}
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
        </div>
    );
}

const Container = styled.div`
    min-height: 90vh;
`;

const Content = styled.div`
    padding: 2rem;
    display: flex;
    justify-content: center;

    @media (max-width: 1024px) {
        margin-left: 0;
        padding: 1rem;
    }
`;

const FormContainer = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
    background-color: rgb(243, 239, 232);
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
    display: flex;
    align-items: center;

    &:nth-last-child(1) {
        grid-column: 1 / -1;
    }
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: chocolate;
    font-size: 1.2rem;
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
        border-color: chocolate;
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
