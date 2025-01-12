import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import firebase from '../../config'


const Cercle = ({props,cathegorie,image,datUser}) => {
 {/* const {} = props.route.params*/}

 const voirCathegorie = (cathegorie) => {
  props.navigation.navigate('Cathegorie',{
    cathegorie:cathegorie,
    datUser:datUser

  })    
} 

  return (
    <TouchableOpacity onPress={()=>voirCathegorie(cathegorie,datUser)} style={styles.contain}>
    <View style={styles.container}>
      <Image style={{height:'100%',width:'100%',borderRadius:60,resizeMode:'cover'}} source={image} />
    </View>
    <Text style={{textAlign:'center'}}>{cathegorie.length >12? cathegorie.slice(0,12)+'...':cathegorie}</Text>
    </TouchableOpacity>
  )
}


const styles= StyleSheet.create({
  contain:{
  //  backgroundColor:'green',
  //  height:20,
  //  width:100,
    marginTop:2,
    justifyContent:'center',
    flexDirection:'column',
    marginRight:3,
    marginLeft:2,
    marginBottom:20
  },
  container:{
    backgroundColor:'#DCDCDC',
    marginTop:1,
    height:80,
    width:80,
    borderRadius:60,

  }
})

export default Cercle