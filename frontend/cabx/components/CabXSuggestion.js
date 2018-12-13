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
				<List contentContainerStyle={{ marginTop: 100}}>
				<FlatList
				data = { this.props.data }
				extraData = { this.props }
				keyExtractor={item => item.address.formattedAddress}
				renderItem = {({ item }) => (
					<ListItem
					onPress={() => console.log('a')} 
					title={ item.name }
					subtitle={  item.address.formattedAddress }
								avatar={"uber" == "uber" ? uberIcon : lyftIcon }  
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
