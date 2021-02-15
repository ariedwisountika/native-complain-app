import React, {Component} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';
import {dialogflowConfig} from '../../../env';
import axios from 'axios'; // Added =========

import {v4 as uuid} from 'uuid'; // Added =========
import Cookies from 'universal-cookie'; // Added =========
const cookies = new Cookies();
class ChatScreen extends Component {
  constructor(props) {
    super(props);

    if (cookies.get('identifier-id') === undefined) {
      //cookie generated if no identifier-id is defined yet
      cookies.set('identifier-id', uuid(), {path: '/'}); //identifier-id generated for user
    }
  }

  state = {
    messages: [],
    message: '',
    question: {},
    answer: {},
    askqu: [],
  };
  componentDidMount() {
    // Dialogflow_V2.setConfiguration(
    //   dialogflowConfig.client_email,
    //   dialogflowConfig.private_key,
    //   Dialogflow_V2.LANG_ENGLISH_US,
    //   dialogflowConfig.project_id,
    // );
    console.log('Fisrt run my apps');
    // Added =========
    this.eventQuery('Welcome'); //Greetings message from the bot when the component first rendered
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;
    // Dialogflow_V2.requestQuery(
    //   message,
    //   (result) => this.handleGoogleResponse(result),
    //   (error) => console.log(error),
    // );
    this.textQuery(message);
  }

  handleGoogleResponse(result) {
    let text = result.data.fulfillmentMessages[0].text.text[0];
    // res.data.fulfillmentMessages[0].text.text[0]
    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  // Added =========
  async textQuery(text) {
    // let newMessage = {
    //   speaks: 'me',
    //   msg: {
    //     text: {
    //       text: text,
    //     },
    //     timestamp: Date.now(),
    //   },
    // };
    // this.setState({answer: newMessage});
    // this.setState({messages: [...this.state.messages, newMessage]});
    // let sesi = {
    //   question: this.state.question,
    //   answer: this.state.answer,
    // };

    // this.sendBotResponse(text);
    console.log(this.state);
    const messageIdentifier = uuid();
    const res = await axios.post('http://10.0.2.2:5000/api/text_query', {
      text,
      identifier: cookies.get('identifier-id'),
      messageIdentifier,
      languageCode: Dialogflow_V2.LANG_ENGLISH_US,
      // languageCode: navigator.language.substring(0, 2),
    });
    console.log(res.status);
    // if (res.status == 200) {
    //   this.setState({askqu: [...this.state.askqu, sesi]});
    //   console.log(this.state);
    //   this.setState({answer: {}, question: {}, askqu: []});
    // }
    console.log(`textQuery ${res}`);
    console.log(this.state);
    // res.data.fulfillmentMessages.map((msg) => {
    //   newMessage = {
    //     speaks: 'bot',
    //     msg: msg,
    //     timestamp: Date.now(),
    //   };
    //   this.setState({question: newMessage});
    //   this.setState({messages: [...this.state.messages, newMessage]});
    // });
    this.handleGoogleResponse(res);
  }
  async eventQuery(event) {
    const res = await axios.post('http://10.0.2.2:5000/api/event_query', {
      event,
      identifier: cookies.get('identifier-id'),
      messageIdentifier: uuid(),
      languageCode: Dialogflow_V2.LANG_ENGLISH_US,
      // languageCode: navigator.language.substring(0, 2),
    });
    // this.setState({ answer: {}, question: {}, askqu: [] });
    console.log(`eventQuery ${res}`);
    console.log(res.status);
    console.log(
      `res.data.fulfillmentMessages[0].text.text[0] ${res.data.fulfillmentMessages[0].text.text[0]}`,
    );
    // if (res.status == 200) {
    //   this.setState({answer: {}, question: {}, askqu: []});
    // }
    // res.data.fulfillmentMessages.map((msg) => {
    //   let newMessage = {
    //     speaks: 'bot',
    //     msg: msg,
    //     timestamp: Date.now(),
    //   };
    //   this.setState({question: newMessage});
    //   this.setState({messages: [...this.state.messages, newMessage]});
    // });

    // this.handleGoogleResponse(res);

    let msgFirst = {
      _id: 1,
      text: res.data.fulfillmentMessages[0].text.text[0],
      createdAt: new Date(),
      user: BOT_USER,
    };

    this.setState({messages: [...this.state.messages, msgFirst]});
  }

  render() {
    return (
      <View style={styles.bg}>
        <Button
          title="Klik untuk mengisi Form"
          onPress={() => this.props.navigation.navigate('Web')}
          style={styles.bgbutton}
        />
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    );
  }
}

const BOT_USER = {
  _id: 2,
  name: 'FAQ Bot',
  avatar:
    'https://www.clipartmax.com/png/middle/451-4510706_call-center-supervisor-intercom-chat-icon-svg.png',
};

export default ChatScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
});
