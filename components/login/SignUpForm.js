import { Picker } from '@react-native-picker/picker';
import { Timestamp, arrayUnion } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import * as ImagePicker from 'expo-image-picker';
import {
  createUserWithEmailAndPassword
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import firebase, { auth, storage } from '../../config';

import { UserContext } from '../navigation/NewNav';

import { Formik } from 'formik';
import * as Yup from 'yup';



const WIDTH = Dimensions.get('window').width * 1;
const HEIGHT = Dimensions.get('window').height*1

const SignUpForm = ({navigation}) => {

  const [url, setUrl] = useState(null)
 
  //
  const {emailHigh,setEmailHigh} = useContext(UserContext)

    const SignUpFormSchema = Yup.object().shape({
       // email: Yup.string().email().required('An email is required'), 
        name: Yup.string().required().min(0, 'An username is required'),
        password: Yup.string()
          .required()
          .min(0, 'Your password has to have at least 8 characters'),
      })

      //authentification
   
      const signUp =(email,pwd) => createUserWithEmailAndPassword(auth, email, pwd)

      const handleCreateAccount = async (e) => {
             createUserWithEmailAndPassword(auth,e.email, e.password)
             .then((userCredential) =>{
                const user = userCredential.user
                navigation.push('MainContainer')
              }).catch(error =>{
                Alert.alert("email deja utilisé ou incorrect !!!")
              })  
              setEmailHigh(e.email)      
}

     

      //fin authentification
      var dt =Timestamp.fromDate(new Date())
       // Add a new User in BiblioUser
       const  res = async (e) =>{
        await firebase.firestore().collection('BiblioUser').doc(e.email).set({
           name: e.name,
           email:e.email,
           matricule: e.matricule,
           niveau: e.niveau,
           departement:selectedLanguage,
           tel:e.tel,
           image:url,
           teste:"",
           messages: arrayUnion({"recue":"R", "texte": "Bienvenue dans la Bibliotheque de polytechnique yaoundé " ,"heure": dt}),
           signalMessage:'',
           tabMessages:[""],
           etat:'ras',
           etat1:'ras',
           etat2:'ras',
           etat3:'ras',
           architest1:0,
           architest2:0,
           architest3:0,
           etatshop:'ras',
           etatshop1:'ras',
           etatshop2:'ras',
           etatshop3:'ras',
           etatshop4:'ras',
           etatshop5:'ras',
           etatshop6:'ras',
           etatshop7:'ras',
           etatshop8:'ras',
           etatshop9:'ras',
           etatshop10:'ras',
           etatshop11:'ras',
           etatshop12:'ras',
           etatshop13:'ras',
           etatshop14:'ras',
           etatshop15:'ras',
           tabEtat1:['','',''],
           tabEtat2:['','',''],
           tabEtat3:['','',''],
           docRecent:[]
        })
        setEmailHigh(e.email)
          
       }


       const TwitM = ({img,text})=>{
        return(
            <View style={{}}>
                <Image source={{uri:img}} style={{height:70,width:70,borderRadius:50,alignSelf:'center',margin:15,marginTop:45}} />
            </View>
                       
        )
    }


    //ajouter image 
    const handleSumit =(e)=>{
   
      const imageRef = ref(storage,`photoprofil/${image.name + v4()}`)
      const pdfRef = ref(storage,`files/${image.name}`)
      
      uploadBytes(imageRef, image).then(()=>{
          getDownloadURL(imageRef).then((url)=>{
              setUrl(url)
          })
          .catch((error)=>{
              console.log("error getting the image url")
          })
          setImage(null)
      }).catch((error)=>{
          console.log(error.message)
      })

      console.log(image)
   
   }
   //fin ajouter image


       const [hasGalleriePermission, setHasGalleriePermission]= useState(null)
    const [image, setImage]=useState(null)
    const [uploading, setUploading] = useState(false)
    const [image2, setImage2]=useState(null)

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
        setChangeImage(true)

        if(!result.cancelled){
            setImage(result.uri)
            setImage2(result.uri)
        }
    }
    if (hasGalleriePermission===false){
        return<Text>No access </Text>
    }


const [changeImage,setChangeImage]=useState(false)
    //ajouter image 2

     async function uploadImage(imageUri) {
      try {
        const response = await fetch(imageUri)
        const blobFile = await response.blob()
    
        const reference = ref(storage,`photoprofil2/${"pp" + v4()}`)
        const result = await uploadBytes(reference, blobFile)
        const url = await getDownloadURL(result.ref)
       // console.log( "voici url",url)
       setUrl(url)
        return url
       
      } catch (err) {
        return Promise.reject(err)
    }
    
  }

  const [selectedValue, setSelectedValue] = useState("java");
  const [selectedLanguage, setSelectedLanguage] = useState();
  const pickerRef = useRef();

  function open() {
    pickerRef.current.focus();
  }
  
  function close() {
    pickerRef.current.blur();
  }
  return (
    <KeyboardAwareScrollView vertical style={{height:HEIGHT}}>

    <ImageBackground style={{flex:1,height:HEIGHT}} source={require('../../assets/biblio1.jpg')}>

      <Formik
        initialValues={{email:'',name:'',matricule:'',niveau:'',tel:'', password:''}}
        onSubmit={values =>{
          
          handleCreateAccount(values)
          uploadImage(image2)
          res(values)
         
        }}
        validationSchema={SignUpFormSchema}
        validateOnMount={true}
      >
         {({handleChange, handleBlur, handleSubmit, values, isValid}) =>(
          <>

    <TouchableOpacity onPress={()=>pickImage()}>
    {
          changeImage ? 
          <React.Fragment>
             {image2 && <TwitM img={image2} text='new Look' /> }
          </React.Fragment> 
          :
        <Image style={{height:70,width:70,borderRadius:50,alignSelf:'center',marginTop:85}} source={require('../../assets/userIc2.png')} />
        }
        <Text style={{textAlign:'center',marginBottom:10}}>ajouter image</Text>
        
    </TouchableOpacity>
      
      <View style={[styles.inputField,
        {borderColor: values.email.length > 0  ? '#ccc' : '#ccc' ,},
      ]}>
          <TextInput 
            placeholderTextColor='#444'
            placeholder=' email'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            autoFocus={true}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          
          />
      </View>


      <View style={[styles.inputField,
        {borderColor: values.name.length > 0  ? '#ccc' : '#ccc' ,},
      ]}>
          <TextInput 
            placeholderTextColor='#444'
            placeholder=' nom'
            autoCapitalize='none'
          //  textContentType='name'
            autoFocus={true}

            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
          
          />
      </View>

      <View style={[styles.inputField,
        {borderColor: values.matricule.length > 0  ? '#ccc' : '#ccc' ,},
      ]}>
          <TextInput 
            placeholderTextColor='#444'
            placeholder=' matricule'
            autoCapitalize='none'
          //  textContentType='matricule'
            autoFocus={true}

            onChangeText={handleChange('matricule')}
            onBlur={handleBlur('matricule')}
            value={values.matricule}
          
          />
      </View>

      <View style={[styles.inputField,
        {borderColor: values.niveau.length > 0  ? '#ccc' : '#ccc' ,},
      ]}>
          <TextInput 
            placeholderTextColor='#444'
            placeholder=' niveau'
            autoCapitalize='none'
          //  textContentType='niveau'
            autoFocus={true}
            keyboardType='numeric'
            onChangeText={handleChange('niveau')}
            onBlur={handleBlur('niveau')}
            value={values.niveau}
          
          />
      </View>



      <View style={[styles.inputField,
        {borderColor: values.tel.length > 0  ? '#ccc' : '#ccc' ,},
      ]}>
          <TextInput 
            placeholderTextColor='#444'
            placeholder='tel'
            autoCapitalize='none'
          // textContentType='tel'
            autoFocus={true}

            onChangeText={handleChange('tel')}
            onBlur={handleBlur('tel')}
            value={values.tel}
          
          />
      </View>


      <View style={[styles.inputField,
      {borderColor: values.password.length > 0 ? '#ccc' : '#ccc' ,},
      ]}>
          <TextInput 
            placeholderTextColor='#444'
            placeholder='mot de pass'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            textContentType='password'
            autoFocus={true}

            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
      </View>

      
      <Picker
  selectedValue={selectedLanguage}
  onValueChange={(itemValue, itemIndex) =>
    setSelectedLanguage(itemValue)
  }>
  <Picker.Item label="MSP" value="MSP" />
  <Picker.Item label="Genie informatique" value="Genie Informatique" />
  <Picker.Item label="Genie civile" value="Genie Civile" />
  <Picker.Item label="Genie mecanique" value="Genie Mecanique" />
  <Picker.Item label="Genie industriel" value="Genie Industriel" />
  <Picker.Item label="Genie telecom" value="Genie Telecom" />
  <Picker.Item label="Genie electrique" value="Genie Electrique" />
  
</Picker>

     {/* <Button title='Pick Image' onPress={()=> pickImage()} style={{marginTop:30}} />
      {image2 && <TwitM img={image2} text='new Look' /> } 
      <Button title='handleSumit' onPress={()=> uploadImage(image)} />
      <Button title='handleSumit' onPress={()=> console.log(selectedLanguage)} />
*/}
     

      <Text style={{marginBottom:15}}></Text>




      <TouchableOpacity titleSize={20} style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>


      <View style={styles.signUpContainer}>
        <Text>avez-vous deja un compte ?  </Text>
        <TouchableOpacity onPress={()=>navigation.goBack()} >
          <Text style={{color:'#FA8072'}}>Log In</Text>
        </TouchableOpacity>
      </View>
      </>
       )}
       </Formik>

       </ImageBackground>
</KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  wrapper:{
   // margin:WIDTH*0.01,
   marginTop:50,
   height:HEIGHT,
 //  backgroundColor:'#fff'
 alignContent:'center',
 alignSelf:'center',
  },

  inputField:{
    borderRadius:4,
    padding:13,
    backgroundColor:'#FAFAFA',
    marginBottom:15,
    borderColor:'#fff',
    width:350,
    alignSelf:'center',
  //  borderBottomColor: '#DC143C',
   // borderBottomWidth: 2,
    
    borderWidth:1,
    justifyContent:'center',
  },

  button: {
    backgroundColor: '#000' ,
    alignItems:'center',
    justifyContent:'center',
    minHeight:42,
    borderRadius:4,
    width:250,
    alignSelf:'center'
  },
  buttonText:{
    fontWeight:'600',
    color:'#fff',
    fontSize:20,
  },

  signUpContainer:{
    flexDirection:'row',
    width:'100%',
    justifyContent: 'center',
    marginTop:10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containera: {
   // flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

})


export default SignUpForm