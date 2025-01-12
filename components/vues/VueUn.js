import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import elec from '../../assets/biblio/elec.jpg'
import gi from '../../assets/biblio/info.jpg'
import math from '../../assets/biblio/math.jpg'
import meca from '../../assets/biblio/meca.jpg'
import physik from '../../assets/biblio/physik.jpg'
import telcom from '../../assets/biblio/telcom.jpg'
import MenGI from '../../assets/memoire1.jpg'
import memgc from '../../assets/memoire2.jpg'
import memgind from '../../assets/memoire3.jpg'
import memgele from '../../assets/memoire4.jpg'
import memgm from '../../assets/memoire5.jpg'
import memgtel from '../../assets/memoire6.jpg'
import firebase from '../../config'
import BigRect from '../composants/BigRect'
import Cercle from '../composants/Cercle'
import PubCar from '../composants/PubCar'
import PubRect from '../composants/PubRect'
import SmallRect from '../composants/SmallRect'
import { UserContext } from '../navigation/NewNav'
import { UserContexte } from './MainContainer'



const WIDTH=Dimensions.get('screen').width
const HEIGHT=Dimensions.get('screen').height

const VueUn = (props) => {

  const {currentUserNewNav}= useContext(UserContext)
//console.log("DATUSER DANS VUEUN1",datUser.docRecentRegarder)
 // const [datUser, setDatUser] = useState()
 // const [comment,setComment]=useState([])


 
  //reception des donnees
  //   const currentUser=useContext(UserContext)
 
 //     const [datd, setDatd] = useState()
      const [mes, setMes]= useState()
    
      function subscribed (){ firebase.firestore()
      .collection('BiblioUser')
      .doc(currentUserNewNav.email)
      .onSnapshot(doc => {
       const items = []
       
       items.push(doc.data())
     
     //  setDatUser(doc.data())
       setMes(doc.data().name)
     }
     )
    }
     
     useEffect(() =>{
       subscribed()
      },[])
     // console.log(dat.etat1)//receptions des donnees                  //fin recption des donnees
    
               


  const [modalWeb,setModalWeb]=useState(false)
  const voirModalWeb =(modalWeb,setModalWeb)=>{
    props.navigation.navigate('ModalWeb',{
      modalWeb:!modalWeb,
      setModalWeb:setModalWeb
    })
  }
  
  //gestion de biblioWEB
  //GESTION BIBLIO WEB


   //firebase debut
   let  refWeb = 0 
    
   refWeb = firebase.firestore().collection("BiblioWeb").orderBy("name","asc")
 

 // console.log(ref)
 
  const [dataWeb,setDataWeb]=useState([])
  const [loaderWeb,setLoaderWeb] = useState(true)
 
  function getDataWeb(){
   refWeb.onSnapshot((querySnapshot) => { 
     const items = []
     querySnapshot.forEach((doc) => {
       items.push(doc.data())
     })
     setDataWeb(items)
     setLoaderWeb(false)
   })
  }
 
  useEffect(() =>{
   getDataWeb()
 },[])

  // FIN GESTION BIBLIO WEB 
  //FIN GESTION BIBLIO WEB  
  return (
    <SafeAreaView style={styles.container}>
      {/** BAR 1 */}
      <View style={styles.barre}>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{flexDirection:'row'}} >
        <TouchableOpacity onPress={()=> <ModalWebLocal modalWeb={!modalWeb} setModalWeb={setModalWeb}  />}>
          <Text style={{fontFamily:'Georgia',fontSize:20,marginRight:10,color:'gray'}}></Text>
        </TouchableOpacity>
        
      </ScrollView>
      </View>

     <Page props={props} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{

  },
  barre:{

  }
})

