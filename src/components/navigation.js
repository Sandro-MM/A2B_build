import { Text, View} from 'react-native';
import {IconButton} from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import { useFonts, NotoSans_500Medium } from '@expo-google-fonts/noto-sans';
import SEARCH from '../../assets/img/nav/search.png'
import PLUS from '../../assets/img/nav/PlusCircle.png'
import CAR from '../../assets/img/nav/CarProfile.png'
import CHAT from '../../assets/img/nav/ChatsCircle.png'
import PROFILE from '../../assets/img/nav/UserCircle.png'


export default function Navigation({ navigation, activeButton }) {
    const { t } = useTranslation();
    let [fontsLoaded] = useFonts({
         NotoSans_500Medium
    });

    const buttonDetails = [
        { icon: SEARCH , route: 'HomeScreen', label: 'search' },
        { icon: PLUS, route: 'AddRideCheck', label: 'publish' },
        { icon: CAR, route: 'RideHistory', label: 'your_rides' },
        { icon: CHAT, route: 'NotificationsScreen', label: 'inbox' },
        { icon: PROFILE, route: 'Profile', label: 'profile', params: { IsUserOrder: 1, navigation: navigation } }
    ];

    const buttonStyle = { marginTop: 0, marginHorizontal: '1.8%',  };
    const textStyle = { zIndex: 3, marginTop: -16, fontSize: 12, textAlign: 'center', marginLeft: -10, fontFamily: 'NotoSans_500Medium'  };

    async function checkAccessToken(route, params) {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            if (!accessToken) {
                navigation.navigate('AuthScreen');
            } else {
                navigation.navigate(route,params);
            }
        } catch (error) {
            console.error('Error retrieving access token:', error);
        }
    }

    return (
        <View style={{ position: 'absolute', bottom: 0}}>
            { fontsLoaded && <View style={{ height: 82, width: '100%', justifyContent: 'space-around', backgroundColor: 'rgba(252, 252, 253, 1)', flexDirection: 'row', paddingLeft: 4 , shadowColor: "rgba(16, 24, 40, 0.1)",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8, elevation: 4,
                alignItems:'center'
            }}>
                {buttonDetails.map((button, index) => (
                    <View key={index} style={buttonStyle}>
                        <IconButton
                            style={buttonStyle}
                            icon={button.icon}
                            iconColor={activeButton === button.route ? '#FF5A5F' : '#7a7a7a'}
                            size={28}
                            onPress={() => checkAccessToken(button.route, button?.params)}
                        />
                        <Text style={[textStyle, { color: activeButton === button.route ? '#FF5A5F' : '#7a7a7a' }]}>{t(button.label)}</Text>
                    </View>
                ))}
            </View>}


        </View>
    );
}

