import React from 'react';

import main     from './src/main';
import checkin  from './src/checkin';
import checkout from './src/checkout';
import student  from './src/student';
import login    from './src/login';
import test    from './src/test';

import { AppRegistry,View, Image, TouchableOpacity,Text} from 'react-native';
import { DrawerItems,Icon,Header,Left,Button,Body,Title} from 'native-base';
import {createBottomTabNavigator,createStackNavigator,createSwitchNavigator, createAppContainer } from "react-navigation";
import { Ionicons } from 'react-native-vector-icons';



const AuthStack = createStackNavigator(
  {
    LoginScreen: {screen:login,navigationOptions: { header: null }},
    TestScreen: {screen:test,navigationOptions: { header: null }},
  },
  {
    initialRouteName: "LoginScreen",
  }
);

const AppStack = createStackNavigator(
  {
    MainScreen:     {screen:main,navigationOptions:{header:null}},
    CheckingScreen: {screen:checkin,navigationOptions:{header:null}},
    CheckoutScreen: {screen:checkout,navigationOptions:{header:null}},
    StudentScreen:  {screen:student,navigationOptions:{header:null}}
  }
)


const AppContainer = createAppContainer(
  createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  }
));


export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      fontLoaded: false
    }
  }

  render() {
    return(
      <AppContainer/>
    )
  }
}
