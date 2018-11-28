import React, { Component } from 'react';
import { StyleSheet, View, FlatList, AsyncStorage } from 'react-native';
import { Header, Content, Item, Picker, Container, Button, Input, Form, Title, Label, Icon, InputGroup } from 'native-base';
import { ListItem, List } from 'react-native-elements';
import PropTypes from 'prop-types';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class CabXInput extends Component {
	constructor(props) {
        super(props);
        this.state = {
            destination: '',
            start: '',
            startHistory: [],
            destinationHistory: [],
        };
    }

    componentDidMount() {
		console.log("COMDIDMOUNT");
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
		console.log("SAVEDATA");
        var tempHistory = this.state[key];
		tempHistory = removeValue(value, tempHistory);
        tempHistory.unshift(value);
        if (tempHistory.length > 5) {
            tempHistory.pop();
        }
        AsyncStorage.setItem(key, JSON.stringify(tempHistory));
        this.setState({
            [key]: tempHistory
        });
    }

	removeValue = (value, list) => {
		console.log("REACHED");
		for (val i = 0; i < list.length; i++) {
			if (list[i] == value) {
				list.splice(i, 1);
			}
		}	
		console.log(list);
	}

    render() {
        return (
        	<View style={styles.container}>
		        <Form>​
		            <Item floatingLabel style={styles.items}>
		            	<Label style={styles.labels}>{'PICKUP LOCATION'}</Label>

		                <Input style={styles.inputs} value={this.state.start} onChangeText={(start) => this.setState({start})} />
                        <Icon active style={styles.icons} name="swap" />
		            </Item>

		            <Item floatingLabel style={styles.items}>
		            	<Label style={styles.labels}>{'DESTINATION'}</Label>
						<Input style={styles.inputs} value={this.state.destination} onChangeText={(destination) => { this.setState({destination}) }}/>
		            	<Button transparent style={styles.buttons} onPress={(state) => { 
                    this.saveData('startHistory', this.state.start);
                    this.saveData('destinationHistory', this.state.destination);
                    this.setState({ buttonPress: true })
                    this.props.onSearch(this.state.start, this.state.destination);

                }}>
                    <Icon style={styles.icons} name="search" />
                </Button>
		            </Item>
		        </Form>
		    </View>
        );
    }
	// render() {
	// 	return(
	// 		<View>
	// 			<Form>
 //                <Item floatingLabel style={styles.items}>
 //                    <Label style={styles.labels}>{'PICKUP LOCATION'}</Label>
	// 				<Input style={styles.inputs} value={this.state.start} onChangeText={(start) => this.setState({start})}/>
	// 				<Picker
	// 					mode="dropdown"
	// 					iosIcon={<Icon style={{ color: 'black' }} name="caret-down" />}
	// 					onValueChange={ value => { this.setState({ start: value }) }}
	// 				>
	// 					{this.state.startHistory.map((item, index) => { return (<Picker.Item label={item} key={index} value={item}/>) })}                
	// 				</Picker>
 //                    <Button transparent style={styles.buttons} onPress={() => { 
 //                    this.setState( prevState => ({ 
 //                        destination: prevState.start, 
 //                        start: prevState.destination 
 //                    }))}
 //                    }>
 //                        <Icon style={styles.icons} name="exchange" />
 //                    </Button>
	// 			</Item>
	// 			<Item floatingLabel style={styles.items}>
 //                    <Label style={styles.labels}>{'DESTINATION'}</Label>
	// 				<Input style={styles.inputs} value={this.state.destination} onChangeText={(destination) => { this.setState({destination}) }}/>
	// 				<Picker
	// 					mode="dropdown"
	// 					iosIcon={<Icon style={{ color: 'black' }} name="caret-down" />}
	// 					onValueChange={ value => { this.setState({ destination: value }) }}
	// 				>
	// 					{this.state.destinationHistory.map((item, index) => { return (<Picker.Item label={item} key={index} value={item}/>) })}                
	// 				</Picker>
	// 			</Item>
                
 //                <Button transparent style={styles.buttons} onPress={(state) => { 
 //                    this.saveData('startHistory', this.state.start);
 //                    this.saveData('destinationHistory', this.state.destination);
 //                    this.setState({ buttonPress: true })
 //                    this.props.onSearch(this.state.start, this.state.destination);

 //                }}>
 //                    <Icon style={styles.icons} name="search" />
 //                </Button>
 //                </Form>
	// 		</View>
	// 	);
	// }
}

CabXInput.propTypes = {
    _isMounted: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
}

CabXInput.defaultProps = {
    _isMounted: false,
    onSearch: () => {},
}

const styles = StyleSheet.create({
    container: {
        height: 105,
    },
    inputs: {
        height: 30,
    },
    items: { 
        borderColor: '#EEEEEE',
        height: 30,
        marginRight: 6,
    },
    icons: { 
        color: 'black', 
        fontSize: 20,
    },
    buttons: {
        height: 30,
        marginTop: 6,
        padding: 6,
    },
    labels: { 
        fontSize: 12,
        alignContent: 'center',
       	top: 10,
    }
});
