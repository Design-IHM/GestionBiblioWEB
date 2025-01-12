import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
const Stack = createStackNavigator()

import VueUn from '../vues/VueUn'
import Cathegorie from '../composants/message/Cathegorie'
import Panier from '../composants/achats/Panier'
import Produit from '../composants/achats/Produit'
import FichePaie from '../composants/achats/FichePaie'
import BigRect from '../composants/BigRect'
import Cercle from '../composants/Cercle'
import SmallRect from '../composants/SmallRect'
import PageWeb from '../composants/PageWeb'
import ModalWeb from '../composants/ModalWeb'
import Email from '../composants/message/Email'
import Commentaire from '../composants/achats/Commentaire'
import ScreenVueUn from '../vues/ScreenVueUn'
const screenOptions = {
    headerShown:false,  
}

const NavShop = () => (
    <Stack.Navigator initialRouteName='ScreenVueUn' screenOptions={screenOptions}>
     <Stack.Screen name='ScreenVueUn' component={ScreenVueUn} />
     <Stack.Screen name='VueUn' component={VueUn} />
     <Stack.Screen name='Panier' component={Panier} />
     <Stack.Screen name='Produit' component={Produit} />
     <Stack.Screen name='FichePaie' component={FichePaie} />     
     <Stack.Screen name='BigRect' component={BigRect} />     
     <Stack.Screen name='Cercle' component={Cercle} />     
     <Stack.Screen name='Cathegorie' component={Cathegorie} />     
     <Stack.Screen name='SmallRect' component={SmallRect} />     
     <Stack.Screen name='PageWeb' component={PageWeb} />     
     <Stack.Screen name='ModalWeb' component={ModalWeb} />     
     <Stack.Screen name='Email' component={Email} />     
     <Stack.Screen name='Commentaire' component={Commentaire} />     
    </Stack.Navigator>
) 

export default NavShop