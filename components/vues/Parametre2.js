import { View, Text, Image, TouchableOpacity, Dimensions, TextInput, StyleSheet,Button,Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const WIDTH = Dimensions.get('screen').width
const HEIGHT = Dimensions.get('screen').height
import firebase from '../../config'
import * as ImagePicker from 'expo-image-picker'
import { storage } from "../../config";
import {ref , uploadBytes, getDownloadURL,getStorage, uploadBytesResumable} from "firebase/storage"
import {v4} from "uuid"
import Dialog from "react-native-dialog";


const Parametre2 = (props) => {
    const {imageM,nameM,emailM,telM,departM,niveauM}=props.route.params
const [name,setname]=useState("")
const [tel,settel]=useState('')
const [niveau,setniveau]=useState('')
const [depart,setdepart]=useState('')
const [imageUser,setImageUser]=useState('')
const [changeImage,setChangeImage]=useState(false)


const [url, setUrl] = useState(null)
const [hasGalleriePermission, setHasGalleriePermission]= useState(null)
const [image, setImage]=useState(null)
const [uploading, setUploading] = useState(false)
const [image2, setImage2]=useState(null)

useEffect(()=>{
  setImageUser(imageM)
  setname(nameM)
  settel(telM)
  setniveau(niveauM)
  setdepart(departM)
 // setImageUser(imageM)
},[])

useEffect(()=>{
    (async ()=>{
        const gallerieStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
        setHasGalleriePermission(gallerieStatus.status === 'granted')
    })()
}, [])
const pickImage = async () =>{
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditting: true,
        aspect:[4,3],
        quality:1
    })
    console.log(result)

    if(!result.cancelled){
        setImage(result.uri)
        setImage2(result.uri)
        setChangeImage(true)
        
    }
}
if (hasGalleriePermission===false){
    return<Text>No access </Text>
}

const  res = async () =>{
  await firebase.firestore().collection('BiblioUser').doc(emailM).update({
     "name": name,
     "niveau":niveau,
     "tel":tel,
     "image":url,
     "departement":depart
  })
  .then(() => {
    console.log("Document successfully updated!");
});
console.log("louuuuuurrrrdddeee123")

}

function Modif(){
  firebase.firestore().collection('BiblioUser').doc(emailM).update({
    "name": name,
    "niveau":niveau,
    "tel":tel,
   // "image":imageUser,
   // "departement":depart
 })
}


//ajouter image 2
//var uploadTask = storageRef.child('images/mountains.jpg').put(file, metadata);
 async function uploadImage(imageUri) {
  try {
    const response = await fetch(imageUri)
    const blobFile = await response.blob()

    const reference = ref(storage,`photoprofil2/${"pp" + v4()}`)
    const result = await uploadBytes(reference, blobFile)
    const urli = await getDownloadURL(result.ref)
    console.log( "voici url",url)
   setUrl(urli)
   setImageUser(urli)
    return urli
   
  } catch (err) {
    return Promise.reject(err)
}
}

const TwitM = ({img,text})=>{
  return(
        <Image style={{height:100,width:100,borderRadius:50,alignSelf:'center'}} source={{uri:img}} />
                 
  )
}

