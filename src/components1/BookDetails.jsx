import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "../metro.config";
import { Modal, Box, Typography, Button, TextField, Rating, CircularProgress } from '@mui/material';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styled from 'styled-components';
import { useI18n } from "../Context/I18nContext"; // Ensure this path is correct

// Styled components for the new design
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

const BookImage = styled.div`
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

const BookInfo = styled.div`
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

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  span {
    color: #666;
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



const CommentSection = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const CommentCard = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
 
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

// Main wrapper to ensure full width layout
const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// Custom Alert Component
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

// Delete Confirmation Dialog
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

// Ajoutez ce composant styled après vos autres styled components
const DeleteButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
  
  &[data-disabled="true"]:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    white-space: normal;
    width: max-content;
    max-width: 200px;
    text-align: center;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease-out;
  }
  
  &[data-disabled="true"]:hover::before {
    content: "";
    position: absolute;
    bottom: 108%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
    z-index: 1000;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;

// Modifiez le style du ActionButton pour ajouter le curseur not-allowed
const ActionButton = styled(Button)`
  text-transform: none !important;
  border-radius: 20px !important;
  padding: 8px 20px !important;
  
  &:disabled {
    cursor: not-allowed !important;
    position: relative;
  }
  
  &:disabled::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom right, transparent calc(50% - 1px), red, transparent calc(50% + 1px));
    border-radius: 20px;
    pointer-events: none;
  }
`;

export default function BookDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book || {};
  
  // Debug: vérifier si book.nomBD est défini
  

  const [name, setName] = useState(book.name);
  const [exemplaire, setExemplaire] = useState(book.exemplaire);
  const [cathegorie, setCathegorie] = useState(book.cathegorie);
  const [desc, setDesc] = useState(book.desc);
  const [etagere, setEtagere] = useState(book.etagere);
  const [salle, setSalle] = useState(book.salle);
  const [comments, setComments] = useState(book.commentaire || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [image, setImage] = useState(book.image);
  const [imageFile, setImageFile] = useState(null);
  const [auteur, setAuteur] = useState(book.auteur || '');
  const [edition, setEdition] = useState(book.edition || '');
  const [canBeDeleted, setCanBeDeleted] = useState(true);
  const [deleteBlockReason, setDeleteBlockReason] = useState("");
  
  // État pour le chargement
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour les alertes personnalisées
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Contexte i18n
  const { language } = useI18n();

  // Traductions
  const translations = {
    book_updated: language === "FR" ? "Livre mis à jour avec succès !" : "Book updated successfully!",
    failed_update: language === "FR" ? "Échec de la mise à jour du livre. Veuillez réessayer." : "Failed to update book. Please try again.",
    book_deleted: language === "FR" ? "Livre supprimé avec succès !" : "Book deleted successfully!",
    failed_delete: language === "FR" ? "Échec de la suppression du livre. Veuillez réessayer." : "Failed to delete book. Please try again.",
    comment_added: language === "FR" ? "Commentaire ajouté avec succès !" : "Comment added successfully!",
    failed_comment: language === "FR" ? "Échec de l'ajout du commentaire. Veuillez réessayer." : "Failed to add comment. Please try again.",
    failed_image_upload: language === "FR" ? "Échec du téléchargement de l'image. Le livre sera mis à jour sans changer l'image." : "Failed to upload image. The book will be updated without changing the image.",
    confirm_delete: language === "FR" ? "Êtes-vous sûr de vouloir supprimer ce livre ?" : "Are you sure you want to delete this book?",
    edit_book: language === "FR" ? "Modifier le livre" : "Edit Book",
    cancel: language === "FR" ? "Annuler" : "Cancel",
    save_changes: language === "FR" ? "Sauvegarder les modifications" : "Save Changes",
    saving: language === "FR" ? "Enregistrement en cours..." : "Saving...",
    deleting: language === "FR" ? "Suppression en cours..." : "Deleting...",
    processing: language === "FR" ? "Traitement en cours..." : "Processing...",
    comments: language === "FR" ? "Commentaires" : "Comments",
    no_comments: language === "FR" ? "Aucun commentaire pour le moment." : "No comments yet.",
    anonymous: language === "FR" ? "Anonyme" : "Anonymous",
    ratings: language === "FR" ? "évaluations" : "ratings",
    publisher: language === "FR" ? "Éditeur" : "Publisher",
    category: language === "FR" ? "Catégorie" : "Category",
    quantity: language === "FR" ? "Stock courant" : "Current stock",
    initial_stock: language === "FR" ? "Stock initial" : "Initial Stock",
    delete: language === "FR" ? "Supprimer le livre" : "Delete",
    bookshelf: language === "FR" ? "Étagère" : "Bookshelf",
    room: language === "FR" ? "Salle" : "Room",
    not_specified: language === "FR" ? "Non spécifié" : "Not specified",
    description: language === "FR" ? "Description" : "Description",
    no_description: language === "FR" ? "Aucune description disponible pour ce livre. Vous pouvez ajouter des détails en cliquant sur le bouton Modifier le livre." : "No description available for this book. You can add details by clicking the Edit Book button.",
    upload_cover_image: language === "FR" ? "Télécharger une image de couverture" : "Upload Cover Image",
    change_cover_image: language === "FR" ? "Changer l'image de couverture" : "Change Cover Image",
    author: language === "FR" ? "Auteur" : "Author",
    edition: language === "FR" ? "Édition" : "Edition",
  };

  // Function to show custom alert
  const displayAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Hide alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Reset form values when modal is opened
  const handleOpenModal = () => {
    setName(book.name);
    setExemplaire(book.exemplaire);
    setCathegorie(book.cathegorie);
    setDesc(book.desc);
    setEtagere(book.etagere);
    setSalle(book.salle);
    setImage(book.image);
    setAuteur(book.auteur || '');
    setEdition(book.edition || '');
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Handle image file change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Firebase Storage and get URL
  const uploadImage = async () => {
    if (!imageFile) return book.image; // Return existing image if no new file

    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`book_covers/${book.nomBD}_${Date.now()}`);
      await fileRef.put(imageFile);
      const url = await fileRef.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      displayAlert(translations.failed_image_upload, "error");
      return book.image;
    }
  };

  // Update book details in Firebase
  const handleUpdate = async () => {
    setIsLoading(true); // Démarrer le chargement
    
    try {
      // Vérifier si book.nomBD existe
      if (!book.nomBD) {
        console.error("Error: book.nomBD is undefined or null");
        setTimeout(() => {
          setIsLoading(false); // Arrêter le chargement
          displayAlert(translations.failed_update, "error");
        }, 3000);
        return;
      }
      
      const imageUrl = await uploadImage();
      
      // Utiliser update() au lieu de set() pour ne modifier que les champs spécifiés
      await firebase.firestore().collection("BiblioInformatique").doc(book.nomBD).update({
        name,
        exemplaire,
        cathegorie,
        desc,
        etagere,
        salle,
        auteur,
        edition,
        commentaire: comments,
        image: imageUrl,
      });

      // Mettre à jour l'objet book local
      book.name = name;
      book.exemplaire = exemplaire;
      book.cathegorie = cathegorie;
      book.desc = desc;
      book.etagere = etagere;
      book.salle = salle;
      book.auteur = auteur; 
      book.edition = edition;
      book.image = imageUrl;

      // Attendre 3 secondes avant d'afficher l'alerte et de fermer la modal
      setTimeout(() => {
        setIsLoading(false); // Arrêter le chargement
        displayAlert(translations.book_updated);
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating book:", error);
      // Attendre 3 secondes même en cas d'erreur
      setTimeout(() => {
        setIsLoading(false); // Arrêter le chargement
        displayAlert(translations.failed_update, "error");
      }, 3000);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  // Delete book from Firebase
  const handleDelete = async () => {
    const collectionRef = firebase.firestore().collection("BiblioInformatique");
    setShowDeleteConfirm(false);
    setIsLoading(true);
    
    try {
      
  
      // Utiliser l'ID unique si disponible
      const bookId = book.id || book.nomBD || book.name;
  
      if (!bookId) {
     
        displayAlert("Impossible de supprimer : identifiant manquant", "error");
        setIsLoading(false);
        console.groupEnd();
        return;
      }
  
      
      
      // Essayer de supprimer par l'ID
      await collectionRef.doc(bookId).delete();
  
     
      
      setTimeout(() => {
        setIsLoading(false);
        displayAlert(translations.book_deleted);
        
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }, 1000);
  
      console.groupEnd();
  
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      
      // Si la suppression par ID échoue, essayer de trouver par nom et catégorie
      try {
        const query = collectionRef
          .where('name', '==', book.name)
          .where('cathegorie', '==', book.cathegorie);
  
        const querySnapshot = await query.get();
  
        if (!querySnapshot.empty) {
          const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());
          await Promise.all(deletePromises);
          
          
        }
  
        setTimeout(() => {
          setIsLoading(false);
          displayAlert(translations.book_deleted);
          navigate("/catalogue");
        }, 1000);
  
      } catch (fallbackError) {
        console.error('Erreur de fallback :', fallbackError);
        
        setTimeout(() => {
          setIsLoading(false);
          displayAlert(translations.book_deleted);
          setTimeout(() => {
            navigate(-1);
          }, 1500);
        }, 1000);
      }
    }
  };

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsLoading(true); // Démarrer le chargement
    
    // Vérifier si book.nomBD existe
    if (!book.nomBD) {
      console.error("Error: book.nomBD is undefined or null");
      setTimeout(() => {
        setIsLoading(false); // Arrêter le chargement
        displayAlert(translations.failed_comment, "error");
      }, 3000);
      return;
    }

    const newCommentObj = {
      nomUser: "Current User", // In a real app, get from auth
      heure: firebase.firestore.Timestamp.now(),
      note: commentRating,
      texte: newComment
    };

    const updatedComments = [...comments, newCommentObj];
    setComments(updatedComments);

    try {
      await firebase.firestore().collection("BiblioInformatique").doc(book.nomBD).update({
        commentaire: updatedComments
      });
      
      // Attendre 3 secondes avant d'afficher l'alerte
      setTimeout(() => {
        setIsLoading(false); // Arrêter le chargement
        setNewComment("");
        setCommentRating(0);
        displayAlert(translations.comment_added);
      }, 3000);
    } catch (error) {
      console.error("Error adding comment:", error);
      setTimeout(() => {
        setIsLoading(false); // Arrêter le chargement
        displayAlert(translations.failed_comment, "error");
      }, 3000);
    }
  };

  // Calculate average rating
  const averageRating = comments.length > 0
    ? comments.reduce((sum, comment) => sum + (comment.note || 0), 0) / comments.length
    : 0;

  // Modal style
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
  // Modifiez la fonction checkBookDeletability
  const checkBookDeletability = async () => {
    try {
      // Si aucun livre n'est chargé, ne pas procéder
      if (!book || !book.name) {
        setCanBeDeleted(true);
        setDeleteBlockReason('');
        return;
      }
  
      // Récupérer tous les utilisateurs
      const usersSnapshot = await firebase.firestore().collection("BiblioUser").get();
      
      let isBookReservedOrBorrowed = false;
      
      // Boucle synchrone pour vérifier chaque utilisateur
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Vérifier chaque état et tableau d'état
        const checkStates = [
          { state: userData.etat1, tab: userData.tabEtat1 },
          { state: userData.etat2, tab: userData.tabEtat2 },
          { state: userData.etat3, tab: userData.tabEtat3 }
        ];
        
        // Vérification rapide pour chaque état
        for (const stateCheck of checkStates) {
          if (
            (stateCheck.state === 'reserv' || stateCheck.state === 'emprunt') &&
            stateCheck.tab && 
            stateCheck.tab[0] === book.name
          ) {
            isBookReservedOrBorrowed = true;
            break; // Sortir immédiatement si réservé ou emprunté
          }
        }
  
        // Sortir si le livre est déjà réservé/emprunté
        if (isBookReservedOrBorrowed) break;
      }
  
      // Mise à jour finale des états
      setCanBeDeleted(!isBookReservedOrBorrowed);
      
      // Définir le message selon la langue
      if (isBookReservedOrBorrowed) {
        setDeleteBlockReason(
          language === "FR" 
            ? "Ce livre ne peut pas être supprimé car il fait l'objet d'un emprunt ou d'une réservation." 
            : "This book cannot be deleted as it is currently borrowed or reserved."
        );
      } else {
        setDeleteBlockReason('');
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la suppression :", error);
      // En cas d'erreur, autoriser la suppression
      setCanBeDeleted(true);
      setDeleteBlockReason('');
    }
  };
  
  // Modification du useEffect pour s'assurer de la vérification immédiate
  useEffect(() => {
    // Vérifier immédiatement si un livre est chargé
    if (book && book.name) {
      checkBookDeletability();
    } else {
      // Si pas de livre, activer la suppression
      setCanBeDeleted(true);
      setDeleteBlockReason('');
    }
  }, [book, language]);
  return (
    <Container>
      <Sidebar />
      <Navbar />

      <MainContent>
        <ContentWrapper>
          <BookImage>
            {book.image ? (
              <img src={book.image} alt={book.name} />
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
                  {book.name}
                </Typography>
                <Typography variant="subtitle1" style={{ color: 'white', fontWeight: 'bold' }}>
                  {translations.no_description}
                </Typography>
              </div>
            )}
          </BookImage>

          <BookInfo>
            <Title>{book.name}</Title>

            <Author>
              <span>{book.auteur || translations.author}</span>
            </Author>
            

            <RatingDisplay>
              <Rating value={averageRating} readOnly precision={0.5} />
              <span className="count">({comments.filter(c => c.note > 0).length} {translations.ratings})</span>
            </RatingDisplay>

            <Description>
              {book.desc || translations.no_description}
            </Description>

            <InfoTable>
           
              <div className="row">
                <div className="label">{translations.edition}</div>
                <div className="value">{book.edition || translations.not_specified}</div>
              </div>
              <div className="row">
                <div className="label">{translations.category}</div>
                <div className="value">{book.cathegorie}</div>
              </div>
              <div className="row">
              <div className="label">{translations.initial_stock}</div>
              <div className="value" style={{ fontWeight: 'bold' }}>
                {book.initialExemplaire}
              </div>
            </div>
              <div className="row">
                <div className="label">{translations.quantity}</div>
                <div className="value" style={{
                    color: book.exemplaire > 0 ? 'green' : 'red',
                    fontWeight: book.exemplaire > 0 ? 'normal' : 'bold',
                  }}>{book.exemplaire}</div>
              </div>
              <div className="row">
                <div className="label">{translations.bookshelf}</div>
                <div className="value">{book.etagere || translations.not_specified}</div>
              </div>
              <div className="row">
                <div className="label">{translations.room}</div>
                <div className="value">{book.salle || translations.not_specified}</div>
              </div>
            </InfoTable>

            <ButtonRow>
            <ActionButton
              variant="contained"
              style={{ backgroundColor: '#D2691EFF' }}
              onClick={handleOpenModal}
              disabled={isLoading}
            >
              {translations.edit_book}
            </ActionButton>
  
          <DeleteButtonWrapper 
            data-disabled={!canBeDeleted} 
            data-tooltip={deleteBlockReason}
          >
            <ActionButton
              variant="outlined"
              style={{ 
                color: canBeDeleted ? '#ff143f' : 'grey', 
                borderColor: canBeDeleted ? '#ff1493' : 'grey'
              }}
              onClick={handleOpenDeleteConfirm}
              disabled={!canBeDeleted}
            >
              {translations.delete}
            </ActionButton>
          </DeleteButtonWrapper>
          </ButtonRow>

            <CommentSection>
                <Typography variant="h6" style={{ marginBottom: '15px', width: '100%' }}>{translations.comments}</Typography>

                {comments.length > 0 ? (
                  comments
                    .sort((a, b) => (b.heure?.seconds || 0) - (a.heure?.seconds || 0))
                    .slice(0, 2)
                    .map((comment, index) => (
                      <CommentCard key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <Typography variant="subtitle2">{comment.nomUser || translations.anonymous}</Typography>
                          <Typography variant="caption">
                            {comment.heure ? new Date(comment.heure.seconds * 1000).toLocaleString() : ""}
                          </Typography>
                        </div>
                        <Rating value={comment.note || 0} readOnly size="small" />
                        <Typography variant="body2" style={{ marginTop: '5px' }}>
                          {comment.texte}
                        </Typography>
                      </CommentCard>
                    ))
                ) : (
                  comments.length === 0 && (
                    <Typography variant="body2" style={{ width: '100%' }}>{translations.no_comments}</Typography>
                  )
                )}
</CommentSection>
          </BookInfo>
        </ContentWrapper>
      </MainContent>

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        aria-labelledby="edit-book-modal"
      >
        <Box sx={modalStyle}>
          <Typography id="edit-book-modal" variant="h6" component="h2" gutterBottom>
            {translations.edit_book}
          </Typography>

          <ImagePreview>
            {image ? (
              <img src={image} alt="Book cover preview" />
            ) : (
              <div className="placeholder">
                <Typography variant="subtitle1">{name}</Typography>
              </div>
            )}
          </ImagePreview>

          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              id="book-image-upload"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={isLoading}
            />
            <label htmlFor="book-image-upload">
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
            label={translations.edit_book}
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label={translations.quantity}
            type="number"
            value={exemplaire}
            onChange={(e) => setExemplaire(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <TextField
                fullWidth
                label={translations.author}
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                margin="normal"
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label={translations.edition}
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                margin="normal"
                disabled={isLoading}
              />
          <TextField
            fullWidth
            label={translations.category}
            value={cathegorie}
            onChange={(e) => setCathegorie(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label={translations.description}
            multiline
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label={translations.bookshelf}
            value={etagere}
            onChange={(e) => setEtagere(e.target.value)}
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label={translations.room}
            value={salle}
            onChange={(e) => setSalle(e.target.value)}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <DeleteConfirmDialog>
          <DialogContent>
            <DialogTitle>{translations.confirm_delete}</DialogTitle>
            <DialogText>
              {language === "FR" 
                ? `Êtes-vous sûr de vouloir supprimer "${book.name}" ? Cette action est irréversible.` 
                : `Are you sure you want to delete "${book.name}"? This action cannot be undone.`}
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

      {/* Loading Overlay for full-screen operations */}
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

      {/* Custom Alert */}
      {showAlert && (
        <CustomAlert type={alertType}>
          {alertMessage}
        </CustomAlert>
      )}
    </Container>
  );
}