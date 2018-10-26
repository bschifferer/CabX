import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddress:'', 
      fromAddress:''
    };
  }
  render() {
	data = getRideData();
  console.log(this.state.fromAddress);
    return (
      <View style={styles.container}>
        <SearchBar
        showLoading
        platform="ios"
        cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
        placeholder='From...' 
        onChangeText={(fromAddress) => this.setState({fromAddress})} />
        
		    <SearchBar
        showLoading
        platform="ios"
        cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
        placeholder='To...' 
        onChangeText={(toAddress) => this.setState({toAddress})} />

        <Button
          title="Find me a car!"
          onPress={(state) => {
            resolveAddress(this.state.toAddress, this.state.fromAddress)
          }}
        />

		{
			data.map((item, index) => (
			<ListItem
			key={index}
			leftIcon={ {name: item.icon }}
			badge={{ value: "$" + item.price, textStyle: { color: 'orange' }, containerStyle: { marginTop: -20 } }}
			title={item.type}
			subtitle={item.eta}
			hideChevron
			/>
		))
		}

      </View>
    );
  }
}



function resolveAddress(fromAddress, toAddress) {
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
      console.log(responseJson)
    })
    .catch((error) => {
      console.error(error)
    })

  // console.log("origin:", address);
}

function resolveOrigin(address) {
  this.setState({fromAddress: address});
}

function resolveDestination(address) {
	console.log("destination:", address);
}

function getRideData() {
	const list = [
		{
			type: 'Uber Pool',
			price: 2.0,
			eta: '4:25pm',
			service: 'Uber',
			icon: 'refresh',
		},
		{
			type: 'Uber X',
			price: 5.0,
			eta: '4:30pm',
			service: 'Uber',
			icon: 'refresh',
		},
		{
			type: 'Uber Pool',
			price: 1.05,
			eta: '4:25pm',
			service: 'Uber',
			icon: 'refresh',
		},
		{
			type: 'Uber X',
			price: 50.0,
			eta: '4:30pm',
			service: 'Uber',
			icon: 'refresh',
		}
	]
	return list;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 40,
    },
});
