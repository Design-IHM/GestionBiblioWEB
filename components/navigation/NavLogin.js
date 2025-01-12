import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import React, { useContext,useState,useEffect } from 'react'
import SignUpScreen from '../login/SignUpScreen'
import LoginScreen from '../login/LoginScreen'
import MainContainer from '../vues/MainContainer'
import {onAuthStateChanged} from "firebase/auth"
import { auth } from '../../config';



//context
import { UserContext } from './NewNav'


const Stack = createStackNavigator() 

const screenOptions = { headerShown:false }
 
const NavLogin = () => {

{/*
  const {currentUser,setCurrentUser}= useContext(UserContext)

const [loadingData, setLoadingData] = useState(false)

  useEffect(() =>{
    onAuthStateChanged(auth, (currentUser)=>{
       setCurrentUser(currentUser)
       setLoadingData(true)      
     })  
  },[])
*/}

  // console.log('12345678901023451pepe1',loadingData)

  return(
   <Stack.Navigator screenOptions={screenOptions} initialRouteName='LoginScreen'>
      <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
      <Stack.Screen name='MainContainer' component={MainContainer} />
  </Stack.Navigator>
)}

 {/*<NavigationContainer>
   <Stack.Navigator screenOptions={screenOptions} initialRouteName='LoginScreen'>
     <Stack.Screen name='LoginScreen' component={LoginScreen} />
      <Stack.Screen name='SignUpScreen' component={SignUpScreen} />
     <Stack.Screen name='MainContainer' component={MainContainer} />
  </Stack.Navigator>   
  </NavigationContainer> */}

export default NavLogin 