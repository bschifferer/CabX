import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem, List } from 'react-native-elements';
import PropTypes from 'prop-types';

const uberIcon = 'https://banner2.kisspng.com/20180715/fje/kisspng-computer-icons-user-clip-art-uber-logo-transparent-5b4b0088e1dc35.0486796815316419929251.jpg';
const lyftIcon = 'http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c525.png';

export default class CabXList extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<View>
				{ this.props.suggestion ? 
					<List contentContainerStyle={{ marginTop: 100}}>
					<FlatList
					data = { this.props.dataSuggestion }
					extraData = { this.props }
					keyExtractor={item => item.display_name + item.estimated_duration_seconds}
					renderItem = {({ item }) => (
						<ListItem
						title={ 'aa' }
						subtitle={ `ETA: ${Math.floor(item.estimated_duration_seconds / 60)} minutes\n\$${item.estimated_cost_cents_min}-${item.estimated_cost_cents_max}`}
									avatar={item.ride_hailing_service == "uber" ? uberIcon : lyftIcon }  
									subtitleNumberOfLines={2}
									hideChevron
									/>
								)}
							/>
					</List>
				: 
					<List contentContainerStyle={{ marginTop: 100}}>
					<FlatList
					data = { this.props.data }
					extraData = { this.props }
					keyExtractor={item => item.display_name + item.estimated_duration_seconds}
					renderItem = {({ item }) => (
						<ListItem
						title={ 'bb' }
						subtitle={ `ETA: ${Math.floor(item.estimated_duration_seconds / 60)} minutes\n\$${item.estimated_cost_cents_min}-${item.estimated_cost_cents_max}`}
									avatar={item.ride_hailing_service == "uber" ? uberIcon : lyftIcon }  
									subtitleNumberOfLines={2}
									hideChevron
									/>
								)}
							/>
					</List>
				}
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
