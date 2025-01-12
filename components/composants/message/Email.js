import { View, Text, SafeAreaView,TextInput,Button,StyleSheet,ScrollView,Dimensions,Image,TouchableOpacity } from 'react-native'
import React , {useState,useEffect, useContext,createContext} from 'react'
import firebase from '../../../config'
import { UserContext } from '../../navigation/NewNav'
import { doc, updateDoc, arrayUnion, arrayRemove,serverTimestamp,Timestamp  } from "firebase/firestore";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {onAuthStateChanged} from "firebase/auth"
import { auth } from '../../../config';

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

export const MessageContexte = createContext()


const Email = () => {

 const {datUser, setDatUser,datUserTest, setDatUserTest,} = useContext(UserContext)

  const [currentUserEmail, setCurrentUserEmail]= useState('')
  useEffect(() =>{
   onAuthStateChanged(auth, (currentUser)=>{
    setCurrentUserEmail(currentUser)
    })
  //   console.log('current user', currentUser)  
  },[])

  const [values, SetValues] = React.useState("")


  useEffect(() => {
    setTimeout(() => {
      setDatUserTest(false);
    }, 500);
  }, []);


            //reception des donnees
  
  const [dat, setDat] = useState(0)
  const [mes, setMes]= useState([])

 
 

function subscriber (){ firebase.firestore()
  .collection('BiblioUser')
  .doc(datUser.email)
  .onSnapshot(documentSnapshot => {
    console.log('User exists: ', documentSnapshot._firestore)   
      const items = [] 
      items.push(documentSnapshot.data())
      setDat(documentSnapshot.data())
      //  console.log('doc.data()',doc.data())
      // setMes(doc.data().messages)
 })}
 
 useEffect(() =>{
   subscriber()
  },[])
                       //fin recption des donnees

       //firebase debut
       const ref= firebase.firestore().collection("BiblioUser")
    
       const [data,setData]=useState([])
       const [loader,setLoader] = useState(true)
  
       function getData(){
        ref.onSnapshot((querySnapshot) => { 
          const items = []
          querySnapshot.forEach((doc) => {
            items.push(doc.data())
          })
          setData(items)
          setLoader(false)
        })
       }

       const [signale,setSignale] = useState(true)
       const [userDocument,setuserDocument]=useState()
       

       useEffect(() =>{
        getData()
        subscriber()
 //   dat.signalMessage == "actif" ? setSignalMain(false) : setSignalMain(true)
 //setuserDocument(firebase.firestore().collection('BiblioUser').doc('currentUserEmail.email').get())
       },[])
      //firebase fin



 
      var dt =Timestamp.fromDate(new Date())
     // var dte = dt.toDateString()

    
    // Atomically add a new region to the "regions" array field.
       function ajouter(){
        // debut ajouter tableau
        const washingtonRef = firebase.firestore().collection("BiblioUser").doc(currentUserEmail.email)
        
        washingtonRef.update({
          messages: arrayUnion({"recue":"E", "texte": values ,"heure": dt})
        });
        res()

       }



       //pour le biblio mm


       const  res = async function(){
        await firebase.firestore().collection('MessagesEnvoyé').doc(values).set({
           email:datUser.email,
           messages:values,
           nom:datUser.email
        })
      
       // ajouter2()
    
       }

       //Signalmessage
       
      

  


  return (

    <MessageContexte.Provider value={{signale,setSignale}}>
    
      <View style={{flexDirection:'column',alignSelf:'center',backgroundColor:'#F0F0F0',height:45,marginTop:10,marginBottom:7}}>
        <Image source={require('../../../assets/userIcone.png')} style={{height:40,width:40,borderRadius:50}} />
        <Text style={{textAlign:'center'}}>Admin</Text>
      </View>


      <View style={{backgroundColor:'#000',height:5,margin:5,width:WIDTH}}></View>
   
        <KeyboardAwareScrollView style={{}}>
          
        { datUserTest ? <Text></Text> : (
          datUser.messages.map((dev,index)=>
              dev.recue == "R" ?
               <Receiv heure={dev.heure} texte={dev.texte} key={index} /> :
               
               <Send heure={dev.heure} texte={dev.texte} key={index} />
             
          ))}
      
        <View style={{width:5000,flexDirection:'row',
  alignContent:'center',
  alignItems:'center',
  marginLeft:10,
  marginTop:15,
  position:'relative',
  marginBottom:25,
 // height:'20%',
  flex:1}}>
        <TextInput
            style={styles.input}
          //  placeholderTextColor='pink'
            placeholder='votre message'
            onChangeText={SetValues}
            value={values}
           // multiline={true}
            clearTextOnFocus={true}
          />
        <TouchableOpacity onPress={()=>ajouter()} style={{marginLeft:10}}>
           <Image source={require('../../../assets/send.png')} style={{height:30,width:30}} />
        </TouchableOpacity>
        </View>
        </KeyboardAwareScrollView>
    </MessageContexte.Provider>
  )
}

const Send=({texte,heure})=>{
  var date = new Date(heure.seconds*1000)
 // var forma = date.toLocaleString()
 // var format = date.toJSON(10)
  var formatDate = date.toDateString()
  var formatHeure = date.toTimeString()
    return(
      <View style={{flexDirection:'row',justifyContent:'space-between',width:WIDTH}}>
        {/*<Text>.                                 .</Text>*/}
     <View style={{width:WIDTH,justifyContent:"space-between",flexDirection:'column',margin:10,marginLeft:"37%"}}>
      <View style={{backgroundColor:"gray",width:200,borderRadius:20,padding:20}} >
        <Text style={{flexWrap:'wrap',textAlign:'center',fontFamily:'Georgia',fontWeight:'400',fontSize:17,color:"#fff"}}>{texte}</Text>
      </View>
      <Text style={{fontFamily:'Georgia',fontWeight:'400',fontSize:10,color:'#000'}}>{formatDate}</Text>
    </View>
    </View> 
    )
}
const Receiv =({heure,texte})=>{
  var date = new Date(heure.seconds*1000)
  var forma = date.toLocaleString()
  var format = date.toJSON(10)
  var formatDate = date.toDateString()
  var formatHeure = date.toTimeString()

  var dt =Timestamp.fromDate(new Date())
 // var dte = dt.toDateString()
//  console.log(Timestamp.fromDate(new Date()))
// console.log(dt)
  return(
    <View style={{justifyContent:'space-between',flexDirection:'column',margin:10,marginRight:20}}>
        <View style={{backgroundColor:"#000",width:220,borderRadius:20,padding:20}} >
          <Text style={{flexWrap:'wrap',textAlign:'center',fontFamily:'Georgia',fontWeight:'400',fontSize:17,color:'#fff'}}>{texte}</Text>
        </View>
      <Text style={{flexWrap:'wrap',fontFamily:'Georgia',fontWeight:'400',fontSize:10,color:'#000'}}>{formatDate}</Text>
    </View>
    
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
    color:'#000',
    marginLeft:30  , 
},
search:{
  flexDirection:'row',
  alignContent:'center',
  alignItems:'center',
  marginLeft:10,
  marginTop:15,
  marginBottom:25,
  height:'20%',
  flex:1
},
})






export default Email