const Page = ({props}) => {

const {datUserTest, setDatUserTest,currentUserRecent, setCurrentUserRecent,datUser, setDatUser,currentUserNewNav}=useContext(UserContext)
//setDatUser([{"docRent":"doc1"}])
//const [datUserPage, setDatUserpage] = useState([{"docRent":"doc1"}])

 
//console.log('datUserTest dans VueUn12345',datUserTest) 
//console.log('datUser dans VueUn12345',datUser) 
useEffect(() => {
  setTimeout(() => {
    setDatUserTest(false);
  }, 10000);
}, []);
// const [datUser, setDatUser] = useState()
  // const [comment,setComment]=useState([])
  
       //reception des donnees
    //   const currentUser=useContext(UserContext)
  
  //     const [datd, setDatd] = useState()
       const [mes, setMes]= useState()
     
       function subscribed (){ firebase.firestore()
       .collection('BiblioUser')
       .doc(currentUserNewNav.email)
       .onSnapshot(doc => {
        const items = []
        
        items.push(doc.data())
      
        setDatUser(doc.data())
      //  setMes(doc.data().name)
      }
      )
       
      }
      
      useEffect(() =>{
        subscribed()
      //  console.log(datUser.docRecent)
       },[])
      // console.log(dat.etat1)//receptions des donnees                  //fin recption des donnees
     


     //gestion de biblioWEB
  //GESTION BIBLIO WEB


   //firebase debut
   let  refWeb = 0 
    
   refWeb = firebase.firestore().collection("BiblioWeb").orderBy("name","asc")
 

 // console.log(ref)
 
  const [dataWeb,setDataWeb]=useState([])
  const [loaderWeb,setLoaderWeb] = useState(true)
 
  function getDataWeb(){
   refWeb.onSnapshot((querySnapshot) => { 
     const items = []
     querySnapshot.forEach((doc) => {
       items.push(doc.data())
     })
     setDataWeb(items)
     setLoaderWeb(false)
   })
  }
 
  useEffect(() =>{
   getDataWeb()
 },[])





  // FIN GESTION BIBLIO WEB 



      //firebase debut
      const ref= firebase.firestore().collection("BiblioInformatique")
    
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
     
      useEffect(() =>{
       getData()
     
      },[])
     //firebase fin

  const {datUser1,currentUser,loadingData}= useContext(UserContexte)
    //  console.log("datUser.docRecent",datUser.docRecent)
    const [voirDepart,setVoirDepart]=useState('departement')

  return(
    <ScrollView>

    {/** reduction */}
   {/* <View style={{height:25,backgroundColor:'red',marginTop:1}}>
      <Text style={{textAlign:'center',fontFamily:'Georgia',fontWeight:'bold',marginTop:5}}>BUY 3 GET 60% OFF</Text>
  </View> */}

    {/** publicite1 */}
    <PubCar />
    <PubRect />


 

  

  {/**VENTE FLASH */}
  <View style={{margin:5,marginBottom:47,marginTop:10}}>
    <View style={{}}>
      <Text style={{textAlign:'center',marginTop:5,fontSize:15,fontFamily:'Georgia',fontWeight:'900'}}>#Biblio Electronique</Text>
     
    </View>

      {/** chrono */}
    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
      <View>
        <Text style={{textAlign:'center',margin:10,fontFamily:'Georgia',}}>Lisez en ligne sur les plus grandes plateformes de e-book du monde.</Text>
      </View>
    </View>

    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>

    {
      dataWeb.map((e,index)=> <SmallRect props={props} key={index} image={e.image} chemin={e.chemin} name={e.name} />)          
    }
  </ScrollView>
  </View>

   {/* <View style={{flexDirection:'row',marginTop:20}}>
      <TouchableOpacity onPress={()=>setVoirDepart('departement')} style={{height:50,width:WIDTH*0.5,backgroundColor:voirDepart=="departement"? 'gray':"#000"}}>
      <Text style={{textAlign:'center',marginTop:10,fontSize:20,fontWeight:'800',color:'#fff'}}>departement</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>setVoirDepart('memoire')} style={{height:50,width:WIDTH*0.5,backgroundColor:voirDepart=="memoire"? 'gray':"#000"}}>
        <Text style={{textAlign:'center',marginTop:10,fontSize:20,fontWeight:'800',color:'#fff'}}>Memoires</Text>
      </TouchableOpacity>
    </View>*/}
    <View style={{height:0.5,width:WIDTH,backgroundColor:'gray'}}></View>

    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20}}>
      
      <TouchableOpacity onPress={()=>setVoirDepart('departement')} style={{backgroundColor: voirDepart=="departement"?  'rgb(136,136,136)':'rgb(32,32,32)',borderRadius:10,shadowColor: '#171717',shadowOffset: {width: -2, height: 4},shadowOpacity: 0.4,shadowRadius: 3,}}>
      <Text style={{textAlign:'center',fontSize:20,fontWeight:'bold',color:'#fff',margin:10}}>DEPARTEMENT</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>setVoirDepart('memoire')} style={{backgroundColor:voirDepart=="memoire"? 'rgb(136,136,136)' :'rgb(32,32,32)',borderRadius:10,shadowColor: '#171717',shadowOffset: {width: -2, height: 4},shadowOpacity: 0.4,shadowRadius: 3,}}>
      <Text style={{textAlign:'center',fontSize:20,fontWeight:'bold',color:'#fff',margin:10,marginLeft:12}}> MEMOIRES         </Text>
      </TouchableOpacity>
    </View>
   {/**CATHEGORIE */}
   {
    voirDepart=="departement" ?
    <View style={{margin:5,marginBottom:10}}>
    <Text style={{fontFamily:'Georgia',fontSize:20,color:'#000',textAlign:'center',marginBottom:20,margin:20}}> LES DEPARTEMENTS </Text>
    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',marginBottom:1}}>
      
      <Cercle id='' datUser={datUser} image={meca} cathegorie="Genie Mecanique" props={props} />
      <Cercle id='' datUser={datUser} image={gi} cathegorie="Genie Informatique" props={props} />
      <Cercle id='' datUser={datUser} image={math} cathegorie="Mathematique" props={props} /> 
      </View>
    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',marginBottom:1}}>

      <Cercle  id='' datUser={datUser} image={elec} cathegorie="Genie Electrique" props={props} />
      <Cercle  id='' datUser={datUser} image={physik} cathegorie="Physique" props={props} />
      <Cercle  id='' datUser={datUser} image={telcom} cathegorie="Genie Telecom     " props={props} />
    </View>
    </View> : 
     <View style={{margin:5,marginBottom:10}}>
     <Text style={{fontFamily:'Georgia',fontSize:20,color:'#000',textAlign:'center',marginBottom:20,margin:20}}> ANCIENS MEMOIRES </Text>
    
     <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',marginBottom:1}}>
       
       <Cercle  id='' datUser={datUser} image={MenGI} cathegorie="Memoire GI" props={props} />
       <Cercle  id='' datUser={datUser} image={memgc} cathegorie="Memoire GC" props={props} />
       <Cercle  id='' datUser={datUser} image={memgm} cathegorie="Memoire GM" props={props} />
       </View>
    <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',marginBottom:1}}>

       <Cercle  id='' datUser={datUser} image={memgind} cathegorie="Memoire GInd" props={props} /> 
       <Cercle  id='' datUser={datUser} image={memgele} cathegorie="Memoire GEle" props={props} />
       <Cercle  id='' datUser={datUser} image={memgtel} cathegorie="Memoire GTel" props={props} />
     </View>
     </View>
   }
  

  {/**MEIMOIRES */}
  
 

  {/**PUBLICITE 2 */}
 
  {/**RECOMMENDATION */}


   
  <View style={{backgroundColor:'rgb(208,208,208)',marginTop:15,marginBottom:50}}>

    
  {  datUserTest ? <ActivityIndicator size="large" color="red" /> :(
      datUser.docRecent.length == 0 ?
       <>
       <View>
       <Text style={{textAlign:'center',fontFamily:'Georgia',fontWeight:'800',fontSize:17,marginBottom:15,marginTop:15}}>VOS PREFERENCES</Text>
     </View>
     <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',margin:7}}>
     {
      data.map((dev,index)=>
        dev.cathegorie == datUser.departement  ? 
        <BigRect type={dev.type} datUser={datUser} cathegorie={dev.cathegorie} props={props.navigation} name={dev.name} desc={dev.desc} etagere={dev.etagere} exemplaire={dev.exemplaire} image={dev.image} salle={dev.salle} key={index} commentaire={dev.commentaire} nomBD={dev.nomBD} />
        :
       <View key={index}>
        
       </View>  
      )  
      }
    </View>
    </>
     :
     <View></View>
 
      )}
    
    {/**preference quand il a deja reservé au moins 1 document */}
    {  datUserTest ? <Text>1{datUserTest}</Text> :(
     datUser.docRecent.length != 0 ?
      <React.Fragment>
      <View>
      <Text style={{textAlign:'center',fontFamily:'Georgia',fontWeight:'800',fontSize:17,marginBottom:15,marginTop:15}}>Recommandations</Text>
    </View>
    <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',margin:7}}>
    {/** preferences */}
    {datUserTest ? <Text>1{datUserTest}</Text> :(
      data.map((dev,index)=>
        dev.cathegorie== datUser.docRecent[datUser.docRecent.length-1].cathegorieDoc && dev.type== datUser.docRecent[datUser.docRecent.length-1].type ?
          (
            dev.cathegorie!="pub" ?
            <BigRect type={dev.type} datUser={datUser} cathegorie={dev.cathegorie} props={props.navigation} name={dev.name} desc={dev.desc} etagere={dev.etagere} exemplaire={dev.exemplaire} image={dev.image} salle={dev.salle} key={index} commentaire={dev.commentaire} nomBD={dev.nomBD} />
            :
            <React.Fragment key={index}>
              <PubCar />
              <PubRect />
            </React.Fragment>
          )
          : 
       <View key={index}></View>
      )  
          )}
    
    {
      data.map((dev,index)=>
      dev.cathegorie== datUser.docRecent[datUser.docRecent.length-1].cathegorieDoc && dev.type!= datUser.docRecent[datUser.docRecent.length-1].type ?
        <BigRect type={dev.type} datUser={datUser} cathegorie={dev.cathegorie} props={props.navigation} name={dev.name} desc={dev.desc} etagere={dev.etagere} exemplaire={dev.exemplaire} image={dev.image} salle={dev.salle} key={index} commentaire={dev.commentaire} nomBD={dev.nomBD} />
       : 
        <View key={index}></View>
      )  
  }

    {/** DEPARTEMENT */}
   
    {/*
      data.map((dev,index)=>
      dev.cathegorie== datUser.departement ?
            <BigRect type={dev.type} datUser={datUser} cathegorie={dev.cathegorie} props={props.navigation} name={dev.name} desc={dev.desc} etagere={dev.etagere} exemplaire={dev.exemplaire} image={dev.image} salle={dev.salle} key={index} commentaire={dev.commentaire} nomBD={dev.nomBD} />
       : 
       <View key={index}></View>
      )  
*/}

</View>
</React.Fragment>
    :<View></View>
  )}

  {/** pour les gars du msp */}

  {  datUserTest ? <ActivityIndicator size="large" color="red" /> :(
      datUser.docRecent.length == 0 && datUser.departement=="MSP" ?
       <>
      
     <View style={{flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',margin:7}}>
     {
      data.map((dev,index)=>
        dev.cathegorie == 'Mathematique' || dev.cathegorie == 'Physique' ? 
        <BigRect type={dev.type} datUser={datUser} cathegorie={dev.cathegorie} props={props.navigation} name={dev.name} desc={dev.desc} etagere={dev.etagere} exemplaire={dev.exemplaire} image={dev.image} salle={dev.salle} key={index} commentaire={dev.commentaire} nomBD={dev.nomBD} />
        :
       <View key={index}>
        
       </View>  
      )  
      }
    </View>
    </>
     :
     <View></View>
 
      )}
   
    

  </View>

  
  </ScrollView>
  )
}


  const ModalWebLocal = ({modalWeb,setModalWeb}) =>{
    return(
      <Modal animationType='slide'
      transparent={true}
      visible={modalWeb}
      onRequestClose={() => {
         setModalWeb(!modalWeb)
      }}
     >
         <ScrollView style={{backgroundColor:'rgba(70,130,180,0.9)'}}>
             <TouchableOpacity onPress={()=>setModalWeb(!modalWeb)}>
                 <Text>salut</Text>
             </TouchableOpacity>
         </ScrollView>

   </Modal>

    )
  }

export default VueUn