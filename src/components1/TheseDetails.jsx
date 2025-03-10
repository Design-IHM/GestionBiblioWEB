import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Rating, Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { FiArrowLeft, FiEdit2, FiDownload, FiBookmark, FiCalendar, FiUser, FiGrid, FiBook, FiMapPin, FiFileText } from 'react-icons/fi';
import Sidebar from "../components1/Sidebar";
import Navbar from "../components1/Navbar";
import Loading from "./Loading";
import firebase from '../metro.config';
import { useI18n } from "../Context/I18nContext"; // Assurez-vous que ce chemin est correct

// Composants stylisés pour le design
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 0;

  @media (min-width: 1081px) {
    margin-left: 18vw;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: chocolate;
  }
`;

const ThesisImage = styled.div`
  flex: 0 0 300px;
  padding: 20px;

  img {
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    flex: 1;
    margin-bottom: 20px;
  }
`;

const ThesisInfo = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
  width: 100%;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  span {
    color: #666;
  }
`;

const MatriculeDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;

  .label {
    color: #888;
    margin-right: 10px;
  }

  .value {
    font-weight: bold;
    color: #555;
  }
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;

  .count {
    color: #888;
    margin-left: 10px;
  }
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  width: 100%;
`;

const InfoTable = styled.div`
  margin-bottom: 20px;
  width: 100%;

  .row {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 8px 0;
    width: 100%;

    .label {
      flex: 0 0 150px;
      color: #888;
    }

    .value {
      flex: 1;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Button)`
  text-transform: none !important;
  border-radius: 20px !important;
  padding: 8px 20px !important;
`;

const CommentSection = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const CommentCard = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
`;

const ImagePreview = styled.div`
  width: 100%;
  margin-bottom: 15px;

  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    display: block;
    margin: 0 auto;
  }

  .placeholder {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, #ff7f50, #ff1493);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
  }
`;

// Alerte personnalisée
const CustomAlert = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.type === "success" ? "#4CAF50" : "#F44336"};
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  min-width: 300px;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;

// Dialogue de confirmation de suppression
const DeleteConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const DialogTitle = styled.h3`
  margin-top: 0;
  color: #333;
