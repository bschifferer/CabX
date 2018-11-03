import React from 'react';
import { StyleSheet, Text, View, FlatList, AsyncStorage } from 'react-native';
import { Card, SearchBar, ListItem, List } from 'react-native-elements';
import { Container, Content, Tabs, Tab, TabHeading, Picker, Item, Input, Header, Title, Button, Icon, Left, Right, Body } from "native-base";
import PropTypes from 'prop-types';

const uberIcon = 'https://banner2.kisspng.com/20180715/fje/kisspng-computer-icons-user-clip-art-uber-logo-transparent-5b4b0088e1dc35.0486796815316419929251.jpg';
const lyftIcon = 'http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c525.png';

const price = 0;
const time = 1;

const userId = '8ba790f3-5acd-4a08-bc6a-97a36c124f29';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			toAddress:'', 
			fromAddress:'',
			buttonPress: false,
			data: [],
			sortBy: price,
			previousToAddresses: ['dummy'],
			previousFromAddresses: ['values'],
		};
		this.resolveAddress = this.resolveAddress.bind(this);
		this.swapAddress = this.swapAddress.bind(this);
		this.changeTab = this.changeTab.bind(this);
		this.getSortedData = this.getSortedData.bind(this);
		this.saveToAddress = this.saveToAddress.bind(this);
	}

	componentDidMount(){	
		this._isMounted = true;

		AsyncStorage.getItem('previousToAddresses').then( 
			value => { 
				if (this._isMounted) {	
					this.setState({ previousToAddresses: JSON.parse(value) })
				}
			}
		)

		AsyncStorage.getItem('previousFromAddresses').then( 
			value => { 
				if (this._isMounted) {	
					this.setState({ previousFromAddresses: JSON.parse(value) })
				}
			}	
		)
	}

	componentWillUnmount(){
		this._isMounted = false;
	}

	saveToAddress(toAddress) {
		var tempToAddresses = this.state.previousToAddresses;
		tempToAddresses.unshift(toAddress);
		if (tempToAddresses.length > 5) {
			tempToAddresses.pop();
		}
		AsyncStorage.setItem('previousToAddresses', JSON.stringify(tempToAddresses));
		this.setState({ previousToAddresses: tempToAddresses });
	}


	saveFromAddress(fromAddress) {
		var tempFromAddresses = this.state.previousFromAddresses;
		tempFromAddresses.unshift(fromAddress);
		if (tempFromAddresses.length > 5) {
			tempFromAddresses.pop();
		}
		AsyncStorage.setItem('previousFromAddresses', JSON.stringify(tempFromAddresses));
		this.setState({ previousFromAddresses: tempFromAddresses });
	}

	resolveAddress(fromAddress, toAddress) {
		fetch('http://ec2-18-215-158-47.compute-1.amazonaws.com:3000/findRides/', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"from": fromAddress,
				"to": toAddress
			}),
		}).then((response) => response.json())
			.then((responseJson) => {
				this.setState({ data: responseJson, buttonPress: false })
			})
			.catch((error) => {
				console.error(error)
			})
	}

	changeTab(tab) {
		if (this.state.data === undefined) { return; }
			
		if (tab.i === price) {
			this.setState({ sortBy: price });
		} else if (tab.i === time) {
			this.setState({ sortBy: time });
		}
	}

	getSortedData() {
		var data = [];
		if (this.state.sortBy === price) {
			data = this.state.data.sort((a, b) => a.estimated_cost_cents_max - b.estimated_cost_cents_max)
		} else if (this.state.sortBy === time) {
			data = this.state.data.sort((a, b) => a.estimated_duration_seconds - b.estimated_duration_seconds)
		} else {
			data = this.state.data;	
		}
		return data;
	}

	swapAddress() {
		var to = this.state.toAddress;
		var from = this.state.fromAddress;

		this.setState({ toAddress: from });
		this.setState({ fromAddress: to });
	}

	render() {
		if (this.state.buttonPress) {
			this.resolveAddress(this.state.toAddress, this.state.fromAddress)
		} 

		return (
			<View style={styles.container}>
				<Container>
					<View>
						<Header hasTabs searchBar rounded span>
							<View style={{ flex: 1, paddingLeft: 10}}>
								<Content>
									<Item>
										<Input placeholder="Choose starting point..." value={this.state.toAddress} onChangeText={(fromAddress) => this.setState({fromAddress})}/>
										<Picker
											mode="dropdown"
											iosIcon={<Icon name="ios-arrow-down-outline" />}
											onValueChange={ value => { this.setState({ toAddress: value }) }}
										>
											{this.state.previousToAddresses.map((item, index) => { return (<Picker.Item label={item} key={index} value={item}/>) })}                
										</Picker>
									</Item>
									<Item style={{ borderColor: 'transparent' }}>
										<Input placeholder="Choose destination..." value={this.state.fromAddress} onChangeText={(toAddress) => { this.setState({toAddress}) }}/>
										<Picker
											mode="dropdown"
											iosIcon={<Icon name="ios-arrow-down-outline" />}
											onValueChange={ value => { this.setState({ fromAddress: value }) }}
										>
											{this.state.previousFromAddresses.map((item, index) => { return (<Picker.Item label={item} key={index} value={item}/>) })}                
										</Picker>
									</Item>
								</Content>
							</View>
							<View style={{flexDirection: "column", marginTop: 15 }}>
								<Button transparent onPress={() => {this.swapAddress()}}>
									<Icon name="swap" />
								</Button>
								<Button transparent onPress={(state) => { 
									this.saveToAddress(this.state.toAddress);
									this.saveFromAddress(this.state.fromAddress);
									this.setState({ buttonPress: true }) 
								}}>
									<Icon name="search" />
								</Button>
							</View>
						</Header>
					</View>
					<View style={{ height: 30}}>
						<Tabs onChangeTab={( tab ) => { this.changeTab(tab) }}>
							<Tab heading={ <TabHeading><Icon name="cash" /></TabHeading>}  />
							<Tab heading={ <TabHeading><Icon name="time" /></TabHeading>} />
						</Tabs>
					</View>
					<View>
						<List contentContainerStyle={{ marginTop: 100}}>
						<FlatList
						data = { this.getSortedData() }
						extraData={this.state}
						keyExtractor={item => item.display_name + item.estimated_duration_seconds}
						renderItem = {({ item }) => (
							<ListItem
							title={ item.display_name }
							subtitle={ `ETA: ${Math.floor(item.estimated_duration_seconds / 60)} minutes\n\$${item.estimated_cost_cents_min}-${item.estimated_cost_cents_max}`}
										avatar={item.ride_hailing_service == "uber" ? uberIcon : lyftIcon }  
										subtitleNumberOfLines={2}
										hideChevron
										/>
									)}
								/>
						</List>
					</View>
			  </Container>
		  </View>
  );
  }
}

function resolveOrigin(address) {
  this.setState({fromAddress: address});
}

function resolveDestination(address) {
	console.log("destination:", address);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		marginTop: 40,
	},
});

App.propTypes = {
	_isMounted: PropTypes.bool.isRequired
}

App.defaultProps = {
	_isMounted: false
}
