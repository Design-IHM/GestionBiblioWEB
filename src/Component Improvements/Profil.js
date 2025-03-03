import React, { useState, useRef, useEffect } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
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
    const [isImageUploading, setIsImageUploading] = useState(false);

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
            const selectedImage = e.target.files[0];
            setImage(selectedImage);

            // Create a local URL for the image preview
            const localImageUrl = URL.createObjectURL(selectedImage);
            setUrl(localImageUrl);
        }
    };

    const uploadImageToFirebase = async () => {
        if (!image) return null;

        setIsImageUploading(true);
        try {
            // Generate a unique name for the image
            const imageName = image.name + v4();
            const imageRef = ref(storage, `images/${imageName}`);

            // Upload the image to Firebase Storage
            await uploadBytes(imageRef, image);

            // Get the download URL
            const downloadUrl = await getDownloadURL(imageRef);

            // Update the image URL in the state
            setUrl(downloadUrl);
            setIsImageUploading(false);

            return downloadUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            setIsImageUploading(false);

            // Display an error notification
            setStatus(true);
            setType("error");
            setTitle(language === "FR" ? "Erreur lors du téléchargement de l'image" : "Error uploading image");

            return null;
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const updateAdmin = async (e) => {
        e.preventDefault();

        try {
            let imageUrl = url;

            // If a new image has been selected, upload it first
            if (image) {
                setIsImageUploading(true);
                imageUrl = await uploadImageToFirebase();
                if (!imageUrl) {
                    return; // Stop the update if the upload failed
                }
            }

            // Update the document in Firestore
            if (user_id) {
                await firebase.firestore().collection('BiblioAdmin').doc(user_id).update({
                    name,
                    email,
                    gender,
                    image: imageUrl,
                    updated_at: new Date()
                });

                // Success notification
                setStatus(true);
                setType("success");
                setTitle(language === "FR" ? "Informations mises à jour avec succès" : "Information updated successfully");
                setIsEditing(false);
                setImage(null); // Reset the image state after the update
            }
        } catch (error) {
            console.error("Error updating profile:", error);

            // Error notification
            setStatus(true);
            setType("error");
            setTitle(language === "FR" ? "Erreur lors de la mise à jour" : "Error updating profile");
        } finally {
            setIsImageUploading(false);
        }
    };

    const translations = {
        nom: language === "FR" ? "Nom " : "Name",
        email: language === "FR" ? "E-mail" : "E-mail",
        genre: language === "FR" ? "Genre" : "Gender",
        save: language === "FR" ? "Enregistrer" : "Save",
        ann: language === "FR" ? "Annuler" : "Close",
        select: language === "FR" ? "Selectionner votre genre" : "Select your gender",
        male: language === "FR" ? "Homme" : "Male",
        femelle: language === "FR" ? "Femme" : "Female",
        modify: language === "FR" ? "modifier" : "modify",
        uploading: language === "FR" ? "Téléchargement..." : "Uploading...",
        imageSelected: language === "FR" ? "Image sélectionnée" : "Image selected",
        changePassword: language === "FR" ? "Changer le mot de passe" : "Change Password"
    };

    const passwordTooltip = (
        <Tooltip id="password-tooltip">
            {language === "FR"
                ? "Le mot de passe doit contenir au moins 8 caractères, dont des majuscules, des minuscules, des chiffres et des caractères spéciaux."
                : "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."}
        </Tooltip>
    );

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
                                        <span>
                                            {isImageUploading
                                                ? translations.uploading
                                                : image
                                                    ? translations.imageSelected
                                                    : translations.modify}
                                        </span>
                                    </UploadOverlay>
                                </AvatarWrapper>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleChangeImage}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </AvatarSection>

                            <FormGrid>
                                <FormGroup>
                                    <Label>{translations.nom}</Label>
                                    <InputWrapper>
                                        <StyledInput
                                            type="text"
                                            placeholder="ex: Jason Derulo"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            disabled={!isEditing}
                                        />
                                        <EditIcon onClick={() => setIsEditing(true)}>
                                            <FaEdit />
                                        </EditIcon>
                                    </InputWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>{translations.email}</Label>
                                    <InputWrapper>
                                        <StyledInput
                                            type="email"
                                            placeholder="ex: exemple@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={!isEditing}
                                        />
                                        <EditIcon onClick={() => setIsEditing(true)}>
                                            <FaEdit />
                                        </EditIcon>
                                    </InputWrapper>
                                </FormGroup>

                                <FormGroup>
                                    <Label>{translations.genre}</Label>
                                    <InputWrapper>
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
                                        <EditIcon onClick={() => setIsEditing(true)}>
                                            <FaEdit />
                                        </EditIcon>
                                    </InputWrapper>
                                </FormGroup>
                            </FormGrid>

                            <ButtonGroup>
                                <Button
                                    type="submit"
                                    $primary
                                    style={{ backgroundColor: "chocolate" }}
                                    disabled={isImageUploading}
                                >
                                    {isImageUploading ? translations.uploading : translations.save}
                                </Button>
                                <Button type="button" onClick={() => navigate("/")}>
                                    {translations.ann}
                                </Button>
                                <OverlayTrigger placement="top" overlay={passwordTooltip}>
                                    <Button type="button" onClick={() => navigate("/change-password")}>
                                        {translations.changePassword}
                                    </Button>
                                </OverlayTrigger>
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
    flex-direction: column;
    width: 100%;

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
    width: 100%;
    white-space: nowrap;
    overflow: visible;
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const EditIcon = styled.div`
    cursor: pointer;
    margin-left: 10px;
    color: chocolate;

    &:hover {
        color: #a0522d;
    }
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
        box-shadow: 0 0 0 3px rgba(210, 105, 30, 0.1);
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
    opacity: ${props => props.disabled ? '0.7' : '1'};
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};

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
