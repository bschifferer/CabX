import React, { Component } from 'react';
import { View } from 'react-native';
import { Tabs, Tab, TabHeading, Icon } from 'native-base';
import PropTypes from 'prop-types';

export default class CabXTabs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<View style={{ height: 30}}>
				<Tabs onChangeTab={( tab ) => { this.props.onChangeTab(tab) }}>
					<Tab heading={ <TabHeading><Icon name="cash" /></TabHeading>}  />
					<Tab heading={ <TabHeading><Icon name="time" /></TabHeading>} />
				</Tabs>
			</View>);
    }
}

CabXTabs.propTypes = {
    onChangeTab: PropTypes.func.isRequired,
}

CabXTabs.defaultProps = {
    onChangeTab: () => {},
}
