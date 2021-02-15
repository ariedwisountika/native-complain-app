import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, ChatScreen, WebScreen} from '../components';

const Stack = createStackNavigator();

function Router() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Web" component={WebScreen} />
    </Stack.Navigator>
  );
}

export default Router;
