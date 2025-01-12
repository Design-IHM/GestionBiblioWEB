import React, { useContext, useEffect, useState } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dialog from "react-native-dialog";

import firebase from '../../../config';
import { UserContext } from '../../navigation/NewNav';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height


const CathegorieBiblio = ({cathegorie,donnee}) => {

    // console.log('CATHEGORIE VIDEOO    OOOOOOOO',navigation)
   
       //firebase debut
       
       // console.log(ref)
       const {currentUser,setcurrentUser}= useState("eben1@gmail.com")
       
        const [data,setData]=useState([])
        const [loader,setLoader] = useState(true)
       
        function getData(dos){
         let ref= firebase.firestore().collection('Blio') 
         ref.onSnapshot((querySnapshot) => { 
           const items = []
           querySnapshot.forEach((doc) => {
             items.push(doc.data())
           })
           setData(items)
           setLoader(false)
         })
        }
        useEffect(() =>{
         getData()
        },[])
   
   
   
       //firebase fin
   
   

   
       
   
       const {number, onChangeNumber} = React.useState(null);
   
       const {imgActive, setimgActive} =useState(0)
   
     const  onChange = (nativeEvent) => {
         if(nativeEvent) {
           const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width )
           if(slide != imgActive){
             setimgActive(slide)
           }
         }
         
       }
   
       //nouvelle gestion enprunt reserv remis
   
         //gestion des reservation
         function subscriber(){ firebase.firestore()  
           .collection('BiblioUser')
           .doc(currentUser) 
           .get()
           .then(documentSnapshot => {  console.log(documentSnapshot.data()) } );
         }
         //fin gestion
   
   
   
   
     return (
       <SafeAreaView>
   
         <View style={{backgroundColor:'#C8C8C8' , justifyContent:'space-between',flexDirection:'row' }}>
           <Text style={{fontSize:20,fontWeight:'bold',color:'black', margin:10,fontFamily:'Cochin'}}>{cathegorie}</Text>
           
           
         </View>
   
         <View style={{width:WIDTH,height:400}}>
             
   
             {
             (donnee.etat1 == 'reserv' ?
               <Cadre cathegorie2='' matricule={donnee.matricule} name={donnee.tabEtat1[0]} cathegorie={donnee.tabEtat1[1]} image={donnee.tabEtat1[2]} desc='' exemplaire={donnee.tabEtat1[3]} nomBD={donnee.tabEtat1[4]} dateHeure={donnee.tabEtat1[5]}  />
               : <View></View>
              
             )
           }
   
           {
             (donnee.etat2 == 'reserv' ?
               <Cadre cathegorie2=''  donnee={donnee} name={donnee.tabEtat2[0]} cathegorie={donnee.tabEtat2[1]} image={donnee.tabEtat2[2]} desc='' exemplaire={donnee.tabEtat2[3]} nomBD={donnee.tabEtat2[4]} dateHeure={donnee.tabEtat2[5]} />
               : <View></View>
              
             )
           }
   
           {
             (donnee.etat3 == 'reserv' ?
               <Cadre cathegorie2=''  donnee={donnee} name={donnee.tabEtat3[0]} cathegorie={donnee.tabEtat3[1]} image={donnee.tabEtat3[2]} desc='' exemplaire={donnee.tabEtat3[3]} nomBD={donnee.tabEtat3[4]} dateHeure={donnee.tabEtat3[5]} />
               : <View></View>
              
             )
           }
   
   </View>
   
      
           
       </SafeAreaView>
     )
   }
   
   
   //emprunt
   
   
   const CathegorieBiblio1 = ({cathegorie,currentUser,donnee}) => {
   
     // console.log('CATHEGORIE VIDEOO    OOOOOOOO',navigation)
    
        //firebase debut
        
        // console.log(ref)
        
         const {data,setData}=useState([])
         const {loader,setLoader} = useState(true)
        
         function getData(dos){
          let ref= firebase.firestore().collection('Biblio') 
          ref.onSnapshot((querySnapshot) => { 
            const items = []
            querySnapshot.forEach((doc) => {
              items.push(doc.data())
            })
            setData(items)
            setLoader(false)
          })
         }
        
         useEffect(() =>{
          getData()
         },[])
    
    
    
        //firebase fin
    
    
    
        
    
        const {number, onChangeNumber} = React.useState(null);
    
        const {imgActive, setimgActive}=useState(0)
    
      const  onChange = (nativeEvent) => {
          if(nativeEvent) {
            const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width )
            if(slide != imgActive){
              setimgActive(slide)
            }
          }
          
        }
    
        //nouvelle gestion enprunt reserv remis
    
          //gestion des reservation
          function subscriber(){ firebase.firestore()  
            .collection('BiblioUser')
            .doc(currentUser) 
            .get()
            .then(documentSnapshot => {  console.log(documentSnapshot.data()) } );
          }
          //fin gestion
    
    
    
    
      return (
        <SafeAreaView>
    
          <View style={{backgroundColor:'#C8C8C8' , justifyContent:'space-between',flexDirection:'row' }}>
            <Text style={{fontSize:20,fontWeight:'bold',color:'black', margin:10,fontFamily:'Cochin'}}>{cathegorie}</Text>
            
          
            
          </View>
    
          <ScrollView
              onScroll={({nativeEvent}) => onChange(nativeEvent)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal={false}
              style={styles.wrap}
            >
              
    
              {
              (donnee.etat1 == 'emprunt' ?
                <CadreEmprunt cathegorie2='emprunt' user={currentUser}  name={donnee.tabEtat1[0]} cathegorie={donnee.tabEtat1[1]} image={donnee.tabEtat1[2]} desc='' exemplaire={1} nomBD={donnee.tabEtat1[4]} dateHeure={donnee.tabEtat1[5]} />
                : <View></View>
               
              )
            }
    
            {
              (donnee.etat2 == 'emprunt' ?
              <CadreEmprunt cathegorie2='emprunt' user={currentUser}  name={donnee.tabEtat2[0]} cathegorie={donnee.tabEtat2[1]} image={donnee.tabEtat2[2]} desc='' exemplaire={1} nomBD={donnee.tabEtat2[4]} dateHeure={donnee.tabEtat2[5]} />
                : <View></View>
               
              )
            }
    
            {
              (donnee.etat3 == 'emprunt' ?
              <CadreEmprunt cathegorie2='emprunt' user={currentUser}  name={donnee.tabEtat3[0]} cathegorie={donnee.tabEtat3[1]} image={donnee.tabEtat3[2]} desc='' exemplaire={1} nomBD={donnee.tabEtat3[4]} dateHeure={donnee.tabEtat3[5]} />
                : <View></View>
               
              )
            }
    
             
              
    
            </ScrollView>
    
       
            
        </SafeAreaView>
      )
    }
    
    




