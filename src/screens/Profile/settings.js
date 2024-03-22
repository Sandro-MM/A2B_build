import React, {useState} from 'react';
import {
    SettingsVal, Subtitle, Title,
    TitleLeft,
} from "../../styles/styles";
import {Divider, Icon, IconButton} from "react-native-paper";
import {ScrollView, TouchableHighlight, View} from "react-native";
import { Linking } from 'react-native';
import DeleteConfirmationModal from "../../components/modal";
import {accEndpoints, DelApi, getAccessToken, headersText, PatchApi, PostApi} from "../../services/api";
import * as SecureStore from "expo-secure-store";

const SettingsPage = (props) => {
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, alignItems:'center'};
    const userData = props.route.params.userData;
    const [isDelModalVisible, setDelModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(() => null);

    const showDelModal = (messege, action) => {
        setModalMessage(messege)
        setConfirmAction(() => action)
        setDelModalVisible(true);
    }
    const hideDelModal = () => setDelModalVisible(false);

    const openBrowser = (url) => {
        Linking.openURL(url)
            .catch((err) => console.error('An error occurred', err));
    }
    const logOut = async () => {
        try {
            const accessToken = await getAccessToken();
            const fetchedData = await PostApi(accEndpoints.post.Logout,null ,{
                headers: {
                    ...headersText.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const delToken = await SecureStore.deleteItemAsync('accessToken');
            props.navigation.navigate('HomeScreen')
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const deleteAcc = async () => {
        try {
            const accessToken = await getAccessToken();
            const fetchedData = await DelApi(accEndpoints.delete.UserDel,null ,{
                headers: {
                    ...headersText.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const delToken = await SecureStore.deleteItemAsync('accessToken');
            props.navigation.navigate('HomeScreen')
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const settings = {
        Notification:{
            title: 'Notification, email & SMS',
            nav: 'NotificationEmailSms'
        },
        Password:{
            title: 'Change password',
            nav: 'PasswordSettingInput'
        },
        Language:{
            title: 'Change language',
            nav: 'LanguageSetting'
        },
    };
    const info = {
        Help:{
            title: 'Help',
            url:'https://www.a2b.ge/en/help'
        }
           ,
        Terms:{
            title: 'Terms & Conditions',
            url:'https://www.a2b.ge/en/terms-and-conditions'
        },
        Data:
            {
                title:'Data protection',
                 url:'https://www.a2b.ge/en/privacy-policy'
            },
        licenses: {
            title:
            'Licenses',
            url:'https://www.a2b.ge/en/licenses'
        },
    };


    const openSettingInput = (key) => {
        props.navigation.navigate('ProfileSettings', {userData:userData});
    };



    return (
        <ScrollView contentContainerStyle={{justifyContent:'flex-start', paddingTop:40}}>
            <IconButton
                rippleColor='gray'
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }}
                icon='close'
                iconColor='#1B1B1B'
                size={28}
                onPress={() => props.navigation.goBack()}
            />
            <Title style={{marginBottom:-40, marginTop:-70}}>Settings</Title>
                <TouchableHighlight
                    onPress={() => openSettingInput()}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={viewStyle}>
                        <SettingsVal>Edit Profile</SettingsVal>
                        <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                    </View>
                </TouchableHighlight>

            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() => props.navigation.navigate('RatingsSetting')}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal>Ratings</SettingsVal>
                    <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            {Object.keys(settings).map((key, index) => (
                <TouchableHighlight
                    key={index}
                    onPress={() => props.navigation.navigate(settings[key].nav)}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={viewStyle}>
                        <SettingsVal>{settings[key].title}</SettingsVal>
                        <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                    </View>
                </TouchableHighlight>
            ))}
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            {Object.keys(info).map((key, index) => (
                <TouchableHighlight
                    key={index}
                    onPress={() => openBrowser(info[key].url)}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={viewStyle}>
                        <SettingsVal>{info[key].title}</SettingsVal>
                        <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                    </View>
                </TouchableHighlight>
            ))}
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() => showDelModal('Are you sure you want to Log out', () => logOut())}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal style={{color:'#FF5A5F'}}>Log out</SettingsVal>
                    <Icon size={30} color={'gray'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() => showDelModal('Are you sure you want to Deactivate your account', () => deleteAcc())}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsVal style={{color:'#FF5A5F'}}>Deactivate account</SettingsVal>
                    <Icon size={30} color={'gray'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            <DeleteConfirmationModal
                isVisible={isDelModalVisible}
                onCancel={hideDelModal}
                confirmButton={{
                    title: 'Confirm',
                    onPress: async () => {
                        hideDelModal();
                        await confirmAction();
                    },
                    color: 'red',
                }}
                cancelButton={{
                    title: 'Cancel',
                    onPress: hideDelModal,
                    color: 'blue',
                }}
            >
                <Subtitle>{modalMessage}</Subtitle>
            </DeleteConfirmationModal>
</ScrollView>
    );
};

export default SettingsPage;
