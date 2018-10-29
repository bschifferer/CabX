import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddress:'', 
      fromAddress:'',
      buttonPress: false,
      data: [],
    };
    this.resolveAddress = this.resolveAddress.bind(this);
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

  render() {
	  // console.log("beginning")
   //  console.log(this.state.fromAddress)
   //  console.log(this.state.toAddress)
   //  console.log(this.state.buttonPress)

    if (this.state.buttonPress) {
      this.resolveAddress(this.state.toAddress, this.state.fromAddress)
    } 
    // console.log(this.state.data)
    
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
            // data = resolveAddress(this.state.toAddress, this.state.fromAddress)
            this.setState({ buttonPress: true});
          }}
        />


    		{
    			this.state.data.map((item, index) => (
    			<ListItem
    			key={index}
    			// leftIcon={ {name: item.ride_hailing_service }}
    			badge={{ value: "$" + item.estimated_cost_cents_min + '-' + item.estimated_cost_cents_max, textStyle: { color: 'orange' }, containerStyle: { marginTop: -20 } }}
    			title={ item.ride_hailing_service + ' ' + item.display_name }
    			subtitle={ "Estimated time:" + Math.floor(item.estimated_duration_seconds / 60) + ' minutes'}
    			hideChevron
    			/>
    		))
    		}

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
        backgroundColor: 'white',
        marginTop: 40,
    },
});
