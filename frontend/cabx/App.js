import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';


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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddress:'', 
      fromAddress:''
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <SearchBar
        showLoading
        platform="ios"
        cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
        placeholder='From...' 
        onChangeText={(fromAddress) => console.log(fromAddress)} />
        
		    <SearchBar
        showLoading
        platform="ios"
        cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
        placeholder='To...' 
        onChangeText={(toAddress) => console.log(toAddress)} />

		{
			list.map((item) => (
			<ListItem
			key={item}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: 40,
    },
});
