import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from "native-base";
import PropTypes from 'prop-types';
import { Stitch, UserPasswordCredential } from 'mongodb-stitch-react-native-sdk';

import CabXHeader from './components/CabXHeader';
import CabXTabs from './components/CabXTabs';
import CabXList from './components/CabXList';
import LoginPage from './components/LoginPage.js';
import CabXSuggestion from './components/CabXSuggestion';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			data: [],
			dataSuggestion: [], 
			isLoggedIn: false,
			logout: false,
			client: undefined,
			currentUserId: undefined,
			suggestionList: false,
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

	toggleSuggestion = () => {
		let suggestionList = this.state.suggestionList;
		setTimeout(() => {
      		this.setState({ suggestionList: !suggestionList, dataSuggestion: []});	
    	}, 200);
	}

	suggestion = (address) => {
		if(address.length >= 5) {
			fetch('http://ec2-18-215-158-47.compute-1.amazonaws.com:3000/suggestion/', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					"suggestion": address,
				}),
			}).then((response) => response.json())
				.then((responseJson) => {
					this.setState({ dataSuggestion: responseJson })
				})
				.catch((error) => {
					console.error(error)
				})
		} else {
			this.setState({ dataSuggestion: [] })
		}
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
					<CabXHeader logout={this._onPressLogout} onSearch={this.searchHandler} toggleSuggestion={this.toggleSuggestion} suggestion={this.suggestion} />
					{ this.state.suggestionList ?
						<CabXSuggestion data={this.state.dataSuggestion} />
					:
						[<CabXTabs key={1} onChangeTab={this.tabHandler} />,
						<CabXList key={2} data={this.state.data} suggestion={this.state.suggestionList} dataSuggestion={this.state.dataSuggestion} />]
					}
				</Container>
			);
		} else {
			display = <LoginPage login={this._onPressLogin} />;
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

