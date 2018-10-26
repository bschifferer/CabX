import React, {Component} from 'react';
import { FlatList, ActivityIndicator, Button, View, Text, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';

class Address extends Component {
	constructor(props) {
		super(props);
		this.state = {
			toAddress:'',
			fromAddress:'',
			response: ''
		};
	}

	async componentWillMount() {
		await Font.loadAsync({ 'Material Icons': require('@expo/vector-icons/fonts/MaterialIcons.ttf') });
		this.setState({ fontsAreLoaded: true })
	}

	render() {
		return (
			<View style={{
				flex: 1,
					padding: 10,
					alignItems: 'center',
					justifyContent: 'space-evenly'
			}}>
			<TextInput
			style={{height: 40, fontSize: 20}}
			placeholder="To address"
			onChangeText={(toAddress) => this.setState({toAddress})}
			/>
			<SearchBar
  clearIcon={{ color: 'red' }}
  searchIcon={false} // You could have passed `null` too
  placeholder='Type Here...' />
			<TextInput
			style={{height: 40, fontSize: 20}}
			placeholder="From address"
			onChangeText={(fromAddress) => this.setState({fromAddress})}
			/>

			<Text style={{padding: 10, fontSize: 30}}>
			{this.state.toAddress}
			</Text>

			<Button
			title="Find me a car!"
			onPress={(state) => {
				this.props.navigation.navigate('Details', {
					toAddress: this.state.toAddress,
					fromAddress: this.state.fromAddress
				});
			}}
			/>
			</View>
		);
	}
}

class ListView extends Component {
	constructor(props){
		super(props);
		this.state ={ isLoading: true}
	}
	/**
  componentDidMount(){
	return fetch('/uber')
	  .then((response) => response.json())
	  .then((responseJson) => {

		this.setState({
		  isLoading: false,
		  dataSource: responseJson,
		}, function(){
			console.log(this.state.dataSource);
		});

	  })
	  .catch((error) =>{
		console.error(error);
	  });
  }
  */
	componentDidMount() {
		this.callApi()
			.then(res => this.setState({ response: res }))
			.catch(err => console.log(err));
	}

	callApi = async () => {
		console.log('before');
		const response = await fetch('/');
		const body = await response.json();
		console.log('pre-response: ', response);

		if (response.status !== 200) throw Error(body.message);

		return body;
	};

	render(){
		console.log("My response");
		console.log(this.state.response);

		const { params } = this.props.navigation.state;
		const toAddress = params ? params.toAddress : null;
		const fromAddress = params ? params.fromAddress : null;

		if(this.state.isLoading){
			return(
				<View style={{flex: 1, padding: 20}}>
				<ActivityIndicator/>
				</View>
			)
		}

		return(
			<View style={{flex: 1, paddingTop:20}}>
			<Text>{this.state.dataSource}</Text>
			<FlatList
			data={this.state.dataSource}
			renderItem={( { item } ) => <Text>{item.prices}</Text>} 
			/>
			</View>
		);
	}
}

//   render() {
//     const { params } = this.props.navigation.state;
//     const toAddress = params ? params.toAddress : null;
//     const fromAddress = params ? params.fromAddress : null;

//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>toAddress: {JSON.stringify(toAddress)}</Text>
//         <Text>fromAddress: {JSON.stringify(fromAddress)}</Text>
//         <Button
//           title="Go back"
//           onPress={() => this.props.navigation.goBack()}
//         />
//       </View>

//     );
//   }
// }

const RootStack = createStackNavigator(
	{
		Home: {
			screen: Address,
		},
		Details: {
			screen: ListView,
		},
	},
	{
		initialRouteName: 'Home',
	}
);

export default class App extends React.Component {
	render() {
		return <RootStack />;
	}
}
