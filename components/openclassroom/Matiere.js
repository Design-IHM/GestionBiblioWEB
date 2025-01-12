import { View, Text, ScrollView, Dimensions, TouchableOpacity,Image, ImageBackground,Modal, SafeAreaView,Alert } from 'react-native'
import React, { useState,useEffect,useContext } from 'react'
import firebase from '../../config'
import { UserContext } from '../navigation/NewNav'
import SmallRect2 from './SmallRect2'
import { doc, updateDoc, arrayUnion, arrayRemove,serverTimestamp,Timestamp,getDoc } from "firebase/firestore";

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const vid = 'https://drive.google.com/file/d/1QImxZc1-8B7a9VbmaD8NBqYdPui4NuYW/view?usp=share_link'




const Matiere = (props,{inscrit}) => {

  const {currentUser,datUser, setDatUser,modalArchive,setModalArchive,currentUserNewNav}= useContext(UserContext)

    const [modalApercu,setModalApercu]=useState(false)
    const [modalTable,setModalTable]=useState(false)
    const [modalContributeurs,setModalContributeurs]=useState(false)
    const  [Control,setControl]=useState('apercu')

    const {num,chemin,video,name,img,nameCollection,chemincc,cheminsn,cheminsite,videoPresentation,nomProf,imageProf,objectif,prerequis,nomDepartement,cheminTableMatiere,test,archives} = props.route.params
   // console.log('dans Matiere',cheminTableMatiere)


   const voirCours = (partieDuCours,index,tableCours) => {
    props.navigation.navigate('Cours',{
      partieDuCours:partieDuCours,
      index:index,
      tableCours:tableCours
    })
    setModalTable(!modalTable)
  } 

  const voirCoursInscrit = (dataTableMatiere,indChap,indPartieCours,test) => {
    props.navigation.navigate('CoursInscrit',{
      dataTableMatiere:dataTableMatiere,
      indChap:indChap,
      indPartieCours:indPartieCours,
      test:test
    })

  } 
  console.log("archives",archives)

  const Sinscrire=()=>{
    const ref = firebase.firestore().collection("BiblioUser")

    ref
    .doc("eben1@gmail.com") 
    .update({inscritArchi:'di'})
    .then(Alert.alert("demande d'inscription envoyée avec succes !!!"))
    .catch((err)=>{
      console.log(err)  
    })
    

  }

    const voirVideo = (vid)=>{
      props.navigation.navigate('VideoCours',{
        vid:vid
      })
    }


       //debut firebase   pour les CC

       const refTableMatiere = firebase.firestore().collection(cheminTableMatiere)

       const [dataTableMatiere,setDataTableMatiere]=useState([])
       const [loaderTableMatiere,setLoaderTableMatiere] = useState(true)
   
   
      
       function getDataTableMatiere(){ 
        refTableMatiere.onSnapshot((querySnapshot) => {
          const items = []
          querySnapshot.forEach((doc) => {
            items.push(doc.data())
          })
          setDataTableMatiere(items)
          setLoaderTableMatiere(false)
        })
       }
      
       useEffect(() =>{
        getDataTableMatiere()
       },[])
   
      //firebase fin


   //   const [datUser, setDatUser] = useState(null)
      // const [comment,setComment]=useState([])
      
           //reception des donnees
        //   const currentUser=useContext(UserContext)
      
      //     const [datd, setDatd] = useState()
           const [mes, setMes]= useState()
         
           function subscribed (){ firebase.firestore()
           .collection('BiblioUser')
           .doc("eben1@gmail.com")
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
           },[])
      
           function ajouter1(){
            // debut ajouter tableau
            const washingtonRef = firebase.firestore().collection("BiblioUser").doc(currentUserNewNav.email)
           // ajusterPrix(ChooseChoise[3])
            washingtonRef.update({
              userPanier: arrayUnion({"etat":"panier", "image": "","nom": "", "prix":""})
            });
           // setModalComm(!modalComm)
         //   Alert.alert('Ajouté au panier avec succes!!! ')
        //    console.log(washingtonRef) 
           }
          // console.log(dat.etat1)//receptions des donnees                  //fin recption des donnees
  //   console.log(datUser.inscritArchi)    

  return (
    <ScrollView style={{backgroundColor:'#fff',width:WIDTH}}>
      <TouchableOpacity style={{shadowColor: '#171717',shadowOffset: {width: -2, height: 4},shadowOpacity: 0.4,shadowRadius: 3,width:50,marginLeft:20}} onPress={()=>props.navigation.goBack()}>
        <View style={{backgroundColor:'#000',padding:1,borderRadius:25,marginTop:15}}>
        <Text style={{fontSize:20,color:'#fff',textAlign:'center'}}>{'<<'}</Text>
        </View>
      </TouchableOpacity>
      <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:15}}>
     
      <ImageBackground style={{height:250,width:200}} source={{uri:img}}>
        <TouchableOpacity onPress={()=> voirVideo(videoPresentation)}>
            <Image style={{height:60,width:60,borderRadius:35,alignSelf:'center',marginTop:100}} source={require('../../assets/playvideo.png')} />
        </TouchableOpacity>
      </ImageBackground>
      <View style={{width:200}}>
        <Text style={{padding:5,textAlign:'center',color:'rgb(136,136,136)',fontSize:15,fontWeight:'800',flexWrap:'wrap'}}>{name}</Text>
        <Text style={{marginLeft:10,marginRight:10,fontSize:12}}>Aborder et mettre en œuvre les principales démarches en architecture système. Acquérir les bases pour élaborer l'architecture d’un système complexe. Formation courte. Experts renommés. Accompagnement sur mesure. Programmes d'études: Digital, Entreprenariat.</Text>
        <Text style={{padding:5,textAlign:'center',color:'rgb(136,136,136)',fontSize:12,fontWeight:'800'}}>cliquez sur la video pour en savoir plus.</Text>
      </View>
      </View>

      <View style={{margin:5,marginTop:30}}>
        <Text style={{fontFamily:'Georgia',color:'rgba(32,32,32,0.5)',marginLeft:25}}>{nomDepartement}</Text>
        <View style={{flexDirection:'row',paddingTop:25,paddingLeft:22}}>
            <Image style={{height:30,width:30,borderRadius:30}} source={require('../../assets/image/barre.jpg')} />
            <Text style={{marginTop:7,marginLeft:4,color:'rgba(32,32,32,0.9)'}}>Difficile</Text>
            <Image style={{height:30,width:30,borderRadius:30,marginLeft:20}} source={require('../../assets/image/alarme.png')} />
            <Text style={{marginTop:7,marginLeft:4,color:'rgba(32,32,32,0.9)'}}>50 heures</Text>
        </View>


      </View>



      <View style={{width:370,alignSelf:'center'}}>
       

          {datUser.inscritArchi == "inscrit" ?
          
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:17}}>
        <TouchableOpacity onPress={()=>voirCoursInscrit(dataTableMatiere,0,0,test)} style={{borderRadius:10,height:39,backgroundColor:'rgba(32,32,32,0.9)',width:120,marginTop:10}}>
            <Text style={{color:'#fff',fontWeight:'900',textAlign:'center',marginTop:9}}>Commencer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> setModalArchive(!modalArchive)} style={{borderRadius:10,height:39,backgroundColor:'rgba(32,32,32,0.9)',width:120,marginTop:10}}>
          <Text style={{color:'#fff',fontWeight:'900',textAlign:'center',marginTop:9}}>Archives</Text>
        </TouchableOpacity>
       </View>
            :
        <TouchableOpacity onPress={()=>Sinscrire()}  style={{height:39,backgroundColor:'rgba(255,165,0,0.9)',width:120,marginTop:10,borderRadius:10}}>
            <Text style={{color:'#fff',fontWeight:'900',textAlign:'center',marginTop:9}}>s'inscrire</Text>
        </TouchableOpacity>  
          }
      </View>


    <View style={{backgroundColor:'rgba(136,136,136,0.9)',flexDirection:'row',justifyContent:'space-between',marginTop:50,padding:15}}>
       
       <TouchableOpacity onPress={()=> setControl('apercu')} style={{margin:5}}>
        <Text style={{color:'#fff',fontSize:13,fontWeight:'700',alignSelf:'center'}}>Apercu</Text>
        {Control=="apercu"? <View style={{height:1,width:80,backgroundColor:'#fff',alignSelf:'center'}}></View>:<View></View>}
       </TouchableOpacity>

       <TouchableOpacity onPress={()=> setControl('opo')} style={{margin:5}}>
        <Text style={{color:'#fff',fontSize:13,fontWeight:'700'}}>Table de matière</Text>
        {Control=="opo"? <View style={{height:1,width:120,backgroundColor:'#fff'}}></View>:<View></View>}
       </TouchableOpacity>

       <TouchableOpacity onPress={()=> setControl('contri')} style={{margin:5}}>
        <Text style={{color:'#fff',fontSize:13,fontWeight:'700'}}>Contributeurs</Text>
        {Control=="contri"? <View style={{height:1,width:105,backgroundColor:'#fff'}}></View>:<View></View>}
       </TouchableOpacity>
    </View>

          {
            Control=="apercu" ?
           (
            <View style={{}}>
    <ScrollView  style={{backgroundColor:'rgba(136,136,136,0.5)',}}>
         <SafeAreaView style={{margin:5,flexDirection:'row',alignContent:'center',alignSelf:'center'}}>
            
            <Text style={{fontWeight:'800',fontSize:20,color:'#fff',textAlign:'center',alignSelf:'center',margin:15}}>Objectifs Pédagogiques</Text>
         </SafeAreaView>

            <View style={{height:2,width:WIDTH,backgroundColor:'#fff'}}></View>


         {
        objectif.map((dev,index) => 
        <View key={index} style={{flexDirection:'row',width:300,marginLeft:10,marginTop:10}}>
        <Image style={{height:40,width:40,borderRadius:40}} source={require('../../assets/image/ampoule.jpg')} />
        <Text style={{marginLeft:5,marginTop:7,fontFamily:'Georgia',fontSize:15,color:'#fff',fontWeight:'900'}}>{dev}</Text>
     </View>)
      }


         <Image style={{height:200,width:200,borderRadius:100,alignSelf:'center',marginTop:20,marginBottom:20}} source={require('../../assets/image/femh1.jpg')} />
         
         <Text style={{fontWeight:'800',fontSize:24,color:'#fff',textAlign:'center',alignSelf:'center',marginLeft:25}}>Pré-requis</Text>

         <Text style={{textDecorationLine:'line-through',color:'#fff',textDecorationColor:'#fff',marginTop:1,alignSelf:'center'}}>-                                                                         -</Text>

         {
        prerequis.map((dev,index) => 
        <View key={index} style={{width:350,marginLeft:7}}>
        <Text style={{fontFamily:'Georgia'}}>{dev}</Text>
     </View>)
      }

        

         <Image style={{height:200,width:200,borderRadius:100,alignSelf:'center',marginTop:20,marginBottom:20}} source={require('../../assets/image/femHeur.jpg')} />


    </ScrollView>
    </View>
            ) : (
              Control== "opo" ?
              ( <ScrollView style={{backgroundColor:'rgba(136,136,136,0.5)',}}>
             
                <Text style={{fontWeight:'800',fontSize:20,color:'#fff',textAlign:'center',alignSelf:'center',margin:15}}>Table de matière</Text>
             
            <View style={{height:2,width:WIDTH,backgroundColor:'#fff'}}></View>
                  
                   {/** Chapitre */}
          
                   {
                  dataTableMatiere.map((dev,index) =>
                  <View key={index}>
          
                  <View style={{marginEnd:15,alignSelf:'center',marginLeft:15}}>
                    <View style={{backgroundColor:'rgba(136,136,136,0.6)',padding:5,width:WIDTH*0.98}}>
                      <Text style={{color:'#fff',fontSize:10,}}>chap{index+1}:</Text>
                      <Text style={{color:'#fff',fontFamily:'Georgia',fontWeight:'700'}}> {dev.name} </Text>
                    </View>
          
                    {
                    dev.cours.map((devA,indexA)=>
                      <TouchableOpacity key={indexA} /* onPress={()=>voirCours(devA,indexA,dev.cours)} */ style={{marginLeft:20,marginTop:15,flexDirection:'row',marginBottom:15}}>
                        <View style={{borderStyle:'solid',borderColor:'#000',borderRadius:20,backgroundColor:'rgba(136,136,136,0.6)',width:30,height:30,padding:2}}>
                          <Text style={{textAlign:'center',marginTop:4,color:'#fff'}}>{indexA}</Text>
                        </View>
                        <Text style={{marginLeft:20,marginTop:7,color:'#fff',fontFamily:'Georgia',fontWeight:'800'}}>{devA.titre}</Text>
                        {/*console.log('dans matiere',devA.texte1)*/}
                      </TouchableOpacity>
                    )
                    }        
               </View>
          
                    {/*<Chapitre  key={index} navigation={props.navigation} nomChap={dev.name} sousTitre={dev.sousTitre} cours={dev.cours} />*/}
                  </View>
                  
                  )
                }
                 
                  {/*<Chapitre navigation={props.navigation} /> */}
                  
              </ScrollView>) :
              (
                Control=="contri" ?
                (
                  <ScrollView style={{backgroundColor:'rgba(136,136,136,0.5)'}}>
                  
                      <Text style={{fontWeight:'800',fontSize:20,color:'#fff',textAlign:'center',alignSelf:'center',margin:15}}>Professeurs</Text>
                 
            <View style={{height:2,width:WIDTH,backgroundColor:'#fff'}}></View>

                    <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
                      <Image style={{height:100,width:100,borderRadius:10}} source={{uri:imageProf}} />
                      <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:40}}>{nomProf}</Text>
                  </View>
          
                  <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
                      <Image style={{height:100,width:100,borderRadius:10}} source={require('../../assets/image/prof.jpg')} />
                      <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:40}}>Dr Franck Dombou</Text>
                  </View>
          
                   <View style={{marginTop:30}}>
                      <Text style={{textAlign:'center',color:'#fff',fontWeight:'800',fontSize:24}}>Cree par :</Text>
                      <Text style={{textDecorationLine:'line-through',color:'#fff',textDecorationColor:'#fff',marginTop:1,alignSelf:'center'}}>-                                                                         -</Text>
                   </View>
          
                   <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
                      <Image style={{height:80,width:80,borderRadius:70}} source={require('../../assets/image/enspy.jpg')} />
                      <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:30}}>E N S P Y </Text>
                  </View>
          
                  <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
                      <Image style={{height:80,width:80,borderRadius:70}} source={require('../../assets/image/learn2.jpg')} />
                      <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:30}}>POLYTECH'LEARNING</Text>
                  </View>
          
                  <View style={{marginTop:20,marginLeft:15}}>
                      <Text>Mis à jour le 2022-06-07</Text>
                      <View style={{flexDirection:'row',marginTop:15}}>
                          <Text style={{fontWeight:'700',marginTop:7}}>Licence : </Text>
                          <Image style={{height:30,width:30,borderRadius:30,marginLeft:10}} source={require('../../assets/image/licence.png')} />
                          <Image style={{height:30,width:30,borderRadius:30,marginLeft:10}} source={require('../../assets/image/licence1.png')} />
                      </View>
                  </View>
              </ScrollView>
                ):<View></View>
              )
            )

          }
    
    

    {/**modal APERCU */}

    <Modal animationType='slide'
         transparent={true}
         visible={modalApercu}
         onRequestClose={() => {
            setModalApercu(!modalApercu)
         
         }}
  >
    <ScrollView  style={{backgroundColor:'rgba(70,130,180,0.9)',}}>
         <SafeAreaView style={{margin:5,flexDirection:'row'}}>
            <TouchableOpacity onPress={()=> setModalApercu(!modalApercu)}>
             <Text style={{fontWeight:'800',fontSize:20,color:'#fff',}}>{"<<"}</Text>
            </TouchableOpacity>
            <Text style={{fontWeight:'800',fontSize:24,color:'#fff',textAlign:'center',alignSelf:'center',marginLeft:25}}>Objectifs Pédagogiques</Text>
         </SafeAreaView>

         <Text style={{textDecorationLine:'line-through',color:'#fff',textDecorationColor:'#fff',marginTop:10,alignSelf:'center'}}>-                                                                         -</Text>
        


         {
        objectif.map((dev,index) => 
        <View key={index} style={{flexDirection:'row',width:300,marginLeft:10,marginTop:10}}>
        <Image style={{height:40,width:40,borderRadius:40}} source={require('../../assets/image/ampoule.jpg')} />
        <Text style={{marginLeft:5,marginTop:3,fontFamily:'Georgia',fontSize:15}}>{dev}</Text>
     </View>)
      }


         <Image style={{height:200,width:200,borderRadius:100,alignSelf:'center',marginTop:20,marginBottom:20}} source={require('../../assets/image/femh1.jpg')} />
         
         <Text style={{fontWeight:'800',fontSize:24,color:'#fff',textAlign:'center',alignSelf:'center',marginLeft:25}}>Pré-requis</Text>

         <Text style={{textDecorationLine:'line-through',color:'#fff',textDecorationColor:'#fff',marginTop:1,alignSelf:'center'}}>-                                                                         -</Text>

         {
        prerequis.map((dev,index) => 
        <View key={index} style={{width:350,marginLeft:7}}>
        <Text style={{fontFamily:'Georgia'}}>{dev}</Text>
     </View>)
      }

        

         <Image style={{height:200,width:200,borderRadius:100,alignSelf:'center',marginTop:20,marginBottom:20}} source={require('../../assets/image/femHeur.jpg')} />


    </ScrollView>

  </Modal>


         {/**modal Table de matiere */}

    <Modal animationType='slide'
         transparent={true}
         visible={modalTable}
         onRequestClose={() => {
            setModalTable(!modalTable)
         }}
  >
    <ScrollView style={{backgroundColor:'rgba(70,130,180,0.9)',}}>
    <SafeAreaView style={{margin:5,flexDirection:'row'}}>
            <TouchableOpacity onPress={()=> setModalTable(!modalTable)}>
             <Text style={{fontWeight:'800',fontSize:20,color:'#fff',}}>{"<<"}</Text>
            </TouchableOpacity>
            <Text style={{fontWeight:'800',fontSize:24,color:'#fff',textAlign:'center',alignSelf:'center',marginLeft:75}}>Table de matière</Text>
         </SafeAreaView>
         <Text style={{textDecorationLine:'line-through',color:'#fff',textDecorationColor:'#fff',marginTop:1,alignSelf:'center'}}>-                                                                         -</Text>

         {/** Chapitre */}

         {
        dataTableMatiere.map((dev,index) =>
        <View key={index}>

        <View style={{marginEnd:15,alignSelf:'center',marginLeft:15}}>
          <View style={{backgroundColor:'#191970',padding:5,width:WIDTH*0.98}}>
            <Text style={{color:'#fff',fontSize:10,}}>chap{index+1}:</Text>
            <Text style={{color:'#fff',fontFamily:'Georgia',fontWeight:'700'}}> {dev.name} </Text>
          </View>

          {
          dev.cours.map((devA,indexA)=>
            <TouchableOpacity key={indexA} /* onPress={()=>voirCours(devA,indexA,dev.cours)} */ style={{marginLeft:20,marginTop:15,flexDirection:'row',marginBottom:15}}>
              <View style={{borderStyle:'solid',borderColor:'#000',borderRadius:20,backgroundColor:'#191970',width:30,height:30,padding:2}}>
                <Text style={{textAlign:'center',marginTop:4,color:'#fff'}}>{indexA}</Text>
              </View>
              <Text style={{marginLeft:20,marginTop:7,color:'#fff',fontFamily:'Georgia',fontWeight:'800'}}>{devA.titre}</Text>
              {/*console.log('dans matiere',devA.texte1)*/}
            </TouchableOpacity>
          )
          }        
     </View>

          {/*<Chapitre  key={index} navigation={props.navigation} nomChap={dev.name} sousTitre={dev.sousTitre} cours={dev.cours} />*/}
        </View>
        
        )
      }
       
        {/*<Chapitre navigation={props.navigation} /> */}
        
    </ScrollView>
  </Modal>


  {/**modal contributeur */}

  <Modal animationType='slide'
         transparent={true}
         visible={modalContributeurs}
         onRequestClose={() => {
            setModalContributeurs(!modalContributeurs)
         }}
  >
    <ScrollView style={{backgroundColor:'rgba(70,130,180,0.9)'}}>
        <SafeAreaView style={{margin:5,flexDirection:'row'}}>
            <TouchableOpacity onPress={()=> setModalContributeurs(!modalContributeurs)}>
             <Text style={{fontWeight:'800',fontSize:20,color:'#fff',}}>{"<<"}</Text>
            </TouchableOpacity>
            <Text style={{fontWeight:'800',fontSize:24,color:'#fff',textAlign:'center',alignSelf:'center',marginLeft:75}}>Professeurs</Text>
        </SafeAreaView>
        <Text style={{textDecorationLine:'line-through',color:'#fff',textDecorationColor:'#fff',marginTop:1,alignSelf:'center'}}>-                                                                         -</Text>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
            <Image style={{height:100,width:100,borderRadius:10}} source={{uri:imageProf}} />
            <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:40}}>{nomProf}</Text>
        </View>

        <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
            <Image style={{height:100,width:100,borderRadius:10}} source={require('../../assets/image/prof.jpg')} />
            <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:40}}>Dr Franck Dombou</Text>
        </View>

         <View style={{marginTop:30}}>
            <Text style={{textAlign:'center',color:'#fff',fontWeight:'800',fontSize:24}}>Cree par :</Text>
            <Text style={{textDecorationLine:'line-through',color:'#fff',textDecorationColor:'#fff',marginTop:1,alignSelf:'center'}}>-                                                                         -</Text>
         </View>

         <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
            <Image style={{height:80,width:80,borderRadius:70}} source={require('../../assets/image/enspy.jpg')} />
            <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:30}}>E N S P Y </Text>
        </View>

        <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
            <Image style={{height:80,width:80,borderRadius:70}} source={require('../../assets/image/learn2.jpg')} />
            <Text style={{color:'#fff',fontWeight:'800',marginLeft:10,marginTop:30}}>POLYTECH'LEARNING</Text>
        </View>

        <View style={{marginTop:20,marginLeft:15}}>
            <Text>Mis à jour le 2022-06-07</Text>
            <View style={{flexDirection:'row',marginTop:15}}>
                <Text style={{fontWeight:'700',marginTop:7}}>Licence : </Text>
                <Image style={{height:30,width:30,borderRadius:30,marginLeft:10}} source={require('../../assets/image/licence.png')} />
                <Image style={{height:30,width:30,borderRadius:30,marginLeft:10}} source={require('../../assets/image/licence1.png')} />
            </View>
        </View>
    </ScrollView>

  </Modal>


   {/**modal Archives */}

   <Modal animationType='slide'
         transparent={true}
         visible={modalArchive}
         onRequestClose={() => {
            setModalArchive(!modalArchive)
         }}
  >
    <ScrollView style={{backgroundColor:'rgba(136,136,136,0.9)'}}>
        <SafeAreaView style={{margin:5,flexDirection:'row'}}>
            <TouchableOpacity style={{paddingLeft:30,padding:20}} onPress={()=> setModalArchive(!modalArchive)}>
             <Text style={{fontWeight:'800',fontSize:20,color:'#fff',}}>{"<<"}</Text>
            </TouchableOpacity>
            <Text style={{fontWeight:'800',fontSize:24,color:'#fff',textAlign:'center',alignSelf:'center',marginLeft:75}}>Archives</Text>
        </SafeAreaView>
       
