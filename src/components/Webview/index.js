import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';

// ...
class WebScreen extends Component {
  fileObj = [];
  fileArray = [];
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmit2 = this.onSubmit2.bind(this);
    this.textInput = React.createRef();
    this.onHandleTelephoneChange = this.onHandleTelephoneChange.bind(this);
    this.state = {
      imgCollection: '',
      regexp: /^[0-9\b]+$/,
      input: {},
      errors: {},
      phoneBride: '',
    };
  }

  // handleChange(event) {
  //   // this.setState({ value: event.target.value });
  //   alert(event.target.value);

  //   console.log(event);
  // }

  handleChange(event) {
    let input = this.state.input;
    input[event.target.name] = event.target.value;
    if (event.target.name == 'imgCollection') {
      this.onFileChange(event);
    } else if (event.target.name == 'notelp') {
      this.onHandleTelephoneChange(event);
    } else {
      this.setState({
        input,
      });
    }

    // this.validate();
  }

  validasiEkstenFoto(val) {
    let _validFileExtensions = ['.jpg', '.jpeg'];
    // let _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];

    if (val.length > 0) {
      var blnValid = 1;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (
          val
            .substr(val.length - sCurExtension.length, sCurExtension.length)
            .toLowerCase() == sCurExtension.toLowerCase()
        ) {
          blnValid = 0;
          // return;
        }
      }

      // if (blnValid) {
      //   let msg =
      //     "Format gambar tidak sesuai, ekstensi file yang sesuai, yaitu; " +
      //     _validFileExtensions.join(", ");
      //   alert(msg);
      //   // this.textInput.current.value = "";
      // }
      return blnValid;
    }
  }

  // onHandleTelephoneChange(e) {
  //   let input = this.state.input;
  //   let telephone = e.target.value;

  //   // if (!Number(telephone)) {
  //   //   return;
  //   // }

  //   // if value is not blank, then test the regex
  //   if (telephone === "" || this.state.regexp.test(telephone)) {
  //     // this.setState({ [e.target.name]: telephone });
  //     input[e.target.name] = telephone;
  //     this.setState({
  //       input,
  //     });
  //   }
  // }
  onHandleTelephoneChange(e) {
    let input = this.state.input;

    const phoneBride = e.target.validity.valid
      ? e.target.value
      : this.state.phoneBride;

    this.setState({phoneBride});
    // input[e.target.name] = this.state.phoneBride;
    // this.setState({
    //   input,
    // });
    // console.log(this.state.phoneBride);
    // console.log(this.state.input);
  }

  onFileChange(e) {
    //=============
    let eks = 0;
    let input = this.state.input;
    this.fileObj = [];
    this.fileArray = [];
    // input[e.target.name] = this.fileArray;
    this.setState({imgCollection: ''});
    this.setState({imgCollection: e.target.files});
    //=============
    this.fileObj.push(e.target.files);
    for (let i = 0; i < this.fileObj[0].length; i++) {
      let image = this.fileObj[0][i].name;
      this.fileArray.push(URL.createObjectURL(this.fileObj[0][i]));
      eks += this.validasiEkstenFoto(image);
      console.log(this.fileObj[0][i]);
      console.log(image);
    }

    console.log(`eks  ${eks}`);
    console.log(this.fileArray);

    if (eks > 0) {
      let _validFileExtensions = ['.jpg', '.jpeg'];
      let msg =
        'Format gambar tidak sesuai, ekstensi file yang sesuai, yaitu; ' +
        _validFileExtensions.join(', ');

      this.fileObj = [];
      this.fileArray = [];
      this.setState({imgCollection: ''});
      input[e.target.name] = this.fileArray;
      this.setState({
        input,
      });
      this.textInput.current.value = '';
      alert(msg);
    } else {
      this.setState({file: this.fileArray});
      // @@@@@@@@@
      input[e.target.name] = this.fileArray;
      this.setState({
        input,
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    let input = this.state.input;
    input.notelp = this.state.phoneBride;
    this.setState({
      input,
    });
    console.log(this.state.input);
    console.log(this.state.phoneBride);
    if (this.validate()) {
      console.log(this.state);
      // return false;
      var formData = new FormData();
      //=============
      for (const key of Object.keys(this.state.imgCollection)) {
        formData.append('imgCollection', this.state.imgCollection[key]);
      }
      //=============
      // formData.append("multiUpload", this.state.file);
      // @@@@@@@@@
      formData.append('name', this.state.input.name);
      formData.append('notelp', this.state.input.notelp);
      formData.append('email', this.state.input.email);
      formData.append('topik', this.state.input.topik);
      formData.append('location', this.state.input.location);
      formData.append('info', this.state.input.info);
      // formData.append("testinput", "test aja aaa");
      // formData.append("testlagi", "test aja lagi");
      // formData.append("testcoba", "test aja coba");
      console.log(this.state.input.imgCollection);
      console.log([...formData]);

      axios
        .post('http://localhost:5000/api/upload-images', formData, {})
        .then((res) => {
          console.log(res.data);
          this.fileObj = [];
          this.fileArray = [];

          let input = {};
          input.name = '';
          input.notelp = '';
          input.email = '';
          input.topik = '';
          input.location = '';
          input.info = '';
          input.imgCollection = '';
          this.setState({imgCollection: ''});
          this.setState({phoneBride: ''});
          this.textInput.current.value = '';

          this.setState({input: input});
        });

      alert('Data berhasil disimpan.');
    }
  }

  onSubmit2(e) {
    e.preventDefault();

    console.log(this.state.input);
    if (this.validate()) {
      console.log(this.state);

      let input = {};
      input.name = '';
      input.notelp = '';
      input.email = '';
      input.topik = '';
      input.location = '';
      input.info = '';
      input.imgCollection = '';

      this.setState({input: input});

      alert('Demo Form is submited');
    }
  }

  validate() {
    let input = this.state.input;
    let errors = {};
    let isValid = true;

    if (!input.name) {
      isValid = false;
      errors.name = 'Mohon masukan nama.';
    }

    if (!input.notelp) {
      isValid = false;
      errors.notelp = 'Mohon masukan no. telpon.';
    }

    if (!input.email) {
      isValid = false;
      errors.email = 'Mohon masukan email.';
    }

    if (typeof input.email !== 'undefined') {
      var pattern = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);
      if (!pattern.test(input.email)) {
        isValid = false;
        errors.email = 'Mohon pastikan format email valid.';
      }
    }

    if (!input.topik) {
      isValid = false;
      errors.topik = 'Mohon masukan topik.';
    }

    if (!input.location) {
      isValid = false;
      errors.location = 'Mohon masukan lokasi.';
    }

    if (!input.info) {
      isValid = false;
      errors.info = 'Mohon masukan info.';
    }

    if (!input.imgCollection || input.imgCollection.length == 0) {
      isValid = false;
      errors.imgCollection = 'Mohon masukan gambar bukti.';
    }

    this.setState({
      errors: errors,
    });

    if (!isValid) {
      alert(
        'Mohon pastikan data sudah diisi.\n Dan email sudah sesuai format email, contoh; `formattest@email.com`',
      );
    }

    return isValid;
  }

  render() {
    let jsCode =
      '!function(){var e=function(e,n,t){if(n=n.replace(/^on/g,""),"addEventListener"in window)e.addEventListener(n,t,!1);else if("attachEvent"in window)e.attachEvent("on"+n,t);else{var o=e["on"+n];e["on"+n]=o?function(e){o(e),t(e)}:t}return e},n=document.querySelectorAll("a[href]");if(n)for(var t in n)n.hasOwnProperty(t)&&e(n[t],"onclick",function(e){new RegExp("^https?://"+location.host,"gi").test(this.href)||(e.preventDefault(),window.postMessage(JSON.stringify({external_url_open:this.href})))})}();';
    return (
      <View style={{flex: 1}}>
        <WebView
          source={{uri: 'http://192.168.0.104:3000/FormData'}}
          onError={console.error.bind(console, 'error')}
          javaScriptEnabled={true}
          onMessage={this.onMessage.bind(this)}
          injectedJavaScript={jsCode}
          style={{flex: 1, marginRight: 20, marginLeft: 10}}
        />
      </View>
    );
  }
  onMessage(e) {
    // retrieve event data
    var data = e.nativeEvent.data;
    // maybe parse stringified JSON
    try {
      data = JSON.parse(data);
    } catch (e) {}

    // check if this message concerns us
    if (typeof data === 'object' && data.external_url_open) {
      // proceed with URL open request
    }
  }
}

export default WebScreen;
