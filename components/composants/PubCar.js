import { View, Text, Dimensions, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

const HEIGHT= Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

const PubCar = () => {
  return (
    <View style={styles.container}>
      <ImageBackground style={{height:'100%', width:200,}} source={require('../../assets/biblio/biblio1.jpg')}></ImageBackground>
      <ImageBackground style={{height:'100%', width:200}} source={require('../../assets/biblio/fillelivre.jpg')}></ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    marginTop:2,
   // backgroundColor:'red',
    height:150,
    width:WIDTH,
    flexDirection:'row',
    justifyContent:'space-between'
  }
})


export default PubCar