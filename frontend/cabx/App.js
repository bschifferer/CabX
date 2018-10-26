import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    return (
      <View style={styles.container}>
        <SearchBar
        showLoading
        platform="ios"
        cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
        placeholder='From...' 
        onChangeText={resolveOrigin} />
        
		    <SearchBar
        showLoading
        platform="ios"
        cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
        placeholder='To...' 
        onChangeText={resolveDestination} />

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

function resolveOrigin(address) {
	console.log("origin:", address);
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
