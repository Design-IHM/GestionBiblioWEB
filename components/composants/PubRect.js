import { View, Text, ImageBackground, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
const HEIGHT = Dimensions.get('window').height
const WIDTH= Dimensions.get('window').width

const PubRect = () => {
  return (
    <ImageBackground style={styles.container} source={require('../../assets/biblio/bandeAnnonce1.jpg')} >
      
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
  container:{
    width:WIDTH,
    height:100,
    marginTop:5
  }
})

export default PubRect