const [visible, setVisible] = useState(false);
const [termine, setTerminer] = useState(false);

  const showDialog = () => {
   // uploadImage(image2)
    setVisible(true);
   // console.log("image2",image2)
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    //uploadImage(image)
    Modif()
    // ...Your logic
    setVisible(false);
  };

  function modifnAME(val){
      setTerminer(true)
      setname(val)
  }
  function modifNivo(val){
    setTerminer(true)
    setniveau(val)
}
function modifTel(val){
  setTerminer(true)
  settel(val)
}

  return (
    <KeyboardAwareScrollView>
      { termine ? <View style={{flexDirection:'row',justifyContent:'space-between',margin:10,marginLeft:10,marginRight:10}}>
            <TouchableOpacity onPress={()=>props.navigation.goBack()}>
            <Text style={{fontWeight:'500',fontSize:13,color:'#DC143C',marginLeft:15}}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={showDialog}>
              <Text style={{fontWeight:'700',fontSize:13,color:'#1E90FF',marginRight:15}}>Terminer</Text>
            </TouchableOpacity>
        </View> : <></> }
    <View>
    <View style={{flexDirection:'column',width:WIDTH*0.98,margin:10,backgroundColor:'#DCDCDC',borderRadius:20,marginLeft:5,padding:10,elevation:10}}>
      {/**IMAGE */}
      <View style={{flexDirection:'row'}}>
        {
          changeImage ? 
          <React.Fragment>
             {image2 && <TwitM img={image2} text='new Look' /> }
          </React.Fragment> 
          :
          <View style={{height:100,width:100,borderRadius:50,alignSelf:'center',backgroundColor:'gray'}}>
            <Image style={{height:100,width:100,borderRadius:50,alignSelf:'center'}} source={{uri:imageUser}} />
          </View>
        }
        <View style={{margin:10}}>
        <Text style={{flexWrap:'wrap',marginTop:20,fontSize:15,}}>Saisissez votre nom et ajouter une photo</Text>
        <Text>de profil Optionnelle</Text>
        </View>
      </View>
       {/* <TouchableOpacity onPress={pickImage}>
            <Text style={{color:'#1E90FF',fontSize:13,marginLeft:20,marginTop:10}}>Modifier</Text>
        </TouchableOpacity>*/}
        <View style={{height:1,width:WIDTH*0.9,alignSelf:'center',backgroundColor:'#fff',marginTop:10}}></View>
        <TextInput 
        placeholder= {nameM}
        onChangeText={(text)=>modifnAME(text)}
        //value={name}
        style={styles.input}
        />
        
    {/*<Text style={{fontWeight:'700',marginLeft:10,color:'gray'}}>{nameM}</Text>*/}

        <View style={{height:1,width:WIDTH*0.9,alignSelf:'center',backgroundColor:'#fff',marginTop:4}}></View>

      </View>

<Text style={{fontSize:12,marginTop:15,marginLeft:20}}>DEPARTEMENT</Text>
<View style={{flexDirection:'column',width:WIDTH*0.98,margin:10,backgroundColor:'#DCDCDC',borderRadius:20,marginLeft:5,padding:10}}>
{/*<TextInput 
placeholder= {departM}
onChangeText={setdepart}
value={depart}
style={styles.input}
/>*/}
 <Text style={{fontWeight:'700',marginLeft:10,color:'gray'}}>{departM}</Text>

</View>

<Text style={{fontSize:12,marginTop:15,marginLeft:20}}>NIVEAU</Text>
<View style={{flexDirection:'column',width:WIDTH*0.98,margin:10,backgroundColor:'#DCDCDC',borderRadius:20,marginLeft:5,padding:10}}>
<TextInput 
placeholder= {niveauM}
keyboardType='numeric'
onChangeText={(text)=>modifNivo(text)}
// value={niveau}
style={styles.input}
/>
    {/*<Text style={{fontWeight:'700',marginLeft:10,color:'gray'}}>{niveauM}</Text>*/}

</View>

<Text style={{fontSize:12,marginTop:15,marginLeft:20}}>NUMERO DE TELEPHONE</Text>
<View style={{flexDirection:'column',width:WIDTH*0.98,margin:10,backgroundColor:'#DCDCDC',borderRadius:20,marginLeft:5,padding:10}}>
<TextInput 
placeholder= {telM}
keyboardType='numeric'
onChangeText={(text)=>modifTel(text)}
//value={tel}
style={styles.input}
/>
   {/* <Text style={{fontWeight:'700',marginLeft:10,color:'gray'}}>{telM}</Text>*/}

</View>

<Text style={{fontSize:12,marginTop:15,marginLeft:20}}>ADRESSE EMAIL</Text>
<View style={{flexDirection:'column',width:WIDTH*0.98,margin:10,backgroundColor:'#DCDCDC',borderRadius:20,marginLeft:5,padding:10,elevation:5}}>
    <Text style={{fontWeight:'700',marginLeft:10,color:'gray'}}>{emailM}</Text>
</View>

{/*<Button title='Pick Image' onPress={()=> console.log(name)} style={{marginTop:30}} />
      {image2 && <TwitM img={image2} text='new Look' /> } 
      <Button title='handleSumit' onPress={()=>
   uploadImage(image2)
      
      } />*/}


</View>

<View style={styles.container}>
      
      <Dialog.Container visible={visible}>
        <Dialog.Title>Confirmation ? </Dialog.Title>
        <Dialog.Description>
           
        </Dialog.Description>
        <Dialog.Button label="non" onPress={handleCancel} />
        <Dialog.Button label="oui" onPress={handleDelete} />
      </Dialog.Container>
    </View>
</KeyboardAwareScrollView>
  )
}

const styles= StyleSheet.create({
    input:{
       color:'#000',margin:5
    }
})

export default Parametre2