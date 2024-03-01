import { Text, View} from 'react-native';
import {Divider, IconButton} from "react-native-paper";



export default function Navigation({ navigation, activeButton }) {
    const buttonDetails = [
        { icon: 'magnify', route: 'HomeScreen', label: 'Search' },
        { icon: 'plus-circle-outline', route: 'AddRideCheck', label: 'Publish' },
        { icon: 'magnify', route: 'RideHistory', label: 'Your Rides' },
        { icon: 'chat-outline', route: 'Notifications', label: 'Inbox' },
        { icon: 'account-circle-outline', route: 'Profile', label: 'Profile', params: { IsUserOrder: true, navigation: navigation } }
    ];

    const buttonStyle = { marginTop: 0, marginHorizontal: '1.8%' };
    const textStyle = { zIndex: 3, marginTop: -16, fontSize: 12, textAlign: 'center', marginLeft: -10 };

    return (
        <View style={{position: 'absolute', bottom: 0 }}>
            <Divider style={{ width: '110%', height:0.9, backgroundColor: '#e5e5e5'}} bold={true}/>
        <View style={{ height: 56, width: '100%', justifyContent: 'center', backgroundColor: '#F2F3F4', flexDirection: 'row', paddingLeft: 15}}>
            {buttonDetails.map((button, index) => (
                <View key={index} style={buttonStyle}>
                    <IconButton
                        style={buttonStyle}
                        icon={button.icon}
                        iconColor={activeButton === button.route ? '#FF5A5F' : '#7a7a7a'}
                        size={30}
                        onPress={() => navigation.navigate(button.route, button.params)}
                    />
                    <Text style={[textStyle, { color: activeButton === button.route ? '#FF5A5F' : '#7a7a7a' }]}>{button.label}</Text>
                </View>
            ))}
        </View>
        </View>
    );
}