`;

const DialogText = styled.p`
  color: #666;
  margin-bottom: 20px;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export default function TheseDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const thesis = location.state?.memory || {};
  
  // Debug: vérifier si thesis.matricule est défini
  console.log("ID de la thèse:", thesis.matricule);
  console.log("Thèse complète:", thesis);

  // États pour les champs de la thèse
  const [name, setName] = useState(thesis.name || '');
  const [matricule, setMatricule] = useState(thesis.matricule || '');
  const [theme, setTheme] = useState(thesis.theme || '');
  const [department, setDepartment] = useState(thesis.département || '');
  const [year, setYear] = useState(thesis.annee || '');
  const [shelf, setShelf] = useState(thesis.etagere || '');
  const [supervisor, setSupervisor] = useState(thesis.superviseur || '');
  const [abstract, setAbstract] = useState(thesis.abstract || '');
  const [keywords, setKeywords] = useState(thesis.keywords || '');
  const [comments, setComments] = useState(thesis.commentaire || []);
  const [image, setImage] = useState(thesis.image || '');
  const [pdfUrl, setPdfUrl] = useState(thesis.pdfUrl || '');
  
  // État pour le modal d'édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  
  // États pour le chargement et les alertes
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // État pour le nouveau commentaire
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(0);

  // Contexte i18n
  const { language } = useI18n();

  // Traductions
  const translations = {
    thesis_updated: language === "FR" ? "Mémoire mis à jour avec succès !" : "Thesis updated successfully!",
    failed_update: language === "FR" ? "Échec de la mise à jour du mémoire. Veuillez réessayer." : "Failed to update thesis. Please try again.",
    thesis_deleted: language === "FR" ? "Mémoire supprimé avec succès !" : "Thesis deleted successfully!",
    failed_delete: language === "FR" ? "Échec de la suppression du mémoire. Veuillez réessayer." : "Failed to delete thesis. Please try again.",
    comment_added: language === "FR" ? "Commentaire ajouté avec succès !" : "Comment added successfully!",
    failed_comment: language === "FR" ? "Échec de l'ajout du commentaire. Veuillez réessayer." : "Failed to add comment. Please try again.",
    failed_image_upload: language === "FR" ? "Échec du téléchargement de l'image. Le mémoire sera mis à jour sans changer l'image." : "Failed to upload image. The thesis will be updated without changing the image.",
    confirm_delete: language === "FR" ? "Êtes-vous sûr de vouloir supprimer ce mémoire ?" : "Are you sure you want to delete this thesis?",
    edit_thesis: language === "FR" ? "Modifier le mémoire" : "Edit Thesis",
    cancel: language === "FR" ? "Annuler" : "Cancel",
    save_changes: language === "FR" ? "Sauvegarder les modifications" : "Save Changes",
    saving: language === "FR" ? "Enregistrement en cours..." : "Saving...",
    deleting: language === "FR" ? "Suppression en cours..." : "Deleting...",
    processing: language === "FR" ? "Traitement en cours..." : "Processing...",
    comments: language === "FR" ? "Commentaires" : "Comments",
    no_comments: language === "FR" ? "Aucun commentaire pour le moment." : "No comments yet.",
    anonymous: language === "FR" ? "Anonyme" : "Anonymous",
    ratings: language === "FR" ? "évaluations" : "ratings",
    category: language === "FR" ? "Département" : "Department",
    year: language === "FR" ? "Année" : "Year",
    delete: language === "FR" ? "Supprimer" : "Delete",
    bookshelf: language === "FR" ? "Étagère" : "Bookshelf",
    not_specified: language === "FR" ? "Non spécifié" : "Not specified",
    abstract: language === "FR" ? "Résumé" : "Abstract",
    no_abstract: language === "FR" ? "Aucun résumé disponible pour ce mémoire." : "No abstract available for this thesis.",
    upload_cover_image: language === "FR" ? "Télécharger une image de couverture" : "Upload Cover Image",
    change_cover_image: language === "FR" ? "Changer l'image de couverture" : "Change Cover Image",
    student_name: language === "FR" ? "Nom de l'étudiant" : "Student Name",
    student_id: language === "FR" ? "Matricule" : "Student ID",
    thesis_theme: language === "FR" ? "Thème du mémoire" : "Thesis Theme",
    thesis_details: language === "FR" ? "Détails du Mémoire" : "Thesis Details",
    supervisor: language === "FR" ? "Superviseur" : "Supervisor",
   
  };

  // Fonction pour afficher une alerte personnalisée
  const displayAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Masquer l'alerte après 5 secondes
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Réinitialiser les valeurs du formulaire à l'ouverture du modal
  const handleOpenModal = () => {
    setName(thesis.name || '');
    setMatricule(thesis.matricule || '');
    setTheme(thesis.theme || '');
    setDepartment(thesis.département || '');
    setYear(thesis.annee || '');
    setShelf(thesis.etagere || '');
    setSupervisor(thesis.superviseur || '');
    setAbstract(thesis.abstract || '');
    setKeywords(thesis.keywords || '');
    setImage(thesis.image || '');
    setPdfUrl(thesis.pdfUrl || '');
    setImageFile(null);
    setPdfFile(null);
    setIsModalOpen(true);
  };

  // Gérer le changement de fichier image
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Créer une URL de prévisualisation pour l'image
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gérer le changement de fichier PDF
  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
    }
  };

  // Télécharger l'image vers Firebase Storage et obtenir l'URL
  const uploadImage = async () => {
    if (!imageFile) return thesis.image || ''; // Retourner l'image existante si pas de nouveau fichier

    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`thesis_covers/${thesis.matricule}_${Date.now()}`);
      await fileRef.put(imageFile);
      const url = await fileRef.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      displayAlert(translations.failed_image_upload, "error");
      return thesis.image || '';
    }
  };

  // Télécharger le PDF vers Firebase Storage et obtenir l'URL
  const uploadPdf = async () => {
    if (!pdfFile) return thesis.pdfUrl || ''; // Retourner l'URL existante si pas de nouveau fichier

    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`thesis_pdfs/${thesis.matricule}_${Date.now()}.pdf`);
      await fileRef.put(pdfFile);
      const url = await fileRef.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      displayAlert("Échec du téléchargement du PDF.", "error");
      return thesis.pdfUrl || '';
    }
  };

  // Mettre à jour les détails du mémoire dans Firebase
  const handleUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Vérifier si thesis.matricule existe
      if (!thesis.matricule) {
        console.error("Error: thesis.matricule is undefined or null");
        setTimeout(() => {
          setIsLoading(false);
          displayAlert(translations.failed_update, "error");
        }, 3000);
        return;
      }
      
      const imageUrl = await uploadImage();
      const pdfUrl = await uploadPdf();
      
      // Mettre à jour le document dans Firestore
      await firebase.firestore().collection("Memoire").doc(thesis.matricule).update({
        name,
        theme,
        département: department,
        annee: parseInt(year),
        etagere: shelf,
        superviseur: supervisor,
        abstract,
        keywords,
        commentaire: comments,
        image: imageUrl,
        pdfUrl,
      });

      // Mettre à jour l'objet thesis local
      thesis.name = name;
      thesis.theme = theme;
      thesis.département = department;
      thesis.annee = parseInt(year);
      thesis.etagere = shelf;
      thesis.superviseur = supervisor;
      thesis.abstract = abstract;
      thesis.keywords = keywords;
      thesis.image = imageUrl;
      thesis.pdfUrl = pdfUrl;

      // Attendre 3 secondes avant d'afficher l'alerte et de fermer le modal
      setTimeout(() => {
        setIsLoading(false);
        displayAlert(translations.thesis_updated);
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating thesis:", error);
      // Attendre 3 secondes même en cas d'erreur
      setTimeout(() => {
        setIsLoading(false);
        displayAlert(translations.failed_update, "error");
      }, 3000);
    }
  };

  // Ouvrir la boîte de dialogue de confirmation de suppression
  const handleOpenDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // Supprimer le mémoire de Firebase
  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    setIsLoading(true);
    
    try {
      // Utiliser l'ID unique si disponible
      const thesisId = thesis.matricule;
      
      if (!thesisId) {
        displayAlert("Impossible de supprimer : identifiant manquant", "error");
        setIsLoading(false);
        return;
      }
      
      // Supprimer le document
      await firebase.firestore().collection("Memoire").doc(thesisId).delete();
      
      setTimeout(() => {
        setIsLoading(false);
        displayAlert(translations.thesis_deleted);
        
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      
      setTimeout(() => {
        setIsLoading(false);
        displayAlert(translations.failed_delete, "error");
      }, 1000);
    }
  };

  // Ajouter un nouveau commentaire
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    
    // Vérifier si thesis.matricule existe
    if (!thesis.matricule) {
      console.error("Error: thesis.matricule is undefined or null");
      setTimeout(() => {
        setIsLoading(false);
        displayAlert(translations.failed_comment, "error");
      }, 3000);
      return;
    }

    const newCommentObj = {
      nomUser: "Current User", // Dans une vraie application, obtenir de l'authentification
      heure: firebase.firestore.Timestamp.now(),
      note: commentRating,
      texte: newComment
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);

    try {
      await firebase.firestore().collection("Memoire").doc(thesis.matricule).update({
        commentaire: updatedComments
      });
      
      // Attendre 3 secondes avant d'afficher l'alerte
      setTimeout(() => {
        setIsLoading(false);
        setNewComment("");
        setCommentRating(0);
        displayAlert(translations.comment_added);
      }, 3000);
    } catch (error) {
      console.error("Error adding comment:", error);
      setTimeout(() => {
        setIsLoading(false);
        displayAlert(translations.failed_comment, "error");
      }, 3000);
    }
  };

  // Calculer la note moyenne
  const averageRating = comments && comments.length > 0
    ? comments.reduce((sum, comment) => sum + (comment.note || 0), 0) / comments.length
    : 0;

  // Style du modal
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
  };

  // Si l'objet de thèse n'existe pas, rediriger vers la page précédente
  useEffect(() => {
    if (!thesis || Object.keys(thesis).length === 0) {
      navigate(-1);
    }
  }, [thesis, navigate]);

  if (!thesis || Object.keys(thesis).length === 0) {
    return (
      <div className="content-box">
        <Sidebar />
        <Navbar />
        <MainContent>
          <Loading />
        </MainContent>
      </div>
    );
  }

  return (
    <Container>
      <Sidebar />
      <Navbar />

      <MainContent>
        <ContentWrapper>
          <ThesisImage>
            {thesis.image ? (
              <img src={thesis.image} alt={thesis.theme} />
            ) : (
              <div style={{
                width: '100%',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '8px',
                color: 'white',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #ff7f50, #ff1493)'
              }}>
                <Typography variant="h4" style={{ fontFamily: 'cursive', color: 'white', marginBottom: '10px' }}>
                  {thesis.theme}
                </Typography>
                <Typography variant="subtitle1" style={{ color: 'white', fontWeight: 'bold' }}>
                  {name}
                </Typography>
              </div>
            )}
          </ThesisImage>

          <ThesisInfo>
            <Title>{thesis.theme}</Title>

            <RatingDisplay>
              <Rating value={averageRating} readOnly precision={0.5} />
              <span className="count">({comments.filter(c => c.note > 0).length} {translations.ratings})</span>
            </RatingDisplay>

            <Author>
              <FiUser size={20} style={{ marginRight: '10px', color: 'chocolate' }} />
              <span>{thesis.name}</span>
            </Author>
           

            <MatriculeDisplay>
              <div className="label">
                <FiBookmark size={16} style={{ marginRight: '5px', color: 'chocolate' }} />
                {translations.student_id}:
              </div>
              <div className="value">{thesis.matricule}</div>
            </MatriculeDisplay>

            

           

            <InfoTable>
        
              <div className="row">
                <div className="label">
                  <FiCalendar size={16} style={{ marginRight: '5px', color: 'chocolate' }} />
                  {translations.year}
                </div>
                <div className="value">{thesis.annee}</div>
              </div>
              <div className="row">
                <div className="label">
                  <FiGrid size={16} style={{ marginRight: '5px', color: 'chocolate' }} />
                  {translations.category}
                </div>
                <div className="value">{thesis.département}</div>
              </div>
              {thesis.superviseur && (
                <div className="row">
                  <div className="label">
                    <FiUser size={16} style={{ marginRight: '5px', color: 'chocolate' }} />
                    {translations.supervisor}
                  </div>
                  <div className="value">{thesis.superviseur}</div>
                </div>
              )}
              <div className="row">
                <div className="label">
                  <FiMapPin size={16} style={{ marginRight: '5px', color: 'chocolate' }} />
                  {translations.bookshelf}
                </div>
                <div className="value">{thesis.etagere || translations.not_specified}</div>
              </div>
              {thesis.keywords && (
                <div className="row">
                  <div className="label">
                    <FiFileText size={16} style={{ marginRight: '5px', color: 'chocolate' }} />
                    {translations.keywords}
                  </div>
                  <div className="value">{thesis.keywords}</div>
                </div>
              )}
            </InfoTable>

            <ButtonRow>
              <ActionButton
                variant="contained"
                style={{ backgroundColor: '#D2691EFF' }}
                onClick={handleOpenModal}
                disabled={isLoading}
              >
                {translations.edit_thesis}
              </ActionButton>
              
              {thesis.pdfUrl && (
                <ActionButton
                  variant="contained"
                  style={{ backgroundColor: '#28a745' }}
                  href={thesis.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={isLoading}
                >
                  <FiDownload style={{ marginRight: '8px' }} />
                  {translations.download_pdf}
                </ActionButton>
              )}
              
              <ActionButton
                variant="outlined"
                style={{ color: '#ff143f', borderColor: '#ff1493' }}
                onClick={handleOpenDeleteConfirm}
                disabled={isLoading}
              >
                {translations.delete}
              </ActionButton>
            </ButtonRow>

            <CommentSection>
              <Typography variant="h6" style={{ marginBottom: '15px', width: '100%' }}>{translations.comments}</Typography>

             

              {/* Liste des commentaires */}
              {comments && comments.length > 0 && comments[0].nomUser ? (
                comments.map((comment, index) => (
                  <CommentCard key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <Typography variant="subtitle2">{comment.nomUser || translations.anonymous}</Typography>
                      <Typography variant="caption">
                        {comment.heure ? new Date(comment.heure.seconds * 1000).toLocaleString() : ""}
                      </Typography>
                    </div>
                    <Rating value={comment.note || 0} readOnly size="small" />
                    <Typography variant="body2" style={{ marginTop: '5px' }}>
                      {comment.texte || ""}
                    </Typography>
                  </CommentCard>
                ))
              ) : (
                <Typography variant="body2" style={{ width: '100%' }}>{translations.no_comments}</Typography>
              )}
            </CommentSection>
          </ThesisInfo>
        </ContentWrapper>
        </MainContent>
        {/* Modal de modification */}
        <Modal
          open={isModalOpen}
          onClose={() => !isLoading && setIsModalOpen(false)}
          aria-labelledby="edit-thesis-modal"
        >
          <Box sx={modalStyle}>
            <Typography id="edit-thesis-modal" variant="h6" component="h2" gutterBottom>
              {translations.edit_thesis}
            </Typography>

            <ImagePreview>
              {image ? (
                <img src={image} alt="Thesis cover preview" />
              ) : (
                <div className="placeholder">
                  <Typography variant="subtitle1">{theme}</Typography>
                </div>
              )}
            </ImagePreview>

            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                id="thesis-image-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={isLoading}
              />
              <label htmlFor="thesis-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  disabled={isLoading}
                >
                  {image ? translations.change_cover_image : translations.upload_cover_image}
                </Button>
              </label>
            </Box>

            <TextField
              fullWidth
              label={translations.student_name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            
            <TextField
              fullWidth
              label={translations.student_id}
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              margin="normal"
              disabled={true} // Le matricule ne devrait pas être modifiable
            />
            
            <TextField
              fullWidth
              label={translations.thesis_theme}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            
            <TextField
              fullWidth
              label={translations.category}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            
            <TextField
              fullWidth
              label={translations.year}
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            
            <TextField
              fullWidth
              label={translations.supervisor}
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            
            
            <TextField
              fullWidth
              label={translations.bookshelf}
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                style={{ borderColor: '#d2691e', color: '#d2691e' }}
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                {translations.cancel}
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdate}
                style={{ backgroundColor: '#d2691e' }}
                disabled={isLoading}
                startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
              >
                {isLoading ? translations.saving : translations.save_changes}
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Dialogue de confirmation de suppression */}
        {showDeleteConfirm && (
          <DeleteConfirmDialog>
            <DialogContent>
              <DialogTitle>{translations.confirm_delete}</DialogTitle>
              <DialogText>
                {language === "FR" 
                  ? `Êtes-vous sûr de vouloir supprimer "${thesis.theme}" ? Cette action est irréversible.` 
                  : `Are you sure you want to delete "${thesis.theme}"? This action cannot be undone.`}
              </DialogText>
              <DialogButtons>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                >
                  {translations.cancel}
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={handleDelete}
                  disabled={isLoading}
                  startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                >
                  {isLoading ? translations.deleting : translations.delete}
                </Button>
              </DialogButtons>
            </DialogContent>
          </DeleteConfirmDialog>
        )}

        {/* Overlay de chargement pour les opérations plein écran */}
        {isLoading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}>
              <CircularProgress size={40} style={{ color: '#D2691E' }} />
              <Typography>{translations.processing}</Typography>
            </div>
          </div>
        )}

        {/* Alerte personnalisée */}
        {showAlert && (
          <CustomAlert type={alertType}>
            {alertMessage}
          </CustomAlert>
        )}
        </Container>
  );
}