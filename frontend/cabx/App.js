import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Container } from "native-base";
import PropTypes from 'prop-types';
import { Stitch, UserPasswordCredential, UserPasswordAuthProviderClient, AuthProviderClientFactory, ServiceClientFactory, NamedAuthProviderClientFactory, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk';

import CabXHeader from './components/CabXHeader';
import CabXTabs from './components/CabXTabs';
import CabXList from './components/CabXList';
import LoginPage from './components/LoginPage.js';
import CabXSuggestion from './components/CabXSuggestion';
import GetLocation from './components/getLocation.js';

const DB = 'cabx';
const COLLECTION_USER = 'users_v2';

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			data: [],
			isLoggedIn: false,
			logout: false,
			client: undefined,
			currentUserId: undefined,
			suggestionList: false,
			startHistory: [],
			destinationHistory: [],
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
				this.loadHistory();
			}
		});
	}

	loadHistory = () => {
		this.state.client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db(DB).collection(COLLECTION_USER).find({}, {}).asArray().then(
			(response) =>  {
				if(response.length > 0) {
					if (response[0].hasOwnProperty('history')) {
						if (response[0].history.hasOwnProperty('startHistory')) {
							this.setState({startHistory: response[0].history.startHistory});
						}
						if (response[0].history.hasOwnProperty('destinationHistory')) {
							this.setState({destinationHistory: response[0].history.destinationHistory});
						}
					}
				}
			}
		)
	}

	updateHistory = (key, value) => {
        var tempHistory = this.state[key];
        var indValue = tempHistory.indexOf(value);
        if (indValue > -1) {
        	tempHistory.splice(indValue, 1);
        }
        tempHistory.unshift(value);
        if (tempHistory.length > 5) {
            tempHistory.pop();
        }
        return(tempHistory)
    }

	saveHistory = (start, destination) => {
		this.setState({startHistory: this.updateHistory('startHistory', start)});
		this.setState({destinationHistory: this.updateHistory('destinationHistory', destination)});
		this.state.client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db(DB).collection(COLLECTION_USER).find({}, {}).asArray().then(
			(response) => {
				if (response.length > 0) {
					response[0]['history'] = {};
					response[0]['history']['startHistory'] = this.state.startHistory;
					response[0]['history']['destinationHistory'] = this.state.destinationHistory;
					this.state.client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db(DB).collection(COLLECTION_USER).updateOne({userId: this.state.currentUserId}, response[0]);
				} else {
					doc = {
						userId: this.state.currentUserId,
						history: {
							startHistory: this.state.startHistory,
							destinationHistory: this.state.destinationHistory
						} 
					}
					this.state.client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas").db(DB).collection(COLLECTION_USER).insertOne(doc);
				}
			}
		);
	}

	_onPressLogin = (username, password) => {
		return this.state.client.auth.loginWithCredential(new UserPasswordCredential(username, password)).then(user => {
			const msg = `Successfully logged in as user ${user.id}`;
			this.setState({ currentUserId: user.id });
			this.setState({ isLoggedIn: true });
			this.toggleSuggestion(false);
			return { message: msg }
		}).catch(err => {
			const msg = `Failed to log in anonymously: ${err}`;
			this.setState({ currentUserId: undefined })
			return { message: msg, error : true }
		});
	}

	_onPressCreateAccount = (username, password) => {
		return this.state.client.auth.getProviderClient(UserPasswordAuthProviderClient.factory).registerWithEmail(username, password)
		.then(() => {
			const msg = 'Successfully sent account confirmation email!';
			return { message: msg }
		}).catch(err => {
			const msg = "Error registering new user - contact administrator";
			return { message: msg, error : true }
		});
	}

	_onPressResetPW = (username) => {
		return this.state.client.auth.getProviderClient(UserPasswordAuthProviderClient.factory).sendResetPasswordEmail(username)
		.then(() => {
			const msg = 'Successfully sent reset PW email!';
			return { message: msg }
		}).catch(err => {
			const msg = "Error reset PW - contact administrator";
			return { message: msg, error : true }
		});
	}

	_onPressLogout = () => {
		this.state.client.auth.logout().then(user => {
			console.log(`Successfully logged out`);
			this.setState({ currentUserId: undefined })
			this.setState({ isLoggedIn: false, startHistory: [], destinationHistory:[]});
			this.toggleSuggestion(false);
		}).catch(err => {
			console.log(`Failed to log out: ${err}`);
			this.setState({ currentUserId: undefined, startHistory: [], destinationHistory:[]});
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
				if (responseJson.hasOwnProperty('error')) {
					this.showError(responseJson.error);
				} else {
					this.setState({ data: responseJson });
					this.saveHistory(start, destination);
				}
			})
			.catch((error) => {
				this.showError(error);
				console.error(error);
			})
	}

	showError = (msg) => {
		Alert.alert(
					'Error',
					msg,
					[
					{text: 'OK'},
					],
					{ cancelable: false }
					);

	}

	toggleSuggestion = (status) => {
		this.setState({ suggestionList: status});
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
					<CabXHeader logout={this._onPressLogout} onSearch={this.searchHandler} toggleSuggestion={this.toggleSuggestion} loadHistory={this.loadClientData} startHistory={this.state.startHistory} destinationHistory={this.state.destinationHistory}/>
					{ !this.state.suggestionList &&
						[<CabXTabs key={1} onChangeTab={this.tabHandler} />,
						<CabXList key={2} data={this.state.data} />]
					}
					<GetLocation />
				</Container>
			);
		} else {
			display = <LoginPage login={this._onPressLogin} createAccount={this._onPressCreateAccount} resetPW={this._onPressResetPW} loadHistory={this.loadHistory}/>;
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

