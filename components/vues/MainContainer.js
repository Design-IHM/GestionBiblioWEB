import { View, Text,SafeAreaView, Image, Dimensions, TouchableOpacity,Modal,ScrollView,TextInput,StyleSheet,Button } from 'react-native'
import React, {createContext,useContext,useEffect,useState} from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import firebase from '../../config'

export const UserContexte = createContext()
import { UserContext } from '../navigation/NewNav'
import { MessageContexte } from '../composants/message/Email'



//Screens
import VueUn from './VueUn'
import PubCar from '../composants/PubCar'
import PubRect from '../composants/PubRect'
import Messages from './Messages'
import Email from '../composants/message/Email'
import Recommend from '../composants/Recommend'
import Produit from '../composants/achats/Produit'
import Panier from '../composants/achats/Panier'
import FichePaie from '../composants/achats/FichePaie'
import Accueil from '../openclassroom/Accueil'
import Departement from '../openclassroom/Departement'
import Semestre from '../openclassroom/Semestre'
import TableMatiere from '../openclassroom/TableMatiere'
import Matiere from '../openclassroom/Matiere'
import Cours from '../openclassroom/Cours'
import Quizz from '../openclassroom/Quizz'
import NavOpenClass from '../navigation/NavOpenClass'
import NavShop from '../navigation/NavShop'
import BigRect from '../composants/BigRect'
import Carre from '../parameter/Carre'
import PageWeb2 from '../composants/PageWeb2'
import Parametre from './Parametre'
import NavParams from '../navigation/NavParams'

//import Email from '../composants/message/Email'
// Screen names 
const homeName = 'Home'
const detailsName = 'setting'
const settingsName = 'e-learning'
const web = 'search'

//data.map

//Dimension
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width


const Tab = createBottomTabNavigator()

