import { Dimensions, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,ActivityIndicator, Modal, Pressable,Button } from 'react-native'
import React, { useEffect, useState,useContext } from 'react'
import Dialog from "react-native-dialog";
const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height
const Teb = ["","","",""]
import firebase from '../../config'
import { UserContext } from '../navigation/NewNav'
import { UserContexte } from './MainContainer'

    
export default function Parametre(props) {

  const {currentUserNewNav}= useContext(UserContext)
  const [datUserParams,setDatUserParams]=useState('')
  const [testT,setTestT]=useState(true)
const [modalCart,setModalCart]= useState(false)
const [imageCart,setimageCart]= useState("")
const [nameCart,setnameCart]= useState("")
const [descCart,setdescCart]= useState("")
const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    props.navigation.replace('NavLogin')
    // ...Your logic
    setVisible(false);
  };


  useEffect(() => {
    setTimeout(() => {
        setTestT(false);
    }, 500);
  }, []);

    function subscribed (){ firebase.firestore()
        .collection('BiblioUser')
        .doc(currentUserNewNav.email)
        .onSnapshot(doc => {
         const items = []
         
         items.push(doc.data())
       
        setDatUserParams(doc.data())
       //  setMes(doc.data().name)
      //   console.log("datUserParams",datUserParams)
       }
       )
      }
       
       useEffect(() =>{
         subscribed()
        },[])

        const Carte=({dev})=>{
            return(
                <TouchableOpacity onPress={()=>voirCart(dev.image,dev.nameDoc,dev.desc)} style={{height:259,width:180,margin:10}}>
                <View style={{height:250,width:180,borderRadius:20,margin:5,backgroundColor:'#DCDCDC'}}>
                <Image source={{uri:dev.image}} style={{height:250,width:180,borderRadius:20}}/>
                </View>
            <Text style={{margin:5,}}>{dev.nameDoc}</Text>
          </TouchableOpacity>
            )
        }
        function voirCart (image,nameDoc,desc){
            setimageCart(image)
            setnameCart(nameDoc)
            setdescCart(desc)
            setModalCart(true)
        }
        function Modif(imageM,nameM,emailM,telM,departM,niveauM){
            props.navigation.navigate('Parametre2',{
                imageM:imageM,
                nameM:nameM,
                emailM:emailM,
                telM:telM,
                departM:departM,
                niveauM:niveauM
            })
        }

  return (
    <>
    { testT ? 
        <ActivityIndicator size="large" color="red" />
         :
    (
    <SafeAreaView>
        <View style={{margin:10}}>
        <View style={{flexDirection:'row',justifyContent:'flex-end',margin:1,height:25,marginBottom:10}}>
            <Text style={{fontSize:25,fontWeight:'900'}}></Text>
            <Text style={{fontSize:25,fontWeight:'900'}}></Text>
            <TouchableOpacity onPress={showDialog} style={{borderRadius:10,flexDirection:'row',marginRight:15,marginTop:10}}>
            <Image source={require('../../assets/deconnect.png')} style={{height:20,width:20}} />
            <Text style={{fontSize:13,fontWeight:'900',color:'#000',textAlign:'center',marginTop:2,right:1,marginLeft:2}}>Deconnexion</Text>
            </TouchableOpacity>
        </View>
        
      <TouchableOpacity onPress={()=>Modif(datUserParams.image,datUserParams.name,datUserParams.email,datUserParams.tel,datUserParams.departement,datUserParams.niveau)} style={{backgroundColor:'#DCDCDC',height:150,marginTop:20,flexDirection:'row',borderRadius:20,margin:10,alignSelf:'center',width:WIDTH*0.9}}>
        <View style={{height:120,width:120,borderRadius:80,backgroundColor:'gray',margin:5,marginLeft:25,marginTop:15}}>
        <Image style={{height:120,width:120,borderRadius:80,}} source={{uri:datUserParams.image}}/>
        </View>
        <View style={{marginTop:25}}>
            <Text style={{fontSize:17,fontWeight:'900'}}>{datUserParams.name.slice(0,10)+"..."}</Text>
            <Text style={{fontSize:15,color:'gray'}}>{datUserParams.email}</Text>
            <Text style={{fontSize:15,color:'gray'}}>{datUserParams.departement}</Text>
            <Text style={{fontSize:15,color:'gray'}}> niveau : {datUserParams.niveau}</Text>
            <Text style={{fontSize:15,color:'gray'}}>{datUserParams.tel}</Text>
        </View>
      </TouchableOpacity>
      </View>
      {/** HISTORIQUE */}
      <View style={{marginTop:5}}>
        <View style={{height:5,width:WIDTH,backgroundColor:'#DCDCDC'}}></View>
      <Text style={{fontSize:25,fontWeight:'900',textAlign:'center',marginTop:10}}>HISTORIQUES</Text>
      <ScrollView horizontal style={{height:350}}>
      {
        datUserParams.docRecent.map((dev,index)=>
            <Carte dev={dev} key={index} />
        )
      }
      </ScrollView>
      </View>

      <ImageBackground source={require('../../assets/bibi.jpg')}  style={{height:150,width:WIDTH}}></ImageBackground>
      
      <Modal animationType='slide'
      transparent={false}
      visible={modalCart}
      onRequestClose={() => {
         setModalCart(!modalCart)
      }}
     >
        <SafeAreaView>
        <Pressable onPress={()=>setModalCart(false)} style={{height:HEIGHT,backgroundColor:'rgba(255, 255, 255, 0.1)',alignContent:'center',padding:20}}>
            <Image resizeMode='contain' style={{height:250,width:WIDTH,alignSelf:'center',marginTop:20}} source={{uri:imageCart}} />
            <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:20,fontWeight:'300',margin:5}}>nom :</Text>
            <Text style={{fontSize:20,fontWeight:'500',margin:5}}>{nameCart}</Text>
            </View>

            <View style={{flexDirection:'row',width:WIDTH*0.8,flexWrap:'wrap'}}>
            <Text style={{fontSize:20,fontWeight:'300',margin:5}}>Description :</Text>
            <Text style={{fontSize:15,fontWeight:'500',margin:5}}> {descCart} </Text>
            </View>
        </Pressable>
        </SafeAreaView>
     </Modal>

     <View style={styles.container}>
      
      <Dialog.Container visible={visible}>
        <Dialog.Title>Deconnexion</Dialog.Title>
        <Dialog.Description>
          Voulez-vous vraiment vous deconnecter ? 
        </Dialog.Description>
        <Dialog.Button label="non" onPress={handleCancel} />
        <Dialog.Button label="oui" onPress={handleDelete} />
      </Dialog.Container>
    </View>
    
    </SafeAreaView>
  )}
  </>
  )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },
})