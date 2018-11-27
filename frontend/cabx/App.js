import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from "native-base";
import PropTypes from 'prop-types';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-react-native-sdk';

import CabXHeader from './components/CabXHeader';
import CabXTabs from './components/CabXTabs';
import CabXList from './components/CabXList';
import LoginPage from './components/LoginPage.js';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			data: [], 
			isLoggedIn: false,
		};
	}

	loginHandler = () => {
		this.setState({ isLoggedIn: true });
	}

	searchHandler = (start, destination) => {
		fetch('http://ec2-18-215-158-47.compute-1.amazonaws.com:3000/findRides/', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"from": start,
				"to": destination
			}),
		}).then((response) => response.json())
			.then((responseJson) => {
				this.setState({ data: responseJson })
			})
			.catch((error) => {
				console.error(error)
			})
	}

	tabHandler = tab => {
		if (this.state.data === undefined) { return; }
			
		if (tab.i === 0) {
			this.setState( prevState => ({ data: prevState.data.sort((a, b) => a.estimated_cost_cents_max - b.estimated_cost_cents_max) }) );
		} else if (tab.i === 1) {
			this.setState( prevState => ({ data: prevState.data.sort((a, b) => a.estimated_duration_seconds - b.estimated_duration_seconds) }) );
		}
	}

	render() {
		const isLoggedIn = this.state.isLoggedIn;
		let display;
		if (isLoggedIn) {
			display = (<View style={styles.container}>
				<Container>
					<CabXHeader onSearch={this.searchHandler} />
					<CabXTabs onChangeTab={this.tabHandler} />
					<CabXList data={this.state.data} />
				</Container>
			</View>);
		} else {
			display = <LoginPage login={this.loginHandler} />;
		}
		
		return (
		<View style={styles.container}>
			{ display }
		</View>
		);
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		marginTop: 40,
	},
});

App.propTypes = {
	_isMounted: PropTypes.bool.isRequired,
}

App.defaultProps = {
	_isMounted: false
}
