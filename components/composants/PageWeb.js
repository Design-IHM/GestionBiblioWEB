import { View, Text,SafeAreaView,Image,TouchableOpacity,StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const PageWeb = (props) => {

    const {chemin} = props.route.params

    //la webview
    const webviewRef = React.useRef(null);
    function webViewgoback() {
      if (webviewRef.current) webviewRef.current.goBack();
    }

  return (
    <SafeAreaView style={styles.container}>
    <View style={{backgroundColor:'black',width:WIDTH,height:HEIGHT,flex:1}}>

    <View style={styles.tabBarContainer}>
        <TouchableOpacity onPress={webViewgoback}>
          <Image source={require('../../assets/flech.png')} style={{width:25,height:25,transform:[{rotate:'360deg'}]}} />
        </TouchableOpacity>
      </View>

        <WebView
           startInLoadingState={true}
           ref={webviewRef}
         source={{uri: chemin }} />

     
    </View>    
</SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBarContainer: {
      backgroundColor: "#d3d3d3",
      height: 26,
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: 16,
      justifyContent: "space-between",
    },
})


export default PageWeb