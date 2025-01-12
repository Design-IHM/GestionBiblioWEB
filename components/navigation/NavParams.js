import { View, Text } from 'react-native'
import React from 'react'
import Parametre from '../vues/Parametre'
import Parametre2 from '../vues/Parametre2'
import {createStackNavigator} from '@react-navigation/stack'

const Stack = createStackNavigator() 

const screenOptions = { headerShown:false }

const NavParams = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName='Parametre'>
    <Stack.Screen name='Parametre' component={Parametre} />
    <Stack.Screen name='Parametre2' component={Parametre2} />
</Stack.Navigator>
  )
}

export default NavParams