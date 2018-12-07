import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Drawer, Left, Body, Right, Title, Header, Content, Item, Picker, Button, Icon, Input } from 'native-base';
import PropTypes from 'prop-types';

export default class CabXHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destination: '',
            start: '',
            startHistory: [],
            destinationHistory: [],
			showSideBar: false,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.initData('startHistory');
        this.initData('destinationHistory');
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    initData = key => {
        AsyncStorage.getItem(key).then(value => {
            if (this._isMounted) {
                parsedValue = JSON.parse(value);
                if (parsedValue) { this.setState({
                        [key]: parsedValue }) }
            }
        })
    }

    saveData = (key, value) => {
        var tempHistory = this.state[key];
        tempHistory.unshift(value);
        if (tempHistory.length > 5) {
            tempHistory.pop();
        }
        AsyncStorage.setItem(key, JSON.stringify(tempHistory));
        this.setState({
            [key]: tempHistory
        });
    }

    render() {
        return (
            <View>
				<Header>
					<Left />
					<Body>
						<Title>CabX</Title>
					</Body>
					<Right>
						<Button transparent onPress={ this.props.logout }>
							<Icon name='person' />
						</Button>
					</Right>
				</Header>
				<Header hasTabs searchBar rounded span>
					<View style={{ flex: 1, paddingLeft: 10}}>
						<Content>
							<Item>
								<Input placeholder="Choose starting point..." value={this.state.start} onChangeText={(start) => this.setState({start})}/>
								<Picker
									mode="dropdown"
									iosIcon={<Icon name="ios-arrow-down-outline" />}
									onValueChange={ value => { this.setState({ start: value }) }}
								>
									{this.state.startHistory.map((item, index) => { return (<Picker.Item label={item} key={index} value={item}/>) })}                
								</Picker>
							</Item>
							<Item style={{ borderColor: 'transparent' }}>
								<Input placeholder="Choose destination..." value={this.state.destination} onChangeText={(destination) => { this.setState({destination}) }}/>
								<Picker
									mode="dropdown"
									iosIcon={<Icon name="ios-arrow-down-outline" />}
									onValueChange={ value => { this.setState({ destination: value }) }}
								>
									{this.state.destinationHistory.map((item, index) => { return (<Picker.Item label={item} key={index} value={item}/>) })}                
								</Picker>
							</Item>
						</Content>
					</View>
					<View style={{flexDirection: "column", marginTop: 15 }}>
						<Button transparent onPress={() => { 
							this.setState( prevState => ({ 
								destination: prevState.start, 
								start: prevState.destination 
						}))}
						}>
							<Icon name="swap" />
						</Button>
						<Button transparent onPress={(state) => { 
							this.saveData('startHistory', this.state.start);
							this.saveData('destinationHistory', this.state.destination);
							this.setState({ buttonPress: true })
							this.props.onSearch(this.state.start, this.state.destination);

						}}>
							<Icon name="search" />
						</Button>
					</View>
				</Header>
			</View>
        );
    }
}

CabXHeader.propTypes = {
    _isMounted: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
}

CabXHeader.defaultProps = {
    _isMounted: false,
    onSearch: () => {},
	logout: () => {},
}
