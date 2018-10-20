import React, {Component} from 'react';
import { FlatList, ActivityIndicator, Button, View, Text, TextInput } from 'react-native';
import { createStackNavigator } from 'react-navigation';

class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddress:'',
      fromAddress:''
    };
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

  componentDidMount(){
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.movies,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render(){
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
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
          keyExtractor={({id}, index) => id}
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
