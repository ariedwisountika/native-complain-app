import React, {Component} from 'react'
import Router from './router'
import { NavigationContainer } from '@react-navigation/native';



class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    )
  }
}

export default  App;

