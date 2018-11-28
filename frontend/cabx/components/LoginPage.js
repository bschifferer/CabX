import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Stitch, UserPasswordCredential } from 'mongodb-stitch-react-native-sdk';
import { Icon, Left, Right, Body, Title, Container, Button, Header, Content, Form, Item, Input, Label } from 'native-base';


export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			client: undefined,
			currentUserId: undefined,
			signUpPage: false,
			loginFailure: false,
			createAccountFailure: false,
			username: '',
			password: '', 
			confirmPassword: '',
		};
	}

	componentDidMount() {
		this._loadClient();
	}

	_loadClient = () => {
		Stitch.initializeDefaultAppClient('cabxbackend-nddiu').then(client => {
			this.setState({ client });

			if(client.auth.isLoggedIn) {
				this.setState({ currentUserId: client.auth.user.id })
			}
		});
	}

	_onPressLogin = () => {
		this.state.client.auth.loginWithCredential(new UserPasswordCredential(this.state.username, this.state.password)).then(user => {
			console.log(`Successfully logged in as user ${user.id}`);
			this.setState({ currentUserId: user.id })
			this.props.login();
		}).catch(err => {
			console.log(`Failed to log in anonymously: ${err}`);
			this.setState({ currentUserId: undefined })
			this.setState({ loginFailure: true });	
		});
	}

	toggleSignUpPage = () => {
		let signUpPage = this.state.signUpPage;
		this.setState({ signUpPage: !signUpPage, createAccountFailure: false, loginFailure: false });	
	}

	render() {
			let loginFailure = this.state.loginFailure && !this.state.signUpPage;
			let createAccountFailure = this.state.createAccountFailure && this.state.signUpPage;

			return (
				<Container>
					<Header>
						<Left/>
							<Body>
								<Title>CabX</Title>
							</Body>
						<Right />
					</Header>
					<Content style={{ marginRight: 5 }}>
						<Form>
							<Item floatingLabel error={ loginFailure }>
								<Label>Username</Label>
								<Input autoCapitalize='none' onChangeText={(text) => { this.setState({ username: text })}}/>
								{ loginFailure && <Icon name='close-circle' /> }
							</Item>
							<Item floatingLabel error={ loginFailure || createAccountFailure }>
								<Label>Password</Label>
								<Input secureTextEntry onChangeText={(text) => { this.setState({ password: text })}}/>
								{ (loginFailure || createAccountFailure) && <Icon name='close-circle' /> }
							</Item>
							{ this.state.signUpPage && 
								<Item floatingLabel error={ createAccountFailure }>
									<Label>Confirm Password</Label>
									<Input secureTextEntry onChangeText={(text) => { this.setState({ password: text })}}/>
									{ (loginFailure || createAccountFailure) && <Icon name='close-circle' /> }
								</Item>
							}
						</Form>
						{ this.state.signUpPage ?
							<Button full bordered rounded dark style={{ margin: 20 }} 
								onPress={ () => { this.setState({ createAccountFailure: (this.state.confirmPassword != this.state.password) }) }}>
								<Text>{ "Create Account" }</Text>
							</Button>
						: 	<Button full bordered rounded dark style={{ margin: 20 }} onPress={ this._onPressLogin }>
								<Text>{ "Login" }</Text>
							</Button> }
						{ this.state.signUpPage ? 
							<Button transparent info full onPress={ this.toggleSignUpPage }>
								<Text>I already have an account!</Text>
							</Button>
							: <Button full bordered rounded dark style={{ margin: 20, marginTop: 0 }} onPress={ this.toggleSignUpPage }>
								<Text>Sign Up</Text>
							</Button> }
					</Content>
				</Container>
			);
	}
}

LoginPage.propTypes = {
	login: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
	login: () => {}
}

