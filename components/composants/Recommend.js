import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../firebaseConfig'; // Assurez-vous que l'importation est correcte
import BigRect from './BigRect';

const WIDTH = Dimensions.get('window').width;

const Recommend = () => {
  const [recommendations, setRecommendations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendationsArray = [];
        const querySnapshot = await getDocs(collection(db, 'Recommendations'));
        querySnapshot.forEach((doc) => {
          recommendationsArray.push({ id: doc.id, ...doc.data() });
        });
        setRecommendations(recommendationsArray);
      } catch (error) {
        console.error("Erreur lors de la récupération des recommandations :", error);
      }
    };
    fetchRecommendations();
  }, []);

  const renderBigRect = ({ item }) => (
    <BigRect {...item} navigation={navigation} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Recommandations pour vous</Text>
      </View>
      <FlatList
        data={recommendations}
        renderItem={renderBigRect}
        keyExtractor={(item) => item.id}
        numColumns={8}
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    width: WIDTH,
    marginBottom: 10,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Georgia',
    fontSize: 20,
  },
  gridContainer: {
    alignItems: 'center',
  },
});

export default Recommend;
