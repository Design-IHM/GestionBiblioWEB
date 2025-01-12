// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image
} from 'react-native';

import {onAuthStateChanged} from "firebase/auth"
import { auth } from '../../config';


//import AsyncStorage from '@react-native-community/async-storage';

const Screen = ({navigation}) => {
 //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true)

 const [loadingData, setLoadingData] = useState(false)


  useEffect(() =>{
    onAuthStateChanged(auth, ()=>{
       setLoadingData(true)  
     })
  //   console.log('current user', currentUser)  
   },[])
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
        navigation.replace(
          loadingData === false ? 'NavLogin' : 'NavApp'
        )
    
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/enspy.jpg')}
        style={{width: '90%', resizeMode: 'contain', margin: 30}}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});