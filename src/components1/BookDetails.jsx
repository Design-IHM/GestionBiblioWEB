import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "../metro.config";
import { Modal, Box, Typography, Button, TextField, Rating } from '@mui/material';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styled from 'styled-components';
import { useI18n } from "../Context/I18nContext"; // Ensure this path is correct

// Styled components for the new design
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
  margin-left: 18vw;
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

// Main wrapper to ensure full width layout
const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default function BookDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const book = location.state?.book || {};

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
    comments: language === "FR" ? "Commentaires" : "Comments",
    no_comments: language === "FR" ? "Aucun commentaire pour le moment." : "No comments yet.",
    anonymous: language === "FR" ? "Anonyme" : "Anonymous",
    ratings: language === "FR" ? "évaluations" : "ratings",
    publisher: language === "FR" ? "Éditeur" : "Publisher",
    category: language === "FR" ? "Catégorie" : "Category",
    quantity: language === "FR" ? "Quantité" : "Quantity",
    delete: language === "FR" ? "Supprimer le livre" : "Delete",
    bookshelf: language === "FR" ? "Étagère" : "Bookshelf",
    room: language === "FR" ? "Salle" : "Room",
    not_specified: language === "FR" ? "Non spécifié" : "Not specified",
    description: language === "FR" ? "Description" : "Description",
    no_description: language === "FR" ? "Aucune description disponible pour ce livre. Vous pouvez ajouter des détails en cliquant sur le bouton Modifier le livre." : "No description available for this book. You can add details by clicking the Edit Book button.",
    upload_cover_image: language === "FR" ? "Télécharger une image de couverture" : "Upload Cover Image",
    change_cover_image: language === "FR" ? "Changer l'image de couverture" : "Change Cover Image",
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
      alert(translations.failed_image_upload);
      return book.image;
    }
  };

  // Update book details in Firebase
  const handleUpdate = async () => {
    try {
      const imageUrl = await uploadImage();

      await firebase.firestore().collection("BiblioInformatique").doc(book.nomBD).set({
        name,
        exemplaire,
        cathegorie,
        desc,
        etagere,
        salle,
        commentaire: comments,
        image: imageUrl,
      });

      book.name = name;
      book.exemplaire = exemplaire;
      book.cathegorie = cathegorie;
      book.desc = desc;
      book.etagere = etagere;
      book.salle = salle;
      book.image = imageUrl;

      alert(translations.book_updated);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating book:", error);
      alert(translations.failed_update);
    }
  };

  // Delete book from Firebase
  const handleDelete = async () => {
    if (window.confirm(translations.confirm_delete)) {
      try {
        await firebase.firestore().collection("BiblioInformatique").doc(book.nomBD).delete();
        alert(translations.book_deleted);
        navigate(-1);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert(translations.failed_delete);
      }
    }
  };

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

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
      setNewComment("");
      setCommentRating(0);
      alert(translations.comment_added);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(translations.failed_comment);
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
                backgroundColor: '#ff7f50',
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
              <img
                src="https://via.placeholder.com/40"
                alt="Author"
              />
              <span>Author Name</span>
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
                <div className="label">{translations.publisher}</div>
                <div className="value">University Library</div>
              </div>
              <div className="row">
                <div className="label">{translations.category}</div>
                <div className="value">{book.cathegorie}</div>
              </div>
              <div className="row">
                <div className="label">{translations.quantity}</div>
                <div className="value">{book.exemplaire}</div>
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
              >
                {translations.edit_book}
              </ActionButton>
              <ActionButton
                variant="outlined"
                style={{ color: '#ff143f', borderColor: '#ff1493' }}
                onClick={handleDelete}
              >
                {translations.delete}
              </ActionButton>
            </ButtonRow>

            <CommentSection>
              <Typography variant="h6" style={{ marginBottom: '15px', width: '100%' }}>{translations.comments}</Typography>

              {comments.length > 0 && comments[0].nomUser ? (
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
                      {comment.texte || translations.no_comments}
                    </Typography>
                  </CommentCard>
                ))
              ) : (
                <Typography variant="body2" style={{ width: '100%' }}>{translations.no_comments}</Typography>
              )}

            </CommentSection>
          </BookInfo>
        </ContentWrapper>
      </MainContent>

      {/* Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            />
            <label htmlFor="book-image-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
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
          />
          <TextField
            fullWidth
            label={translations.quantity}
            type="number"
            value={exemplaire}
            onChange={(e) => setExemplaire(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={translations.category}
            value={cathegorie}
            onChange={(e) => setCathegorie(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={translations.description}
            multiline
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={translations.bookshelf}
            value={etagere}
            onChange={(e) => setEtagere(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label={translations.room}
            value={salle}
            onChange={(e) => setSalle(e.target.value)}
            margin="normal"
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              style={{ borderColor: '#d2691e', color: '#d2691e' }}
              onClick={() => setIsModalOpen(false)}
            >
              {translations.cancel}
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdate}
              style={{ backgroundColor: '#d2691e' }}
            >
              {translations.save_changes}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
