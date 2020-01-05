import React, {Component} from 'react';
import {StyleSheet,
Dimensions,
TouchableOpacity,
TextInput,
View,
Image,
Picker,
KeyboardAvoidingView,ToastAndroid} from 'react-native';
let {height, width} = Dimensions.get('window');
import { Ionicons } from 'react-native-vector-icons';
import { AsyncStorage } from 'react-native';
import { Icon,Toast,Container,Button,Content,Root,Spinner,Footer, FooterTab,Text } from 'native-base';
import MyToast from './util/ToastService';
import publicIP from 'react-native-public-ip';
import { NetworkInfo } from "react-native-network-info";
import  NetInfo from '@react-native-community/netinfo';
import Modal from "react-native-modal";


const ADDRESSIP = "192.168.10.100";
export default class login extends Component {

  constructor(props){

    super(props)
    this.state = {
      username: '',
      password: '',
      ActivityLoader: false,
      anotherip: '',
      URL:'',
	  contype: '',
	  isModalVisible: false,
	  LocalIP: '',
	  location: '',
	  terminalLoc: '',
	  hasip:false
    }
  }
  
  configure = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  refresh = () => {
    AsyncStorage.clear();
    this.forceUpdate();
    this.setState({hasip: false,anotherip:'',location:''});
    alert('Cleared');

  };
    
  saveGlobal = () => {
	AsyncStorage.setItem("mykey", this.state.LocalIP);
	AsyncStorage.setItem("termKey", this.state.location);
    this.setState({ isModalVisible: !this.state.isModalVisible });
    this.setState({hasip: true,anotherip:this.state.LocalIP,terminalLoc:this.state.location});
    this.forceUpdate();
  };

  force = () =>{
  	this.forceUpdate();
  }
  
  
  IP = async() =>{
  	await NetworkInfo.getIPV4Address().then(ipp =>{
  		this.setState({anotherip: ADDRESSIP});
  		const api = 'http://'+this.state.anotherip+'/top-siv/api/login.php';
  		this.setState({URL: api});
  	});
  }

  componentDidMount(){
	NetInfo.fetch().then(state => {
	  this.setState({URL: state.ipa});
      console.log(state);	  
    });
	AsyncStorage.getItem("mykey").then((data) =>{
		if(data !== null){
			this.setState({anotherip: data,hasip: true});
			this.forceUpdate();
		}else{
			this.setState({hasip: false});
		}
		
		console.log(data);
	});
	AsyncStorage.getItem("termKey").then((data) =>{
		if(data !== null){
			this.setState({location: data});
			this.forceUpdate();
		}
	});
  }
  
 

