import React, {Component} from 'react';
import {StyleSheet,
ScrollView,
Dimensions,
Text,ActivityIndicator,
TouchableOpacity,
TextInput,
View,
Image,
StatusBar,
ImageBackground,
KeyboardAvoidingView,Platform} from 'react-native';
let {height, width} = Dimensions.get('window');
const DeviceWidth = Dimensions.get('window').width
import { Ionicons } from 'react-native-vector-icons';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { AsyncStorage,ToastAndroid } from 'react-native';
import { Icon,Container,Button,Content,Root, Header, Left, Body, Right,CheckBox, Title,ListItem, Subtitle } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import NfcManager, {Ndef, NfcTech, ByteParser} from 'react-native-nfc-manager'

const KeyTypes = ['A', 'B'];
const ADDRESSIP = "192.168.10.100";
export default class checkout extends Component {
    constructor(){
        super();
        this.state = {
            username: "",
            school_logo:"",
			school_name:"",
			supported: true,
            enabled: false,
            isWriting: false,
            tag: {},
            parsed: null,
            isDetecting:false,
            id: null,
            type:"Departure",
            studentData:[],
            found:false,
            anotherip:'',
            location:''
        }
    }


    _clear = () => {
    	this._stopDetection();
    	this.setState({found:false});
    	this.props.navigation.navigate('MainScreen');
    	
    }
   _requestNdefWrite = () => {
        let {isWriting} = this.state;
        if (isWriting) {
            return;
        }

        let bytes = Ndef.encodeMessage([
            Ndef.textRecord("hello, world"),
            Ndef.uriRecord("http://nodejs.org"),
        ]);

        this.setState({isWriting: true});
        NfcManager.requestNdefWrite(bytes)
            .then(() => console.log('write completed'))
            .catch(err => console.warn(err))
            .then(() => this.setState({isWriting: false}));
    }

    _cancelNdefWrite = () => {
        this.setState({isWriting: false});
        NfcManager.cancelNdefWrite()
            .then(() => console.log('write cancelled'))
            .catch(err => console.warn(err))
    }