<View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>
{
  archives.map((e,index)=> <SmallRect2 props={props} key={index} image={e.image} chemin={e.chemin} name={e.name} />)          
        }

</View>

      

       
    </ScrollView>

  </Modal>




    </ScrollView>
  )
}

const Chapitre = ({navigation,nomChap,key,sousTitre,cours}) =>{
  const voirCours = (PartieDuCours) => {
    props.navigation.navigate('Cours',{
      PartieDuCours:PartieDuCours
    })    
  } 

    return(
        <View style={{marginEnd:15,alignSelf:'center',marginLeft:15}}>
        <View style={{backgroundColor:'#191970',padding:5,width:WIDTH*0.98}}>
            <Text style={{color:'#fff',fontSize:10,}}>chap{key}:</Text>
            <Text style={{color:'#fff',fontFamily:'Georgia',fontWeight:'700'}}> {nomChap} </Text>
        </View>

        {
          sousTitre.map((dev,index)=>
            <View  key={index} style={{marginLeft:20,marginTop:15,flexDirection:'row',marginBottom:15}}>
            <View style={{borderStyle:'solid',borderColor:'#000',borderRadius:20,backgroundColor:'#191970',width:30,height:30,padding:2}}>
                <Text style={{textAlign:'center',marginTop:4,color:'#fff'}}>{index}</Text>
            </View>
            <Text style={{marginLeft:20,marginTop:7,color:'#fff',fontFamily:'Georgia',fontWeight:'800'}}>{dev}</Text>
        </View>
          )
        }        
     </View>
    )
}





export default Matiere