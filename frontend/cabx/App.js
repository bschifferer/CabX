import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
		<SearchBar
		showLoading
		platform="ios"
		cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
		placeholder='From...' />

		<SearchBar
		showLoading
		platform="ios"
		cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
		placeholder='To...' />
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