const MainContainer = ({navigation}) => { 

 // const {datUserTest, setDatUserTest,currentUserRecent, setCurrentUserRecent,datUser, setDatUser,currentUserNewNav}=useContext(UserContext)



  const voirMessage = () => {
    navigation.navigate('Panier',{})    
  }

  const [modal,setModal]=React.useState(false)
  const [values, SetValues] =React.useState("")
  const [datUser1, setDatUser1] =React.useState("")
  const [VuePartCours,setPartVueCours]=useState("")


  //firebase debut
  let  ref = 0 
    
  ref = firebase.firestore().collection("BiblioInformatique")

  // console.log(ref)
   
  const [data,setData]=React.useState([])
  const [loader,setLoader] =React.useState(true)
 
  function getData(){
   ref.onSnapshot((querySnapshot) => { 
     const items = []
     querySnapshot.forEach((doc) => {
       items.push(doc.data())
     })
     setData(items)
     setDatUser1(items)
     setLoader(false)
   })
  } 
 
  React.useEffect(() =>{
   getData()
 //  console.log('mes dataaaaaaa',data)
  },[])


  
                      


   //anuler1
   function annuler(dos){
    const ref = firebase.firestore().collection("BiblioUser")
    const refDoc = firebase.firestore().collection("BiblioInformatique")
  
    ref
    .doc(dos.email) 
    .update({tabMessages:[""],signalMessage:'ras'})
    .catch((err)=>{
      console.log(err)  
    })
    navigation.navigate('Email')
  }


  //Signalmessage
 // const {signale,setSignale}=useContext(MessageContexte)

  const [signalMain,setSignalMain] = useState(false)
  function lire(){
    setSignalMain(true)
    navigation.navigate('Email')
  }

  return (
    <UserContexte.Provider value={{VuePartCours,setPartVueCours,modal,setModal,signalMain,setSignalMain,datUser1}}>
    <React.Fragment>
        <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let rn = route.name;

                if(rn === homeName) {
                    iconName = focused ? 'home' : 'home-outline'
                } else if(rn === detailsName) {
                  //  iconName = focused ? 'book' : 'book-outline' 
                  iconName = focused ? 'cog' : 'cog'
                } else if (rn === settingsName){
                    iconName = focused ? 'list' : 'list-outline'
                }
                else if (rn === web){
                  iconName = focused ? 'search' : 'search-outline'
              }
                return <Ionicons name={iconName} size={size} color={color} />
            },
            tabBarActiveTintColor: '#87CEEB',
            tabBarInactiveTintColor: 'gray',
        })  }
        >
  { !signalMain ? 
<Tab.Screen
    name={homeName}
    component={NavShop}

    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if(rn === homeName) {
            iconName = focused ? 'cafe' : 'cafe-outline'
          } else if(rn === detailsName) {
            //  iconName = focused ? 'list' : 'list-outline'
            iconName = focused ? 'cog' : 'cog'
          } else if (rn === settingsName){
              iconName = focused ? 'book' : 'book-outline'
          }else if (rn === web){
            //iconName = focused ? 'cart' : 'cart-outline'
            iconName = focused ? 'search' : 'search-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />
      }
  })  }


    // title: 'App Name'
    options={{ 
        tabBarBadge: 1,
     headerTitle: (props) => ( // App Logo
     <SafeAreaView>
      <View style={{flexDirection:'row',justifyContent:'space-around',position:'relative',height:'100%',width:WIDTH,padding:5 }}>
        <TouchableOpacity onPress={()=>lire()}>
         <Image
        style={{ width: 35, height: 35,borderRadius:50,position:'relative',marginRight:35, }}
        source={require('../../assets/image/message2.jpg')}
        resizeMode='cover'
      />
      </TouchableOpacity>
      <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
        <Image style={{height:40,width:40,borderRadius:50,alignSelf:'center',marginBottom:5}} source={require('../../assets/enspy.jpg')} />
      <Text style={{color:'#000',fontWeight:'bold',fontSize:25,fontFamily:'Georgia',marginLeft:5,marginRight:15,}}>E N S P Y</Text>
      </View>
      <TouchableOpacity onPress={()=> setModal(!modal)}>
      <Image
        style={{ width: 35, height: 35,borderRadius:50,position:'relative',resizeMode:'center',opacity:0.5 }}
        source={require('../../assets/image/search.png')}
        resizeMode='cover'
      />
      </TouchableOpacity>

      <TouchableOpacity style={{marginRight:15,}} onPress={()=>navigation.navigate('Panier')}>
      <Image
        style={{ width: 35, height: 35,borderRadius:50,position:'relative',marginRight:15,resizeMode:'center',opacity:0.5 }}
        source={require('../../assets/image/panier1.jpg')}
        resizeMode='cover'
      />
      </TouchableOpacity>
      </View>
      
      </SafeAreaView>
     
    ),
    headerTitleStyle: { flex: 1, textAlign: 'center', },

    
  
    }}
  />  :  
  <Tab.Screen
    name={homeName}
    component={NavShop}

    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if(rn === homeName) {
            iconName = focused ? 'cafe' : 'cafe-outline'
          } else if(rn === detailsName) {
              iconName = focused ? 'list' : 'list-outline'
          } else if (rn === settingsName){
              iconName = focused ? 'book' : 'book-outline'
          }else if (rn === web){
              iconName = focused ? 'search' : 'search-outline'
          }
          return <Ionicons name={iconName} size={size} color={color} />
      }
  })  }


    // title: 'App Name'
    options={{ 
       // tabBarBadge: 1,
     headerTitle: (props) => ( // App Logo
     <SafeAreaView>
      <View style={{flexDirection:'row',justifyContent:'space-around',position:'relative',height:'100%',width:WIDTH}}>
        <TouchableOpacity onPress={()=>lire()}>
         <Image
        style={{ width: 35, height: 35,borderRadius:50,position:'relative',marginRight:35, }}
        source={require('../../assets/image/message2.jpg')}
        resizeMode='cover'
      />
      </TouchableOpacity>
      <Text style={{color:'#000',fontWeight:'bold',fontSize:25,fontFamily:'Georgia',marginLeft:55,marginRight:25}}>E N S P Y</Text>
      
      <TouchableOpacity onPress={()=> setModal(!modal)}>
      <Image
        style={{ width: 35, height: 35,borderRadius:50,position:'relative',resizeMode:'center',opacity:0.5 }}
        source={require('../../assets/image/search.png')}
        resizeMode='cover'
      />
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>navigation.navigate('Panier')}>
      <Image
        style={{ width: 35, height: 35,borderRadius:50,position:'relative',marginRight:15,resizeMode:'center',opacity:0.5 }}
        source={require('../../assets/image/panier1.jpg')}
        resizeMode='cover'
      />
      </TouchableOpacity>
      </View>
      
      </SafeAreaView>
     
    ),
    headerTitleStyle: { flex: 1, textAlign: 'center', },

    
  
    }}
  />
  
  
  
  
  }
           <Tab.Screen name={settingsName} component={NavOpenClass} />
           {/* <Tab.Screen name={homeName} component={Vue1} /> */}
           <Tab.Screen name={web} component={PageWeb2}   />
           <Tab.Screen name={detailsName} component={NavParams} />
            {/*<Tab.Screen name={settingsName} component={PageWeb2}  />*/}
            {/* !signalMain ? 
            <Tab.Screen name={settingsName} component={PageWeb2}  />
            : 
            <Tab.Screen name={settingsName} component={PageWeb2}   />

          */}

        </Tab.Navigator>

        <Modal animationType='slide'
          transparent={true}
          visible={modal}
          onRequestClose={() => {
          setModal(!modal)
        }}
        > 
        <SafeAreaView  style={{margin:5,flexDirection:'row',height:HEIGHT,borderRadius:20}}>
        <ScrollView style={{backgroundColor:'rgba(180,180,180,0.8)',borderRadius:20}}>
          
        <TouchableOpacity onPress={()=> setModal(!modal)}>
          <Image
            style={{ width: 35, height: 35,borderRadius:50,position:'relative',marginRight:35, }}
            source={require('../../assets/biblio/croix.png')}
            resizeMode='cover'
          />
          </TouchableOpacity>


          <View style={styles.search}>
          <TextInput
            style={styles.input}
          //  placeholderTextColor='pink'
            placeholder='Cherchez par million vos livres'
            onChangeText={SetValues}
            value={values}
          />
        <View style={{}}>
            <Button color='black' onPress={()=>console.log(datUser1)} style={{backgroundColor:'white'}} title='recherche' />
        </View>
        </View>
        
        <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',margin:7}}>

        {
          data.map((dev,index)=>{
            if(dev && index.name && values){
              if(dev.name.includes(values) || dev.name.includes(values.toUpperCase())){
                return (
                  <BigRect 
                  type={dev.type} 
                  datUser={datUser1} 
                  cathegorie={dev.cathegorie} 
                  props={navigation} 
                  name={dev.name} 
                  desc={dev.desc} 
                  etagere={dev.etagere} 
                  exemplaire={dev.exemplaire} 
                  image={dev.image} 
                  salle={dev.salle} 
                  key={index} 
                  commentaire={dev.commentaire} 
                  nomBD={dev.nomBD} 
                />
                );
              }else{
                return <View key={index}></View>;
              }
            }else return null;
          }
          /*
                        (dev.name.includes(values) || dev.name.includes(values.toUpperCase()) ?
              <BigRect 
                      type={dev.type} 
                      datUser={datUser1} 
                      cathegorie={dev.cathegorie} 
                      props={navigation} 
                      name={dev.name} 
                      desc={dev.desc} 
                      etagere={dev.etagere} 
                      exemplaire={dev.exemplaire} 
                      image={dev.image} 
                      salle={dev.salle} 
                      key={index} 
                      commentaire={dev.commentaire} 
                      nomBD={dev.nomBD} 
                />
              : <View key={index}></View>)
          
          */

          )          
        }


        </View>
          <TouchableOpacity onPress={()=> setModal(!modal)}>
            <Text>F.E.D</Text>
          </TouchableOpacity>
        </ScrollView>
        </SafeAreaView>
      </Modal>
  </React.Fragment>
  </UserContexte.Provider>
  )
}


const styles = StyleSheet.create({
  container:{
   //flexDirection:'row',
  //  flexWrap:'wrap',
  //  width:WIDTH,
  //  height:HEIGHT ,
  //  justifyContent:'space-between',
  //  margin:5 
   flex:1
    
  },
  input:{
    borderWidth: 1,
    height: 40,
    padding: 10,
    width:250,
    borderBottomLeftRadius:20,
    borderTopLeftRadius:20,
    color:'#fff'  
},
search:{
  flexDirection:'row',
  alignContent:'center',
  alignItems:'center',
  marginLeft:10,
  marginTop:15
},
})




export default MainContainer;
