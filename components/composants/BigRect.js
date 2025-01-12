import { useNavigation } from '@react-navigation/native';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig'; // Assurez-vous que l'importation est correcte
import { UserContext } from '../navigation/NewNav';
import { UserContexte } from '../vues/MainContainer';

const BigRect = ({ salle, desc, etagere, exemplaire, image, name, cathegorie, datUser, commentaire, nomBD, type }) => {
  const navigation = useNavigation();  // Utilisation de useNavigation pour obtenir l'objet navigation
  const { modal, setModal } = useContext(UserContexte);
  const { currentUserNewNav } = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);

  const voirProduit = () => {
    navigation.navigate('Produit', {
      salle,
      desc,
      etagere,
      exemplaire,
      image,
      name,
      cathegorie,
      datUser,
      commentaire,
      nomBD,
      type,
    });
    setModal(false);
  };

  const ajouter = async () => {
    try {
      const washingtonRef = doc(db, 'BiblioUser', datUser.email);  // Utilisation correcte de db
      await updateDoc(washingtonRef, {
        docRecentRegarder: arrayUnion({ cathegorieDoc: cathegorie, type }),
      });
      voirProduit();
    } catch (error) {
      console.error("Erreur lors de l'ajout à Firebase:", error);
    }
  };

  return (
    <View style={styles.contain}>
      <TouchableOpacity onPress={ajouter}>
        <ImageBackground style={styles.container} source={{ uri: image }}>
          {/* Vous pouvez ajouter d'autres contenus ou styles ici */}
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name.length > 10 ? `${name.slice(0, 10)}...` : name}</Text>
        <Text style={styles.exemplaire}>{exemplaire} ex(s)</Text>
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.modal}>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.modalButton}>
            <Text style={styles.modalText}>Pas intéressé</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.modalButton}>
            <Text style={styles.modalText}>Image inappropriée</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    height: 150,
    width: 100,
    margin: 5,
  },
  container: {
    height: 130,
    width: 100,
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  exemplaire: {
    fontSize: 10,
    color: '#555',
  },
  modal: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 10,
    height: 230,
    width: 150,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: 'white',
    width: '60%',
    height: 35,
    alignSelf: 'center',
    marginVertical: 5,
    borderRadius: 10,
  },
  modalText: {
    textAlign: 'center',
    marginTop: 10,
  },
});

export default BigRect;
