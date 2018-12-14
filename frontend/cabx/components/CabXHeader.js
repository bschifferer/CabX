import React, { Component } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Drawer, Left, Body, Right, Title, Header, Content, Item, Picker, Button, Icon, Input } from 'native-base';
import PropTypes from 'prop-types';
import AutoSuggest from 'react-native-autosuggest'
import CabXSuggestion from './CabXSuggestion';

export default class CabXHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destination: '',
            start: '',
            startHistory: [],
            destinationHistory: [],
			showSideBar: false,
			dataSuggestion: [],
			suggestionListHeader: false,
			inputFieldFocus: '',
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

	toggleSuggestionHeader = (inputFieldFocus, status) => {
		this.props.toggleSuggestion(status);
		this.setState({ suggestionListHeader: status, dataSuggestion: [], inputFieldFocus: inputFieldFocus});
	}

	updateAddress = (address) => {
		if (this.state.inputFiledFocus === 'start') {
			this.setState({start: address});
			this.toggleSuggestionHeader('None', false);
		}
		if (this.state.inputFiledFocus === 'destination') {
			this.setState({destination: address});
			this.toggleSuggestionHeader('None', false);
		}
	}

    render() {
        return (
            <View key={1}>
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
								<Input onFocus={() => {this.toggleSuggestionHeader('start', true)}} onEndEditing={() => {}} placeholder="Choose starting point..." value={this.state.start} onChangeText={(start) => {this.setState({start}); this.suggestion(start)}}/>
								<Picker
									mode="dropdown"
									iosIcon={<Icon name="ios-arrow-down-outline" />}
									onValueChange={ value => { this.setState({ start: value }) }}
								>
									{this.state.startHistory.map((item, index) => { return (<Picker.Item label={item} key={index} value={item}/>) })}                
								</Picker>
							</Item>
							<Item style={{ borderColor: 'transparent' }}>
								<Input onFocus={() => {this.toggleSuggestionHeader('destination', true)}} placeholder="Choose destination..." value={this.state.destination} onChangeText={(destination) => { this.setState({destination}); this.suggestion(destination) }}/>
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
							this.toggleSuggestionHeader('None', false);

						}}>
							<Icon name="search" />
						</Button>
					</View>
				</Header>
				{ this.state.suggestionListHeader &&
				<CabXSuggestion key={2} data={this.state.dataSuggestion} start={this.state.start} updateAddress={this.updateAddress}/>
				}
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