    _startNfc() {
        NfcManager.start({
            onSessionClosedIOS: () => {
                console.log('ios session closed');
            }
        })
            .then(result => {
                console.log('start OK', result);
            })
            .catch(error => {
                console.warn('start fail', error);
                this.setState({supported: false});
            })

        if (Platform.OS === 'android') {
        	//.getLaunchTagEvent
            NfcManager.getNdefMessage()
                .then(tag => {
                    console.log('launch tag', tag);
                    if (tag) {
                        this.setState({ tag });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.isEnabled()
                .then(enabled => {
                    this.setState({ enabled });
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.onStateChanged(
                event => {
                    if (event.state === 'on') {
                        this.setState({enabled: true});
                    } else if (event.state === 'off') {
                        this.setState({enabled: false});
                    } else if (event.state === 'turning_on') {
                        // do whatever you want
                    } else if (event.state === 'turning_off') {
                        // do whatever you want
                    }
                }
            )
                .then(sub => {
                    this._stateChangedSubscription = sub; 
                    // remember to call this._stateChangedSubscription.remove()
                    // when you don't want to listen to this anymore
                })
                .catch(err => {
                    console.warn(err);
                })
        }
    }

    _onTagDiscovered = tag => {
        console.log('Tag Discovered', tag);
        this.setState({ tag });
        this.setState({id: tag.id});
        ToastAndroid.showWithGravity(
		  this.state.id,
		  ToastAndroid.SHORT,
		  ToastAndroid.CENTER,
		);
		 this._fetchStudent();
        let parsed = null;
        if (tag.ndefMessage && tag.ndefMessage.length > 0) {
            // ndefMessage is actually an array of NdefRecords, 
            // and we can iterate through each NdefRecord, decode its payload 
            // according to its TNF & type
            const ndefRecords = tag.ndefMessage;

            function decodeNdefRecord(record) {
                if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
                    return ['text', Ndef.text.decodePayload(record.payload)];
                } else if (Ndef.isType(record, Ndef.TNF_WELL_KNOWN, Ndef.RTD_URI)) {
                    return ['uri', Ndef.uri.decodePayload(record.payload)];
                }

                return ['unknown', '---']
            }

            parsed = ndefRecords.map(decodeNdefRecord);
            console.log(parsed);
        }

        this.setState({parsed});
    }

    _startDetection = () => {
        NfcManager.registerTagEvent(this._onTagDiscovered)
            .then(result => {
                console.log('registerTagEvent OK', result);
              
            })
            .catch(error => {
                console.warn('registerTagEvent fail', error)
            })
    }

    _stopDetection = () => {
        NfcManager.unregisterTagEvent()
            .then(result => {
                console.log('unregisterTagEvent OK', result)
            })
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }

    _clearMessages = () => {
        this.setState({tag: null, parsed: null});
    }

	_fetchStudent = () => {
	   return fetch("http://"+this.state.anotherip+"/top-siv/api/Attendance.php",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardnum: this.state.id,
          type: this.state.type,
          location: this.state.location
        })
      }).then((response) => response.json()).then( (responseJsonFromServer) =>{
        this.setState({ActivityLoader: false});
        if(responseJsonFromServer.message == 1){
             this.setState({studentData: responseJsonFromServer.data,found:true});
             console.log(this.state.studentData);
        }else if(responseJsonFromServer.message == 3){
			ToastAndroid.showWithGravity(
			  'YOU ARE ALREADY CHECKED OUT FOR TODAY. DO NOT TRY AGAIN',
			  ToastAndroid.LONG,
			  ToastAndroid.CENTER,
			);
        }else if(responseJsonFromServer.message == 4){
			ToastAndroid.showWithGravity(
			  'STUDENT CARD NOT REGISTERED. NO DETAILS FOUND',
			  ToastAndroid.LONG,
			  ToastAndroid.CENTER,
			);
        }else{
        	ToastAndroid.showWithGravity(
			  'CARD NOT VALID. MAKE SURE YOUR CARD IS REGISTERED BEFORE USAGE.',
			  ToastAndroid.LONG,
			  ToastAndroid.CENTER,
			);
        }
      })
	}
	componentDidMount(){
		AsyncStorage.getItem("mykey").then((data) =>{
			this.setState({anotherip: data});
			console.log(data);
		});

		AsyncStorage.getItem("termKey").then((data) =>{
			this.setState({location: data});
			console.log(data);
		});
		//NfcTech.MifareClassic
		NfcManager.isSupported(NfcTech.Ndef).then(supported => {
	      this.setState({ supported });
	      if (supported) {
	        this._startNfc();
	        this._startDetection();
	      }
	    });

		AsyncStorage.getItem("key").then((data) =>{
		  const val = JSON.parse(data);
		  this.setState({
			username: val.data.name,
			school_logo: val.sch.school_logo,
			school_name: val.sch.school_name
		  });
		})
	  }

	  componentWillUnmount(){
	  	this._stopDetection();
	  }

    render(){
    	let { supported, enabled, tag, isWriting, parsed,isDetecting } = this.state;
		let img = this.state.school_logo;
		let url = "http://"+this.state.anotherip+"/top-siv/";
		let path = url+img;

		console.log(this.state.studentData);
		
		const mg = this.state.studentData.std_img;
		const immg = "http://"+this.state.anotherip+"/top-siv/"+mg;
		
		const gender = this.state.studentData.gender;
		const phone = this.state.studentData.phone;
		const address = this.state.studentData.address;
		
        return(
            <Container>
			<Header style={styles.header}>
			  <Left>
			    <Image style={styles.logo} source={{uri: path}}/>
			  </Left>
			  <Body>
				<Title style={styles.title}>{this.state.school_name}</Title>
				<Subtitle style={styles.subtitle}>Check Out ( {this.state.location} )</Subtitle>
			  </Body>
			  <Right />
			</Header>
			<Content padder>
				
				{
					this.state.found?(
				<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
						
						<View style={{justifyContent:"center",alignItems:"center"}}>
						  <Image style={{width:250,height:250,borderRadius:10}} source={{uri: immg}} />
						</View>
						<View header style={styles.layer}>
						  <Text style={styles.modaltextbig}>{this.state.studentData.surname} {this.state.studentData.other_name}</Text>
						  <Text style={styles.modaltext}>Admission Number: {this.state.studentData.adm_no}</Text>
						  <Text style={styles.modaltext}>Studentship: {this.state.studentData.std_type}</Text>
						  <Text style={styles.modaltext}>Class: {this.state.studentData.class}</Text>
						  <Text style={styles.modaltext}>Card Number: {this.state.studentData.cardnum}</Text>
						  <Text style={styles.modaltext}>School Fees: {this.state.studentData.sch_fees_status}</Text>
						  <Text style={styles.modaltext}>Parent Number: {this.state.studentData.phone}</Text>
						  <Text style={styles.modaltext}>{this.state.studentData.address}</Text>
						</View>
						  
						
						
						<Button full success onPress={() => {this._clear()}}>
							<Text style={{fontWeight:"bold",fontSize:16,color:"white"}}>Done</Text>
						</Button>
				</View>
					): <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
						<Icon name="wifi" style={{fontSize:50,color:"#0b0461"}}/>
						<Text style={{fontSize:30,fontWeight:"bold",color:"#0b0461"}}>SCAN NOW</Text>
						<Text style={{fontSize:15,fontWeight:"bold",color:"#0b0461"}}>Please, place card to the Reader to Scan</Text>
					   </View>
				}
			</Content>
		  </Container>
        )
    }
}



const styles = StyleSheet.create({
	header:{
		backgroundColor:"#0b0461",
		color: "#fff"
	},
	logo:{
		width: 40,
		height:40,
		borderRadius:20
	},
	title:{
		color: "#fff",
		fontSize:18,
		fontWeight: "bold"
	},
	subtitle:{
		color: "#fff",
		fontSize:15,
		fontWeight: "bold"
	},
	welcomeText:{
		color:"#000",
		fontSize:20
	},
	modalheader:{
		justifyContent:"center",
		alignItems:"center",
		display:"flex",
		flexDirection:"column",
		lineHeight: 4
	},
	modaltext:{
		fontSize:16,
		color: "#0b0461",
		fontWeight:"bold",
		marginBottom:4,
		textAlign:"center"
	},
	modaltextbig:{
		fontSize:16,
		color: "#0b0461",
		fontWeight:"bold",
		marginBottom:5,
		marginTop:7,
		textTransform:"uppercase",
		textAlign:"center"
	},
	imagegrid:{
		display:"flex",
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center"
	},
	imagegrid2:{
		display:"flex",
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center",
		marginBottom:5
	},
	close:{
		margin: 5,
	    position: "absolute",
	    bottom: 0,
	    left: 0,
	    width: 20,
	    height: 20,
	    backgroundColor: "green"
	},
	overlay:{
		width:70,
		height:70
	},
	guardimg:{
		width:70,
		height:70,
		borderRadius:10,
		marginLeft:2
	},
	before:{
	  justifyContent:'center',
	  alignItems: 'center',
	  flex:1
	},
	layer:{
		margin: 5,
		alignItems:"center",
		justifyContent:"center"
	},
	text:{
		fontSize: 16,
		color:"#0b0461"
	}
})
