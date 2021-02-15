import React from 'react';
import {StyleSheet, View, Image, Button} from 'react-native';

function HomeScreen({navigation}) {
  return (
    <View style={styles.homes}>
      <Image
        source={require('../../asset/background.jpg')}
        style={styles.bg1}
      />
      <Image source={require('../../asset/logo.png')} style={styles.bg2} />
      <Button
        title="Chat Now"
        onPress={() => navigation.navigate('Chat')}
        style={styles.bgbutton}
      />
      <Button
        title="tES"
        onPress={() => navigation.navigate('Web')}
        style={styles.bgbutton}
      />
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  homes: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg1: {
    position: 'absolute',
    height: 700,
    width: 420,
  },
  bg2: {
    height: 300,
    width: 400,
  },
  bgbutton: {},
});
