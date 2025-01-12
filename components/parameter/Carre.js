import { View, Text,Button } from 'react-native'
import React,{useEffect,useState} from 'react'

import firebase from '../../config'


const Carre = () => {

    const [image, setImage] = useState(null)
const [uploading, setUploading] = useState(false)
const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // We can  specify whether we need only Images or Videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,   // 0 means compress for small size, 1 means  compress for maximum quality
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //
  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    })
    const ref = firebase.storage().ref().child(`Pictures/Image1`)
    const snapshot = ref.put(blob)
    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
      ()=>{
        setUploading(true)
      },
      (error) => {
        setUploading(false)
        console.log(error)
        blob.close()
        return 
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false)
          console.log("Download URL: ", url)
          setImage(url)
          blob.close()
          return url
        })
      }
      )
  }


  return (
    <View style={{}}>
      {image && <Image source={{uri: image}} style={{width: 170 , height: 200}}/>}
      <Button title='Select Image' onPress={pickImage} />
      {!uploading ? <Button title='Upload Image' onPress={uploadImage} />: <ActivityIndicator size={'small'} color='black' />}
    </View>
  )
}

export default Carre