const Panier = (props) => {

    const {values, SetValues} = useState("")

    const {currentUser,setcurrentUser}= useState('eben1@gmail.com')    //currentUserrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
   //gestion des reservation
   const {currentUserNewNav}= useContext(UserContext)
  
   
   const [dat, setDat] = useState(0)
  
   
  
   function subscriber (){ firebase.firestore()
   .collection('BiblioUser')
   .doc(currentUserNewNav.email)
   .onSnapshot(doc => {
    const items = []
    
    items.push(doc.data())
  
    setDat(doc.data())
  }
  )
   
  }
  
  useEffect(() =>{
    subscriber()
   },[])
  //console.log('donnnnnneeeeeee1234567055',dat)
    
  
  //fin gestion
 // console.log('cateh4',dat.tabEtat1[4])
  
  //gestion des reservation
  function subscriber1(){ firebase.firestore()  
    .collection('BiblioUser')
    .doc(currentUserNewNav.email) 
    .get()
    .then(e => {  (e.etat1 == 'emprunt' || e.etat2 == 'emprunt' || e.etat3 == 'emprunt' ? (
      <>
        <CathegorieBiblio1 currentUser={currentUser}  donnee={e} cathegorie='emprunt' />
        <Divider width={1} orientation='center' /> 
    </>
    ) :(<View><Text>hello</Text></View>)) } );
  }
  //fin gestion
  
  
  
   
  
       //firebase debut
    const ref= firebase.firestore().collection("BiblioInformatique")
    
    
     const {data,setData}=useState([])
     const {loader,setLoader}= useState(true)
  
  &
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
    
     useEffect(() =>{
     // getData()
     },[])
  
   //  console.log('moneeeeeeeeeeeeeeeeeee1223456458') 
  
  
    //firebase fin
  
     //TABLEAU USER ET GESTION DES EMPRUNTS RESERVATIONS ET ANNULATIONS
  
  
     const refUser= firebase.firestore().collection("BiblioUser")
    
    
     const[ dataUser,setDataUser]=useState([])
     const [loaderUser,setLoaderUser] = useState(true)
  
   //  console.log('dataUser dan PanierBiblio',dataUser[0])
    
     function getDataUser(){
      refUser.onSnapshot((querySnapshot) => { 
        const items = []
        querySnapshot.forEach((doc) => {
          items.push(doc.data())
        })
      //  setDataUser(items)
        setLoaderUser(false)
      })
     }
    
     useEffect(() =>{
      getDataUser()   
     },[])
    
     //fin USER ET GESTION DES EMPRUNTS RESERVATIONS ET ANNULATIONS

  return (
    <React.Fragment>
    <ScrollView>

    {  (dat.etat1 == 'reserv' || dat.etat2 == 'reserv' || dat.etat3 == 'reserv' ? (
    <>
      <CathegorieBiblio  donnee={dat} cathegorie='Reservation' />
     
  </>
  ) :(<View>
    
    <Text style={{textAlign:'center', fontWeight:'900', fontSize:28,fontFamily:'Cochin'}}>0 RESERVATION</Text>
    </View>)) 
  
  }

{  (dat.etat1 == 'emprunt' || dat.etat2 == 'emprunt' || dat.etat3 == 'emprunt' ? (
    <>
      <CathegorieBiblio1  donnee={dat} cathegorie='emprunt' />
     
  </>
  ) :(<View>
   

      <Text style={{textAlign:'center', fontWeight:'900', fontSize:28,fontFamily:'Cochin',marginTop:50}}></Text>

   
    </View>)) 
  
  }

         

       
    
    </ScrollView>
   {/* <View style={{height:80,backgroundColor:'#fff',}}>
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:30}}>
            <Text style={{marginTop:5}}>4GI</Text>
            <TouchableOpacity style={{height:25,backgroundColor:'#000',width:170}} >
                <Text style={{color:'#fff',fontSize:19,textAlign:'center'}}>ENSPY</Text>
            </TouchableOpacity>
        </View>
</View> */}
    </React.Fragment> 
  )
}

