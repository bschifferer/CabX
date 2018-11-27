import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-react-native-sdk';
import { Left, Right, Body, Title, Container, Button, Header, Content, Form, Item, Input, Label } from 'native-base';

export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state={
		};
	}

	componentDidMount() {
	}

	render() {
			return (
				<Container>
					<Header>
						<Left/>
							<Body>
								<Title>CabX</Title>
							</Body>
						<Right />
					</Header>
					<Content>
						<Form>
							<Item floatingLabel>
								<Label>Username</Label>
								<Input />
							</Item>
							<Item floatingLabel>
								<Label>Password</Label>
								<Input />
							</Item>
						</Form>
						<Button full bordered rounded dark style={{ margin: 20 }}>
							<Text>Login</Text>
						</Button>
						<Button full bordered rounded dark style={{ margin: 20, marginTop: 0 }}>
							<Text>Sign Up</Text>
						</Button>
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

