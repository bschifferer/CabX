import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-react-native-sdk';
import { Icon, Left, Right, Body, Title, Container, Button, Header, Content, Form, Item, Input, Label } from 'native-base';

export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			signUpPage: false,
			loginFailure: false,
			username: "",
			password: "",
		};
	}

	componentDidMount() {
	}

	verifyLogin = () => {
		console.log("user: " + this.state.username);
		console.log("password: " + this.state.password);
		if ( this.state.username == "admin" && this.state.password == "password") {
			this.props.login();
		} else {
			this.setState({ loginFailure: true });	
		}
	}

	render() {
			let loginFailure = this.state.loginFailure && !this.state.signUpPage;

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
							<Item floatingLabel error={ loginFailure }>
								<Label>Password</Label>
								<Input secureTextEntry onChangeText={(text) => { this.setState({ password: text })}}/>
								{ loginFailure && <Icon name='close-circle' /> }
							</Item>
							{ this.state.signUpPage && 
								<Item floatingLabel>
									<Label>Confirm Password</Label>
									<Input secureTextEntry />
								</Item>
							}
						</Form>
						<Button full bordered rounded dark style={{ margin: 20 }} onPress={ this.verifyLogin }>
							<Text>{this.state.signUpPage ? "Create Account" : "Login" }</Text>
						</Button>
						{ this.state.signUpPage ? 
							<Button transparent info full onPress={() => { this.setState({ signUpPage: false }) }}>
								<Text>I already have an account!</Text>
							</Button>
							: <Button full bordered rounded dark style={{ margin: 20, marginTop: 0 }} onPress={() => { this.setState({ signUpPage: true }) }}>
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

