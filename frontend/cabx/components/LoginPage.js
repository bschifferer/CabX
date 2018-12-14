import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, Left, Right, Body, Title, Container, Button, Header, Content, Form, Item, Input, Label } from 'native-base';

let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			signUpPage: false,
			forgotPWPage: false,
			loginFailure: false,
			createAccountFailure: false,
			createEmailFailure: false,
			username: '',
			password: '', 
			confirmPassword: '',
		};
	}

	toggleSignUpPage = () => {
		let signUpPage = this.state.signUpPage;
		this.setState({ signUpPage: !signUpPage, createAccountFailure: false, loginFailure: false, createEmailFailure: false, forgotPWPage: false});	
	}

	toggleforgotPWPage = () => {
		let forgotPWPage = this.state.forgotPWPage;
		this.setState({ forgotPWPage: !forgotPWPage, createAccountFailure: false, loginFailure: false, createEmailFailure: false, signUpPage: false});	
	}

	login = async (username, password) => {
		const res = await this.props.login(username, password);
		console.log(res.message);
		if (res.error) {
			this.setState({ loginFailure: true });
		} else {
			this.props.loadHistory();
		}
	}

	createAccount = async (username, password, confirmPassword) => {
		if (password != confirmPassword) {
			this.setState({ createAccountFailure: true });
		} else {
			if (!reg.test(username)) {
				this.setState({ createEmailFailure: true });
			} else {
				const res = await this.props.createAccount(username, password);
				console.log(res.message);
				this.toggleSignUpPage();
			}
		}
	}

	resetPW = async (username) => {
		if (!reg.test(username)) {
			this.setState({ createEmailFailure: true });
		} else {
			const res = await this.props.resetPW(username);
			console.log(res.message);
			this.toggleforgotPWPage();
		}
	}

	render() {
			let loginFailure = this.state.loginFailure && !this.state.signUpPage;
			let createAccountFailure = this.state.createAccountFailure && this.state.signUpPage;
			let createEmailFailure = this.state.createEmailFailure;

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
							<Item floatingLabel error={ loginFailure || createEmailFailure }>
								<Label>E-Mail</Label>
								<Input autoCapitalize='none' onChangeText={(text) => { this.setState({ username: text })}}/>
								{ (loginFailure || createEmailFailure) && <Icon name='close-circle' /> }
							</Item>
							{ !this.state.forgotPWPage &&
							<Item floatingLabel error={ loginFailure || createAccountFailure }>
								<Label>Password</Label>
								<Input secureTextEntry onChangeText={(text) => { this.setState({ password: text })}}/>
								{ (loginFailure || createAccountFailure) && <Icon name='close-circle' /> }
							</Item>
						    }
							{ this.state.signUpPage && 
								<Item floatingLabel error={ createAccountFailure }>
									<Label>Confirm Password</Label>
									<Input secureTextEntry onChangeText={(text) => { this.setState({ confirmPassword: text })}}/>
									{ (loginFailure || createAccountFailure) && <Icon name='close-circle' /> }
								</Item>
							}
						</Form>
						{ (!this.state.signUpPage && !this.state.forgotPWPage) &&
							[<Button key={1} full bordered rounded dark style={{ margin: 20 }} onPress={ () => this.login(this.state.username, this.state.password) }>
								<Text>{ "Login" }</Text>
							</Button>,
							<Button key={2} full bordered rounded dark style={{ margin: 20, marginTop: 0 }} onPress={ this.toggleSignUpPage }>
								<Text>Sign Up</Text>
							</Button>,
							<Button key={3} transparent info full onPress={ this.toggleforgotPWPage }>
								<Text>Forgot my password!</Text>
							</Button>] }
						{ (this.state.signUpPage) &&
							[<Button key={1} full bordered rounded dark style={{ margin: 20 }} 
								onPress={ () => { this.createAccount(this.state.username, this.state.password, this.state.confirmPassword) }}>
								<Text>{ "Create Account" }</Text>
							</Button>,
							<Button key={2} transparent info full onPress={ this.toggleSignUpPage }>
								<Text>I already have an account!</Text>
							</Button>]
						}
						{ (this.state.forgotPWPage) &&
							[<Button key={1} full bordered rounded dark style={{ margin: 20 }} 
								onPress={ () => { this.resetPW(this.state.username) }}>
								<Text>{ "Send a reset PW E-Mail" }</Text>
							</Button>,
							<Button key={2} transparent info full onPress={ this.toggleforgotPWPage }>
								<Text>Go back to login!</Text>
							</Button>]
						}
					</Content>
				</Container>
			);
	}
}

LoginPage.propTypes = {
	login: PropTypes.func.isRequired,
}

LoginPage.defaultProps = {
	login: () => {},
}