const Cadre =({cathegorie,desc,exemplaire, image,name,matricule,cathegorie2,nomBD,dateHeure})=>{


  var date = new Date(dateHeure.seconds*1000)
  var forma = date.toLocaleString()
  var format = date.toJSON(10)
  var formatDate = date.toDateString()
  var formatHeure = date.toTimeString()
 // console.log('nombd',formatDate)


    //reception des donnees
  const {currentUser,setcurrentUser}=useState('eben1@gmail.com')
  const {currentUserNewNav}= useContext(UserContext)
  
  const [dat, setDat] = useState(0)

  function subscriber (){ firebase.firestore()
  .collection('BiblioUser')
  .doc(currentUserNewNav.email)
  .onSnapshot(doc => {
   const items = []
   
   items.push(doc.data())
 
   setDat(doc.data())
 }
 )
  
 }
 
 useEffect(() =>{
   subscriber()
  },[])
                       //fin recption des donnees
                      

  const TITRE = name
// console.log('voiiiiiiiiiirrrrrrrrrrrrrr',cathegorie)

  
 
  //anuler1
  function annuler(dos){
    const ref = firebase.firestore().collection("BiblioUser")
    const refDoc = firebase.firestore().collection("BiblioInformatique")
    if( dos.etat1 == 'reserv' && dos.tabEtat1[0] == TITRE){
    ref
    .doc(dos.email) 
    .update({etat1:'ras', tabEtat1:["","",""]})
    .catch((err)=>{
      console.log(err)  
    })
    refDoc
    .doc(nomBD)
    .update({exemplaire : exemplaire + 1} )
    .then(Alert.alert('Annulation en cours...'))
    .catch((err)=>{
        console.log(err)  
      })
     
} 
    if( dos.etat2 == 'reserv' && dos.tabEtat2[0] == TITRE){
        ref
        .doc(dos.email)
        .update({etat2:'ras', tabEtat2:["","",""]})
        .catch((err)=>{
          console.log(err)
        })
        refDoc
        .doc(nomBD)
        .update({exemplaire : exemplaire + 1} )
        .then(Alert.alert('Annulation en cours...'))
        .catch((err)=>{
            console.log(err)  
          })
         
      
      }
        if( dos.etat3 == 'reserv' && dos.tabEtat3[0] == TITRE){
            ref
            .doc(dos.email)
            .update({etat3:'ras', tabEtat3:["","",""]})
            .catch((err)=>{
              console.log(err)
            })
            refDoc
            .doc(nomBD)
            .update({exemplaire : exemplaire + 1 })
            .then(Alert.alert('Annulation en cours...'))
            .catch((err)=>{
                console.log(err)  
              })
             
           
          }         
  }

  const [visiblea, setVisiblea] = useState(false);

  const showDialog = () => {
    setVisiblea(true);
  };

  const handleCancel = () => {
    setVisiblea(false);
  };

  const handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    annuler(dat)
    // ...Your logic
    setVisiblea(false);
  };


    return(
        <View style={{width:WIDTH,height:200,elevation:4}}>
              {/** Cadre */}
      <Text style={{color:'rgb(211,211,211)', fontSize:10,textDecorationLine: 'line-through', textDecorationStyle: 'solid',textAlign:'center',textDecorationColor:'#DCDCDC'}}>-                                                                                                                       -</Text>

      <View style={{flexDirection:'row',width:WIDTH*0.87,backgroundColor:'rgb(211,211,211)',borderRadius:20,alignSelf:'center',marginBottom:10,elevation:4 }}>
          <Image style={{height:160,width:100,marginLeft:7,alignSelf:'center',borderRadius:20}} source={{uri:image}} />
          <View style={{width:'77%',flexDirection:'column',justifyContent:'space-between',margin:5}}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{color:'#000',fontFamily:'Georgia',fontSize:20,margin:8}}>{name.length>10 ? name.slice(0,10)+'...':name}</Text>
                  {/*<Image style={{height:25,width:25,marginRight:17}} source={require('../../../assets/image/coeur.png')} />*/}
              </View>

              <Text style={{color:'#000',fontFamily:'Georgia',fontSize:14,margin:8}}>{formatDate}</Text>
              <Text style={{color:'#000',fontFamily:'Georgia',fontSize:14,marginLeft:8}}>{formatHeure.slice(0,9)}</Text>

  
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:1}}>
              <Text></Text>               
  
                   {/** quantity */}
                   { cathegorie2!='emprunt' ? 
    <TouchableOpacity onPress={()=>showDialog()}  style={{ color:'white',marginRight:10,width:95,borderRadius:20,margin:10}}>
      <Image source={require('../../../assets/delete3.jpg')} style={{height:50,width:50,borderRadius:50,}} />
      <Text>annuler</Text>

    </TouchableOpacity> : <View></View> }
  
              </View>
  
          </View>
      </View>

      <Dialog.Container visible={visiblea}>
        <Dialog.Title>Annulation</Dialog.Title>
        <Dialog.Description>
          Voulez-vous vraiment annuler la reservation ? 
        </Dialog.Description>
        <Dialog.Button label="non" onPress={handleCancel} />
        <Dialog.Button label="oui" onPress={handleDelete} />
      </Dialog.Container>


      </View>
    )
}

