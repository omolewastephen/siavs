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
KeyboardAvoidingView} from 'react-native';
let {height, width} = Dimensions.get('window');
const DeviceWidth = Dimensions.get('window').width
import { Ionicons } from 'react-native-vector-icons';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { Icon,Toast,Container,Button,Content,Root, Header, Left, Body, Right, Title, Subtitle } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
const ADDRESSIP = "192.168.10.100";
export default class main extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            school_logo:"",
			school_name:"",
			anotherip:'',
			location:''
        }
    }
	
	logout = async() =>{
	   this.props.navigation.navigate('Auth');
       //AsyncStorage.clear();
	}
	
	checking = () =>{
		this.props.navigation.navigate('CheckingScreen');
	}
	checkout = () =>{
		this.props.navigation.navigate('CheckoutScreen');
	}
	student =() =>{
		this.props.navigation.navigate('StudentScreen');
	}
	
	componentDidMount(){

		AsyncStorage.getItem("key").then((data) =>{
		  const val = JSON.parse(data);
		  this.setState({
			username: val.data.name,
			school_logo: val.sch.school_logo,
			school_name: val.sch.school_name
		  });
		});
		AsyncStorage.getItem("mykey").then((data) =>{
			this.setState({anotherip: data});
		});
		AsyncStorage.getItem("termKey").then((data) =>{
			this.setState({location: data});
		});
		
	  }


    render(){
		let img = this.state.school_logo;
		let url = "http://"+this.state.anotherip+"/top-siv/";
		let path = url+img;
        return(
            <Container>
			<Header style={styles.header}>
			  <Left>
			    <Image style={styles.logo2} source={{uri: path}}/>
			  </Left>
			  <Body>
				<Title style={styles.title}>{this.state.school_name}</Title>
				<Subtitle style={styles.subtitle}>Main Menu</Subtitle>
			  </Body>
			  <Right />
			</Header>
			<Content padder>
				<View style={{height: 40, padding: 10,marginBottom:10,marginLeft:10,marginRight:10,display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
					<Text style={{fontSize:18,color:"#0b0461",fontWeight:"bold"}}><Icon style={{fontSize: 18, color: '#0b0461'}} name="ios-contact"/> Administrator</Text>
					<Text style={{color: "#0b0461",fontWeight:"bold",fontSize:18}}><Icon style={{fontSize: 18, color: '#0b0461'}} name="ios-pin"/> {this.state.location}</Text>
                </View>
				<Grid style={styles.gridContainer}>
					<Row style={styles.row}>
						<Col style={styles.first} onPress={() =>{ this.checking()} }>
							<Image style={styles.logo} source={require('./icon/resume.png')}/>
							<Text style={styles.menuText}>Arrival</Text>
						</Col>
						<Col style={styles.second} onPress={() =>{ this.checkout()}}>
							<Image style={styles.logo} source={require('./icon/departure.png')}/>
							<Text style={styles.menuText}>Departure</Text>
						</Col>
					</Row>
					<Row style={styles.row}>
						<Col style={styles.first} onPress={() =>{ this.student()}}>
							<Image style={styles.logo} source={require('./icon/user.png')}/>
							<Text style={styles.menuText}>Students</Text>
						</Col>
						<Col style={styles.second} onPress={() => {this.logout()}}>
							<Image style={styles.logo} source={require('./icon/logout.png')}/>
							<Text style={styles.menuText}>Log Out</Text>
						</Col>
					</Row>
				</Grid>
				
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
		width: 60,
		height:60,
		borderRadius:30
	},
	logo2:{
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
	gridContainer:{
		marginTop:20,
		alignItems:"center",
		marginLeft:10,
		marginRight:10
	},
	first:{
		width:150,
		height:150,
		marginRight:4,
		shadowColor: '#444',
		shadowOffset: {
		  width: 0,
		  height: 60
		},
		shadowRadius: 5,
		shadowOpacity: 1.0,
		alignItems:"center",
		elevation:5,
		borderRadius:8,
		backgroundColor:"#fff",
		justifyContent: "center"
	},
	second:{
		width:150,
		height:150,
		shadowColor: '#444',
		shadowOffset: {
		  width: 0,
		  height: 60
		},
		shadowRadius: 5,
		shadowOpacity: 1.0,
		alignItems:"center",
		elevation:5,
		borderRadius:8,
		backgroundColor:"#fff",
		justifyContent: "center"
	},
	icon:{
		color:"#0b0461",
		fontSize:30
	},
	icon_red:{
		color:"red",
		fontSize:30
	},
	menuText:{
		color:"#0b0461",
		fontSize:20,
		fontWeight:"bold",
		textTransform:"uppercase"
	},
	row:{
		marginBottom:5
	}
	
	
})