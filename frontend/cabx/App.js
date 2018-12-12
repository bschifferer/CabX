import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from "native-base";
import PropTypes from 'prop-types';
import { Stitch, UserPasswordCredential, UserPasswordAuthProviderClient, AuthProviderClientFactory, ServiceClientFactory, NamedAuthProviderClientFactory} from 'mongodb-stitch-react-native-sdk';

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
			logout: false,
			client: undefined,
			currentUserId: undefined,
		};
	}

	componentDidMount() {
		this._loadClient();
	}

	_loadClient = () => {
		Stitch.initializeDefaultAppClient('cabxbackend-nddiu').then(client => {
			this.setState({ client });

			if(client.auth.isLoggedIn) {
				this.setState({ currentUserId: client.auth.user.id, isLoggedIn: true });
			}
		});
	}

	_onPressLogin = (username, password) => {
		return this.state.client.auth.loginWithCredential(new UserPasswordCredential(username, password)).then(user => {
			const msg = `Successfully logged in as user ${user.id}`;
			this.setState({ currentUserId: user.id })
			this.setState({ isLoggedIn: true })
			return { message: msg }
		}).catch(err => {
			const msg = `Failed to log in anonymously: ${err}`;
			this.setState({ currentUserId: undefined })
			return { message: msg, error : true }
		});
	}

	_onPressCreateAccount = (username, password) => {
		console.log(this.state.client.auth.getProviderClient);
		console.log(UserPasswordAuthProviderClient.factory);
		console.log(Stitch.UserPasswordAuthProviderClient);
		console.log(this.state.client.auth.getProviderClient(UserPasswordAuthProviderClient.factory));
		return this.state.client.auth.getProviderClient(UserPasswordAuthProviderClient.factory).registerWithEmail(username, password)
		.then(() => {
			const msg = 'Successfully sent account confirmation email!';
			return { message: msg }
		}).catch(err => {
			const msg = "Error registering new user - contact administrator";
			return { message: msg, error : true }
		});
	}

	_onPressLogout = () => {
		this.state.client.auth.logout().then(user => {
			console.log(`Successfully logged out`);
			this.setState({ currentUserId: undefined })
			this.setState({ isLoggedIn: false });
		}).catch(err => {
			console.log(`Failed to log out: ${err}`);
			this.setState({ currentUserId: undefined })
		});
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
			display = (
				<Container>
					<CabXHeader logout={this._onPressLogout} onSearch={this.searchHandler} />
					<CabXTabs onChangeTab={this.tabHandler} />
					<CabXList data={this.state.data} />
				</Container>
			);
		} else {
			display = <LoginPage login={this._onPressLogin} createAccount={this._onPressCreateAccount} />;
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
		paddingTop: 40,
	},
});

