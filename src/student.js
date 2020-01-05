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
Modal,
ImageBackground,
KeyboardAvoidingView,AsyncStorage} from 'react-native';
let {height, width} = Dimensions.get('window');
const DeviceWidth = Dimensions.get('window').width
import { Ionicons } from 'react-native-vector-icons';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Icon,Toast,Container,Button,Content,Root,List,Card,Spinner, CardItem, ListItem, Thumbnail, Header, Left, Body, Right, Title, Subtitle } from 'native-base';
const ADDRESSIP = "192.168.10.100";

export default class student extends Component {
    constructor(){
        super();
        this.state = {
            username: "",
            school_logo:"",
			school_name:"",
			student: [],
			loaded:false,
			selectedData: [],
			modalVisible: false,
			refresh:false,
			anotherip:''
        }
    }
		
	Refresh = () => {
     this.setState({refresh:true});
     this.getStudents();
    }
	selectedItem = (data) => {
		console.log(data);
		this.setState({selectedData: data});
		this.setModalVisible(true);
	}
	setModalVisible(visible) {
	   this.setState({modalVisible: visible});
	}
	
	getStudents = () => {
		return fetch( "http://"+this.state.anotherip+"/top-siv/api/students.php", {
		  method: "POST",
		  headers:{
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			action: 'fetch'
		  })
		}).then((response) => response.json()).then((responseJsonFromServer) => {
			if(responseJsonFromServer.message == 404){
				this.setState({
				  student: responseJsonFromServer.std,
				  loaded: false,
				  refresh:false
				});
			}else{
				this.setState({
				  student: responseJsonFromServer.std,
				  loaded: true,
				  refresh: false
				});
			}
				
			
			
		}).catch((error) =>{
			console.log(error);
		})
	  }
	
	componentDidMount(){

		AsyncStorage.getItem("mykey").then((data) =>{
			this.setState({anotherip: data});
			this.getStudents();
			console.log(data);
		});

		AsyncStorage.getItem("key").then((data) =>{
		  const val = JSON.parse(data);
		  this.setState({
			username: val.data.name,
			school_logo: val.sch.school_logo,
			school_name: val.sch.school_name
		  });
		});
	  }
	

    render(){
		let img = this.state.school_logo;
		let url = "http://"+this.state.anotherip+"/top-siv/";
		let path = url+img;
		
		
		const mg = this.state.selectedData.std_img;
		const immg = "http://"+this.state.anotherip+"/top-siv/"+mg;
	
		
		const gender = this.state.selectedData.gender;
		const phone = this.state.selectedData.phone;
		const address = this.state.selectedData.address;
					
        const stdList = this.state.student.map( (data) =>{
			const stdimg = data.std_img;
			const fpath = url+stdimg;
			const name = data.surname + " " + data.other_name;
			const stdclass = data.class;
			const cardnum = data.cardnum;
			const gender = data.gender;
			return(
				<List key={data.cardnum}>
					<ListItem thumbnail>
					  <Left>
						<Thumbnail square source={{ uri: fpath }} />
					  </Left>
					  <Body>
						<Text style={{color:"#0b0461",fontWeight:"bold",fontSize:15,textTransform:"uppercase"}}>{name}</Text>
						<Text style={{color:"#0b0461",fontWeight:"bold",fontSize:13}} note numberOfLines={1}>Class: {stdclass}</Text>
						<Text style={{color:"#0b0461",fontWeight:"bold",fontSize:13}} note numberOfLines={2}>Card Number: {cardnum}</Text>
						<Text style={{color:"#0b0461",fontWeight:"bold",fontSize:13}} note numberOfLines={2}>Gender: {gender}</Text>
					  </Body>
					  <Right>
						<Button onPress={() => {this.selectedItem(data);}} transparent>
						  <Text style={{fontWeight:"bold",color:"#0b0461",fontSize:18}}>VIEW</Text>
						</Button>
					  </Right>
				</ListItem>
					
				</List>
			)
		})
        return(
            <Container>
			<Header style={styles.header}>
			  <Left>
			    <Image style={styles.logo} source={{uri: path}}/>
			  </Left>
			  <Body>
				<Title style={styles.title}>{this.state.school_name}</Title>
				<Subtitle style={styles.subtitle}>Registered Students</Subtitle>
			  </Body>
			  <Right>
				<Button onPress={() => {this.Refresh();}} transparent>
				  <Icon name='refresh' style={{fontSize:20}} />
				</Button>
			  </Right>
			</Header>
			{
				this.state.refresh?(
					<View><Spinner color='blue' /></View>
				): null
			}
			
			
			{
				this.state.loaded?(
				<Content padder>
					{stdList}
				</Content>
				): <View style={styles.before}>
				     <Icon name="information-circle-outline" style={{fontSize:30,fontWeight:"bold",color:"#333"}} />
					 <Text style={{color: "#333",fontSize:18,marginTop:15}}> No registered students !</Text>
				   </View>
			}
			
			
			<Modal
				animationType="fade"
				transparent={false}
				visible={this.state.modalVisible}
				key={this.state.selectedData.id}
				onRequestClose={() => {
					alert('Modal has been closed.');
				}}>
				<Container>
				<Content contentContainerStyle={{flex: 1}}>
				 
					<View header style={styles.modalheader}>
					  <Text style={styles.modaltextbig}>{this.state.selectedData.surname} {this.state.selectedData.other_name}</Text>
					  <Text style={styles.modaltext}>{this.state.selectedData.class}</Text>
					  <Text style={styles.modaltext}>{this.state.selectedData.cardnum}</Text>
					</View>
					
					<View style={{justifyContent:"center",alignItems:"center"}}>
					  <Image style={{width:270,height:270,borderRadius:10}} source={{uri: immg}} />
					</View>
					<ListItem icon>
						<Left>
						  <Button style={{ backgroundColor: "#0b0461" }}>
							<Icon active name="school" />
						  </Button>
						</Left>
						<Body>
						  <Text>{this.state.selectedData.adm_no}</Text>
						</Body>
					</ListItem>
					<ListItem icon>
						<Left>
						  <Button style={{ backgroundColor: "#0b0461" }}>
							<Icon active name="phone-portrait" />
						  </Button>
						</Left>
						<Body>
						  <Text>{phone}</Text>
						</Body>
					</ListItem>
					<ListItem icon>
						<Left>
						  <Button style={{ backgroundColor: "#0b0461" }}>
							<Icon active name="globe" />
						  </Button>
						</Left>
						<Body>
						  <Text>{address}</Text>
						</Body>
					</ListItem>
					<ListItem icon>
						<Left>
						  <Button style={{ backgroundColor: "#0b0461" }}>
							<Icon active name="school" />
						  </Button>
						</Left>
						<Body>
						  <Text>{this.state.selectedData.sch_fees_status}</Text>
						</Body>
					</ListItem>
					
					
				    <Button full danger onPress={() => {this.setModalVisible(!this.state.modalVisible);}}>
					  <Text style={{fontWeight:"bold",fontSize:16,color:"white"}}>Close</Text>
				    </Button>
					
				  </Content>
				</Container>
			</Modal>
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
		flexDirection:"column"
	},
	modaltext:{
		fontSize:16,
		color: "#0b0461",
		fontWeight:"bold",
		marginBottom:10
	},
	modaltextbig:{
		fontSize:18,
		color: "#0b0461",
		fontWeight:"bold",
		marginBottom:10,
		marginTop:10,
		textTransform:"uppercase",
		textAlign:"center"
	},
	imagegrid:{
		display:"flex",
		flexDirection:"row",
		justifyContent:"center",
		alignItems:"center"
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
	}
	
})