const CadreEmprunt =({cathegorie,desc,exemplaire, image,name,matricule,cathegorie2,nomBD,dateHeure})=>{


  var date = new Date(dateHeure.seconds*1000)
  var forma = date.toLocaleString()
  var format = date.toJSON(10)
  var formatDate = date.toDateString()
  var formatHeure = date.toTimeString()
 // console.log('nombd',formatDate)


    //reception des donnees
  const {currentUser,setcurrentUser}=useState('eben1@gmail.com')
  const {currentUserNewNav}= useContext(UserContext)
  
  const [dat, setDat] = useState(0)

  function subscriber (){ firebase.firestore()
  .collection('BiblioUser')
  .doc(currentUserNewNav.email)
  .onSnapshot(doc => {
   const items = []
   
   items.push(doc.data())
 
   setDat(doc.data())
 }
 )
  
 }
 
 useEffect(() =>{
   subscriber()
  },[])
                       //fin recption des donnees
                      

  const TITRE = name
// console.log('voiiiiiiiiiirrrrrrrrrrrrrr',cathegorie)

  
 
  //anuler1
  function annuler(dos){
    const ref = firebase.firestore().collection("BiblioUser")
    const refDoc = firebase.firestore().collection("BiblioInformatique")
    if( dos.etat1 == 'reserv' && dos.tabEtat1[0] == TITRE){
    ref
    .doc(dos.email) 
    .update({etat1:'ras', tabEtat1:["","",""]})
    .catch((err)=>{
      console.log(err)  
    })
    refDoc
    .doc(nomBD)
    .update({exemplaire : exemplaire + 1} )
    .then(Alert.alert('Annulation en cours...'))
    .catch((err)=>{
        console.log(err)  
      })
     
} 
    if( dos.etat2 == 'reserv' && dos.tabEtat2[0] == TITRE){
        ref
        .doc(dos.email)
        .update({etat2:'ras', tabEtat2:["","",""]})
        .catch((err)=>{
          console.log(err)
        })
        refDoc
        .doc(nomBD)
        .update({exemplaire : exemplaire + 1} )
        .then(Alert.alert('Annulation en cours...'))
        .catch((err)=>{
            console.log(err)  
          })
         
      
      }
        if( dos.etat3 == 'reserv' && dos.tabEtat3[0] == TITRE){
            ref
            .doc(dos.email)
            .update({etat3:'ras', tabEtat3:["","",""]})
            .catch((err)=>{
              console.log(err)
            })
            refDoc
            .doc(nomBD)
            .update({exemplaire : exemplaire + 1 })
            .then(Alert.alert('Annulation en cours...'))
            .catch((err)=>{
                console.log(err)  
              })
             
           
          }         
  }

    return(
        <View style={{width:WIDTH,height:200,marginTop:50}}>
              {/** Cadre */}
      <Text style={{color:'gray', fontSize:10,textDecorationLine: 'line-through', textDecorationStyle: 'solid',textAlign:'center',textDecorationColor:'#DCDCDC'}}>-                                                                                                                       -</Text>

      <View style={{flexDirection:'row',width:WIDTH,}}>
          <Image style={{height:150,width:90, resizeMode:'contain',marginLeft:7}} source={{uri:image}} />
          <View style={{width:'77%',flexDirection:'column',justifyContent:'space-between',margin:5}}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{color:'#000',fontFamily:'Georgia',fontSize:20,margin:8}}>{name}</Text>
                  {/*<Image style={{height:25,width:25,marginRight:17}} source={require('../../../assets/image/coeur.png')} />*/}
              </View>

              <Text style={{color:'#000',fontFamily:'Georgia',fontSize:14,margin:8}}>{formatDate}</Text>
              <Text style={{color:'#000',fontFamily:'Georgia',fontSize:14,margin:8}}>{formatHeure}</Text>

  
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:1}}>
                 
  
                   {/** quantity */}
                   { cathegorie2!='emprunt' ? 
    <TouchableOpacity onPress={()=>annuler(dat)}  style={{ color:'white',marginRight:20,backgroundColor:'red'}}>
      <Text>ANNULLER</Text>
    </TouchableOpacity> : <View></View> }
  
              </View>
  
          </View>
      </View>


      </View>
    )
}


const styles = StyleSheet.create({
    
    wrap:{
   //   width:WIDTH,
    //  height:450,
      margin: 12,
    //  flexDirection:'column',
      flexWrap:'wrap'
    },
    inputA: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
      input:{
        borderWidth: 1,
        height: 40,
        padding: 10,
        width:250,
        borderBottomLeftRadius:20,
        borderTopLeftRadius:20  
    },
    search:{
        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
        marginLeft:10,
        marginTop:15
    },
    footerIcon:{
      width:WIDTH*0.085,
      height:HEIGHT*0.025,
      margin:WIDTH*0.012,
      
    },
    
  
  });
  

export default Panier