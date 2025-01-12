import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react'
import firebase from '../../config'

const WIDTH = Dimensions.get('window').width

const TableMatiere = (props) => {
    // numero du semestre
    const {numgo} = props.route.params

    //firebase debutttttttttttttttttttttttttttttttttttttttttttttttt

    let  ref = 0 
    if (numgo==11){
      ref = firebase.firestore().collection('cours').doc('AAMSP1').collection('S1')
    }else if(numgo==12){
      ref = firebase.firestore().collection('cours').doc('AAMSP1').collection('S2')
    } else if(numgo==21){
      ref = firebase.firestore().collection('cours').doc('AMSP2').collection('S1')
    }else if(numgo==22){
      ref = firebase.firestore().collection('cours').doc('AMSP2').collection('S2')
    }else if(numgo==31){
      ref = firebase.firestore().collection('cours').doc('GI').collection('S1')
    }else if(numgo==32){
      ref = firebase.firestore().collection('cours').doc('GI').collection('S2')
    }else if(numgo==41){ 
      ref = firebase.firestore().collection('cours').doc('GC').collection('S1')
    }else if(numgo==42){
      ref = firebase.firestore().collection('cours').doc('GC').collection('S2')
    } else if(numgo==51){
      ref = firebase.firestore().collection('cours').doc('GM').collection('S1')
    }else if(numgo==52){
      ref = firebase.firestore().collection('cours').doc('GM').collection('S2')
    }else if(numgo==61){
      ref = firebase.firestore().collection('cours').doc('GELE').collection('S1')
    }else if(numgo==62){
      ref = firebase.firestore().collection('cours').doc('GELE').collection('S2')
    }else if(numgo==71){
      ref = firebase.firestore().collection('cours').doc('GTEL').collection('S1')
    }else if(numgo==72){
      ref = firebase.firestore().collection('cours').doc('GTEL').collection('S2')
    }

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

   //firebase finnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn

   const voirMatiere = (num,chemin,video,name,img,chemincc,cheminsn,cheminsite,videoPresentation,nomProf,imageProf,objectif,prerequis,nomDepartement,cheminTableMatiere,test,archives) => {
    props.navigation.navigate('Matiere',{
      num:num,
      chemin:chemin,
      video:video,
      name : name,
      img:img,
      chemincc:chemincc,
      cheminsn:cheminsn,
      cheminsite:cheminsite,
      videoPresentation:videoPresentation,
      nomProf:nomProf,
      imageProf:imageProf,
      objectif:objectif,
      prerequis:prerequis,
      nomDepartement:nomDepartement,
      cheminTableMatiere:cheminTableMatiere,
      test:test,
      archives:archives
    })} 



  return (
    <ScrollView style={{backgroundColor:'#fff',width:WIDTH}}>
      {
        data.map((dev,index) => 
        <TouchableOpacity key={index} onPress={()=> voirMatiere(dev.id,dev.chemin,dev.video,dev.name,dev.img,dev.chemincc,dev.cheminsn,dev.cheminsite,dev.videoPresentation,dev.nomprof,dev.imageProf,dev.objectif,dev.prerequis,dev.nomDepartement,dev.cheminTableMatiere,dev.test,dev.archives)}  >
          <CadreMatiere navigation={props.navigation} name={dev.name} src={dev.img} />
        </TouchableOpacity>)
      }
    
    </ScrollView>
  )
}


const CadreMatiere = ({navigation,name,src}) =>{
 
 


    return(
        <View style={{flexDirection:'row',margin:7}}>
        
        <Image style={{height:90,width:90,borderRadius:20}} source={{uri:src}} />
        <View>
        <View style={{width:300}}>
            <Text style={{margin:4,fontWeight:'800',color:'#000',fontFamily:'Georgia',fontSize:17}}>{name}</Text>
            <Text style={{flexWrap:'wrap',color:'#000',margin:4,fontSize:10}}>decouvrez toutes les notions qui feront de vous le meilleur ingenieur de tous les temps</Text>
        </View>
        <View style={{flexDirection:'row'}}>
            <Image style={{height:30,width:30,borderRadius:30,marginLeft:4}} source={require('../../assets/image/barre.jpg')} />
            <Text style={{marginLeft:5,marginTop:7,color:'#000'}}>Difficile</Text>
           
        </View>
      </View>
      </View>
    )
}


export default TableMatiere