import { View, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState,useContext } from 'react'
import BigRect from '../BigRect'
import { UserContext } from '../../navigation/NewNav'
import firebase from '../../../config'



const WIDTH = Dimensions.get('window').height

const Cathegorie = (props) => {
    const {cathegorie} = props.route.params
    const {currentUser,datUser, setDatUser}= useContext(UserContext)


     //firebase debut
     let  ref = 0 
    
     ref = firebase.firestore().collection("BiblioInformatique").orderBy("name","asc")
   

   // console.log(ref)
   
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




  return (
    <ScrollView>
        <View style={{height:50,alignSelf:'center',backgroundColor:'#DCDCDC',width:WIDTH}}>
            <Text style={{textAlign:'center',fontWeight:'600',fontFamily:'Georgia',marginTop:10,fontSize:20}}>{cathegorie}</Text>
        </View>
      <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}}>

      {
          data.map((dev,index)=>
              (cathegorie== dev.cathegorie ?
                <BigRect type={dev.type} datUser={datUser} cathegorie={dev.cathegorie} props={props.navigation} name={dev.name} desc={dev.desc} etagere={dev.etagere} exemplaire={dev.exemplaire} image={dev.image} salle={dev.salle} key={index} commentaire={dev.commentaire} nomBD={dev.nomBD} />                
                : <View key={index}></View>)
          )  
          
            
          }



       
      </View>
    </ScrollView>
  )
}

export default Cathegorie