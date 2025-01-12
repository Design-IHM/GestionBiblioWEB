import {
  signInWithEmailAndPassword
} from "firebase/auth"
import React, { useContext } from 'react'
import { Alert, Dimensions, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import firebase, { auth } from '../../config'

import { UserContext } from '../navigation/NewNav'



import { Formik } from 'formik'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Yup from 'yup'




const WIDTH = Dimensions.get('window').width * 1;
const HEIGHT = Dimensions.get('window').height*1


const LoginForm = ({navigation}) => {

  const {emailHigh,setEmailHigh} = useContext(UserContext)


  const LoginFormSchema = Yup.object().shape({
    email: Yup.string().email().required('An email is required'),
    password: Yup.string()
      .required()
      .min(1, 'Your password has to have at least 8 characters'),
  })

  const handleSignIn = (values) => {
    //apploader
    setEmailHigh(values.email)   
   // signInWithEmailAndPassword(auth, values.email, values.password)
    signInWithEmailAndPassword(auth, values.email, values.password)
    .then((userCredential) =>{
      const user = userCredential.user
      navigation.replace('MainContainer');
    }).catch(error =>{
      Alert.alert("adresse ou mot de passe incorrect"+"\n"+"Veillez reessayer!!!")
    })
    setEmailHigh(values.email) 
  }



   
      // Add a new document in collection "cities" with ID 'LA'
      const  res = async function(){
        await firebase.firestore().collection('auday').doc('auday').set({
           name: 'franck bertrand dombou aujourdhui',
           state: 'jai faim',
           country: 'ce matin'
        })
       }


       // Apploader


  return (
    <KeyboardAwareScrollView>
      <ImageBackground style={{flex:1,height:HEIGHT}} source={require('../../assets/biblio1.jpg')}>

    
   
    <View style={styles.wrapper}>

      <Formik
        initialValues={{email: '',username:'', password: ''}}
        onSubmit={values =>{
         
          handleSignIn(values)
          setEmailHigh(values.email)
        }}
        validationSchema={LoginFormSchema}
        validateOnMount={true}
      >
         {({handleChange, handleBlur, handleSubmit, values, isValid}) =>(
          <>

      <View style={styles.signUpContainer}>
        <Text></Text>
      </View>


      <View style={styles.inputField(isValid)}>
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
      //value={"eben1@gmail.com"}
      />
      </View>


      <View style={styles.inputField(isValid)}>
      <TextInput
        placeholderTextColor='#444'
        placeholder='password'
        autoCapitalize='none'
        autoCorrect={false}
       secureTextEntry={true}
        textContentType='password' //Smj

        onChangeText={handleChange('password')}
        onBlur={handleBlur('password')}
        value={values.password}
       // value={"1234567"}
      />
      </View>

      <View style={{alignItems:'flex-end', marginBottom:30}}>
        <Text style={{color:'#FA8072'}}></Text>
      </View>

     

      <TouchableOpacity titleSize={20} style={styles.button(isValid)} onPress= {handleSubmit} disabled={!isValid}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>


      <View style={{flexDirection:'row',marginTop:25,alignSelf:'center'}}>
        <Text>T'es nouveau sur ingy ? </Text>
        <TouchableOpacity onPress={()=>navigation.push('SignUpScreen')}>
          <Text style={{color:'#FA8072'}}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      </>
       )}
       </Formik>
    </View>
    </ImageBackground>
    </KeyboardAwareScrollView>
   
  )
}

const styles = StyleSheet.create({
  wrapper:{
   // margin:WIDTH*0.01,
   marginTop:200,
   height:HEIGHT,
 //  backgroundColor:'#fff'
 alignContent:'center',
 alignSelf:'center',
 
  },

  inputField:(isValid) => ({
    borderRadius:4,
    padding:12,
    backgroundColor:'#FAFAFA',
  // backgroundColor:'#C32AA3',
    marginBottom:10,
    borderColor:'#fff',
    borderBottomColor: isValid ?  '#000': '#ccc' ,
    borderBottomWidth: 2,
    width:350,
    borderWidth:1,
    justifyContent:'center'
  }),
  button:(isValid) =>({
    backgroundColor: isValid ? '#000': '#ccc' ,
    alignItems:'center',
    justifyContent:'center',
    minHeight:42,
    borderRadius:4,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }),
  buttonText:{
    fontWeight:'600',
    color:'#fff',
    fontSize:20,
  },

  signUpContainer:{
    flexDirection:'row',
    width:'100%',
    justifyContent: 'center',
    marginTop:20,
  },
  logoContainer:{
    alignItems:'center',
    marginTop:HEIGHT*0.099,
  alignSelf:'center'
   
 },

})


export default LoginForm