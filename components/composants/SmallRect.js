import { View, Text, StyleSheet, Image, ImageBackground,TouchableOpacity } from 'react-native'
import React from 'react'

const SmallRect = ({props,image,chemin,name}) => {

  const voirPageWeb = (chemin) => {
    props.navigation.navigate('PageWeb',{
     chemin:chemin
      
    })} 

  return (
  <TouchableOpacity onPress={()=>voirPageWeb(chemin)} style={styles.contain}>
  <ImageBackground style={styles.container} source={{uri:image}}>
    <View style={{height:25,width:20,backgroundColor:'rgb(136,136,136)'}}>
      <Text style={{fontSize:7,marginTop:'40%'}}>#new</Text>
    </View>
  </ImageBackground>
  <View>
    <Text style={{color:'rgb(136,136,136)', fontSize:17}}>{name}</Text>
    <Text style={{color:'gray', fontSize:10,textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>9K fcfa</Text>
  </View>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contain:{
    height:170,
    width:130,
    marginTop:15,
    marginLeft:10,
  },
  container:{
  //  backgroundColor:'red',
   
    height:150,
    width:120,
    
  }
})

export default SmallRect