  Login = () => {
    if(this.state.username !== ""){
      if(this.state.password !== ""){
        this.setState({ ActivityLoader: true}, () => {
          return fetch("http://"+this.state.anotherip+"/top-siv/api/login.php",{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.state.username,
              password: this.state.password
            })
          }).then((response) => response.json()).then( (responseJsonFromServer) =>{
            this.setState({ActivityLoader: false});
            if(responseJsonFromServer){
                  AsyncStorage.setItem("key", JSON.stringify(responseJsonFromServer));
                  this.props.navigation.navigate('App');
            }else{
				ToastAndroid.showWithGravity(
				  'Username/Password is incorrect',
				  ToastAndroid.SHORT,
				  ToastAndroid.CENTER,
				);
            }
          }).catch((error) =>{
			ToastAndroid.showWithGravity(
			  'Network Error. Make sure you are connected to the router',
			  ToastAndroid.SHORT,
			  ToastAndroid.CENTER,
			);
            this.setState({ActivityLoader: false})
          });
        });
      }else{
        ToastAndroid.showWithGravity(
		  'Enter your Password',
		  ToastAndroid.SHORT,
		  ToastAndroid.CENTER,
		);
      }
    }else{
		ToastAndroid.showWithGravity(
		  'Enter your Username',
		  ToastAndroid.SHORT,
		  ToastAndroid.CENTER,
		);
    }
  }

  render() {
       return (
		<Root>
		 <Container style={styles.container}>
         <KeyboardAvoidingView behavior={"height"}  style={{flexGrow:1,height:"100%"}}>   
            <Modal style={{backgroundColor: "#fff"}} isVisible={this.state.isModalVisible}>
			  <View style={{ flex: 1,justifyContent:"center",margin:10,borderRadius: 8, }}>
			    <View> 
					<Text style={{color:"#0b0461",fontSize:20,fontFamily:"Roboto",fontWeight:"bold",marginBottom:20}}>IP CONFIGURATION</Text>
					<Text style={{color:"#0b0461",fontSize:16,fontFamily:"Roboto"}}>
					  Open the Command Prompt of the Local Server. Enter 'ipconfig' and click enter. Note the IPV4 of the Local Machine 
                      and enter it in the form below.					  
					</Text>
				</View>
				<TextInput
	               style={styles.input}
	               placeholder="Server IP Address"
	               returnKeyType="next"
	               autoCapitalize="none"
	               autoCorrect={false}
	               onSubmitEditing = {() => this.LocalIP.focus()}
	               placeholderTextColor="#ccc"
	               name="LocalIP"
	               onChangeText={(TextInput) => this.setState({LocalIP: TextInput})}
               />
               <Picker 
               selectedValue={this.state.location}
               style={{height:50,width:"100%"}}
               onValueChange={(itemValue, itemIndex) => this.setState({location: itemValue})}>

  
               <Picker.Item label="Select Location" value=""/>
               <Picker.Item label="School Gate" value="School Gate"/>
               <Picker.Item label="Hostel" value="Hostel"/>
               <Picker.Item label="Class" value="Class"/>
               <Picker.Item label="Examination Hall" value="Examination Hall"/>
               <Picker.Item label="Test Hall" value="Test Hall"/>
               <Picker.Item label="Library" value="Library"/>
               <Picker.Item label="Clinic" value="Clinic"/>
               <Picker.Item label="Break-fast" value="Break-fast"/>
               <Picker.Item label="Lunch" value="Lunch"/>
               <Picker.Item label="Dinner" value="Dinner"/>
               <Picker.Item label="Bed" value="Bed"/>
               <Picker.Item label="Mosque" value="Mosque"/>
               <Picker.Item label="Church Service" value="Church Service"/>
               <Picker.Item label="School Bus" value="School Bus"/>
               <Picker.Item label="Other Event" value="Other Event"/>
               </Picker>
				<Button primary onPress={this.saveGlobal}>
				   <Text style={styles.footer3}>Save & Close </Text>
				</Button>
			  </View>
			</Modal>		 
           <Content >
           	  <View style={styles.imgContainer}>
           	    <Image style={styles.image} source={require('./image/loogo.jpg')} />
           	  </View>
		      <Text style={styles.appText}>STUDENT IDENTITY AND ATTENDANCE VERIFICATION SYSTEM</Text>
		   
		      <Text style={styles.appv}>Carrot Version 1.0 </Text>
			  <View>
              <TextInput
	               style={styles.input}
	               placeholder="Username"
	               returnKeyType="next"
	               autoCapitalize="none"
	               autoCorrect={false}
	               onSubmitEditing = {() => this.passwordInput.focus()}
	               placeholderTextColor="#ccc"
	               name="username"
	               onChangeText={(TextInput) => this.setState({username: TextInput})}
               />

               <TextInput
	               style={styles.input}
	               placeholder="Password"
	               returnKeyType="go"
	               autoCapitalize="none"
	               secureTextEntry
	               ref={(input) => this.passwordInput = input}
	               placeholderTextColor="#ccc"
	               name="password"
	               onChangeText={(TextInput) => this.setState({password: TextInput})}
               />

               <TouchableOpacity style={styles.buttonContainer} onPress={ this.Login }>
                {
                  this.state.ActivityLoader ?(
                  	<Text style={styles.buttonText}><Icon style={{fontSize: 23, color: 'white'}} name="time"/> PLEASE WAIT </Text>
                  	): <Text style={styles.buttonText}><Icon style={{fontSize: 23, color: 'white'}} name="paper-plane"/> LOG IN</Text>
                }
                  
               </TouchableOpacity>

			   <Text style={styles.footer}>Powered by TOP-TECH SOLUTIONS ( 08032287959 )</Text>
			   <Text style={styles.footer}>Network Info: {this.state.anotherip} </Text>
			   <Text style={styles.footer}> Installed Location: {this.state.location}</Text>
			   <View style={styles.footerView}>
			   {
			   	this.state.hasip ?(
                    <Button block style={{}} onPress={() =>{ this.refresh()} } transparent light><Text style={styles.dangerbtn}><Icon style={{fontSize: 18, color: 'red'}} name="ios-refresh-circle"/> Reset</Text></Button>
			   	):<Button block style={{}} onPress={() =>{ this.configure()} } transparent light><Text style={styles.footer2}><Icon style={{fontSize: 18, color: '#0b0461'}} name="md-cog"/> Settings</Text></Button> 
			   }
			   </View>
			</View>
           </Content>		   
         </KeyboardAvoidingView>
		 </Container>
		 </Root>
       );
   }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:"center",
		margin:10
	},
	input: {
		height: 50,
		backgroundColor: "#fff",
		color: "#0b0461",
		paddingHorizontal: 10,
		marginBottom: 15,
		fontSize: 18,
		paddingVertical: 5,
		borderBottomWidth:1,
		fontWeight:"bold",
		borderBottomColor: "#0b0461"
	},
	buttonContainer: {
		backgroundColor: "#0b0461",
		paddingVertical: 10,
		borderRadius: 8,
		marginBottom: 20
	},
	buttonText: {
		textAlign: 'center',
		color:"#FFF",
		fontWeight: '700',
		fontSize: 20
	},
	appText:{
		color: "#0b0461",
		fontSize: 20,
		fontWeight:"bold",
		textAlign:"center",
		margin:10,
		position:"relative",
		fontFamily:"Roboto"
	},
	appv:{
		color: "#333",
		fontSize: 13,
		fontWeight:"bold",
		textAlign:"center",
		margin:10,
		position:"relative",
		fontFamily:"Roboto"
	},
	terminal:{
		color: "#333",
		fontSize: 16,
		fontWeight:"bold",
		textAlign:"center",
		margin:5,
		position:"relative",
		fontFamily:"Roboto"
	},
	imgContainer:{
		alignItems:"center"
	},
	image:{
		resizeMode: "contain",
		width:200,
		height:200,
	},
	footer:{
		color: "#333",
		fontWeight: "bold",
		fontFamily:"Roboto",
		fontSize:16,
		textAlign:"center"
	},
	footer2:{
		color: "#0b0461",
		fontWeight: "bold",
		fontFamily:"Roboto",
		fontSize:18,
		textAlign:"center"
	},
	footerView:{
		color: "#0b0461",
		fontWeight: "bold",
		fontFamily:"Roboto",
		fontSize:18,
		textAlign:"center",
		marginTop:20
	},
	dangerbtn:{
		color: "red",
		fontWeight: "bold",
		fontFamily:"Roboto",
		fontSize:18,
		textAlign:"center"
	},
	footer3:{
		color: "#fff",
		fontWeight: "bold",
		fontFamily:"Roboto",
		fontSize:18,
		textAlign:"center"
	}
	
});

