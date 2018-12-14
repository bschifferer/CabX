import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, List } from 'react-native-elements';
import PropTypes from 'prop-types';

const placeIcon = 'https://stitch-statichosting-prod.s3.amazonaws.com/5bfc8450f68eb03613496e9c/place2.png';


export default class CabXList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<View>
				<List contentContainerStyle={{ marginTop: 100}}>
				<FlatList
				data = { this.props.data }
				extraData = { this.props }
				keyExtractor={item => (item.name || 'a').concat(' '.concat((item.address.formattedAddress || '')))}
				renderItem = {({ item }) => (
					<ListItem
					onPress={() => {this.props.updateAddress((item.name || '').concat(' '.concat((item.address.formattedAddress || ''))))}} 
					title={ item.name }
					subtitle={  item.address.formattedAddress }
								avatar={placeIcon}  
								subtitleNumberOfLines={2}
								hideChevron
								/>
							)}
						/>
				</List>
			</View>
		);
	}
}

CabXList.propTypes = {
    data: PropTypes.array.isRequired,
}

CabXList.defaultProps = {
    data: [],
}
