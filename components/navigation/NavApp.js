import React from 'react'
import {onAuthStateChanged} from "firebase/auth"
import { createContext,useState,useEffect,useContext } from "react";
import { auth } from '../../config';

import firebase from '../../config'

 
export const UserContextNavApp = createContext()



import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

import MainContainer from '../vues/MainContainer';
import NavLogin from './NavLogin';
const screenOptions = {
  headerShown:false,  
} 

const Stack = createStackNavigator()



 
const NavApp = () => {

  const [donnees,setDonnees] = useState('') 
  const [currentUserdata, setCurrentUserdata] = useState()
  //gestion des donnees 


 
//shop cart
const [modalVisible, setModalVisible] = React.useState(false)


//fin gestion des donnees


  
 const [loadingData, setLoadingData] = useState(false)
const [currentUserContainer, setCurrentUserContainer] = useState()
const [logingPending,setLogingPending] = useState(false)
 
const [modalArchive,setModalArchive]=useState(false)

const [emailHigh,setEmailHigh] = useState('eben1@gmail.com')


 
  useEffect(() =>{
    onAuthStateChanged(auth, (currentUser)=>{
      setCurrentUserContainer(currentUser)
       setLoadingData(true)  
     })
  //   console.log('current user', currentUser)  
   },[])

   const [datUser, setDatUser] = useState(null)
   // const [comment,setComment]=useState([])
   
        //reception des donnees
     //   const currentUser=useContext(UserContext)
   
   //     const [datd, setDatd] = useState()
        const [mes, setMes]= useState()
      
        function subscribed (){ firebase.firestore()
        .collection('BiblioUser')
        .doc(emailHigh)
        .onSnapshot(doc => {
         const items = []
         
         items.push(doc.data())
       
         setDatUser(doc.data())
         setMes(doc.data().name)
       }
       )
        
       }
       
       useEffect(() =>{
         subscribed()
        },[])
       // console.log(dat.etat1)//receptions des donnees 

 
  return (
<Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#cee1f2',
        color: '#cee1f2',
        itemStyle: {marginVertical: 5, color: 'white'},
        labelStyle: {
          color: '#d8d8d8',
        },
      }}
      screenOptions={{headerShown: false}}
      >
        <Drawer.Screen
        name="MainContainer"
        options={{drawerLabel: 'Home Screen'}}
        component={MainContainer}
      />  
  </Drawer.Navigator>
  )  
}

{/*
  !loadingData ?
  (<NavigationContainer>
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name='MainContainer' component={MainContainer} />
    </Stack.Navigator>
  </NavigationContainer>) :
  (<NavLogin />) 
  
  */}


export default NavApp