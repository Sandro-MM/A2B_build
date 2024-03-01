import React from 'react';
import {
    Container,
    SettingsTitle,
    SettingsVal,
    TitleLeft,
} from "../../styles/styles";
import {Divider, IconButton} from "react-native-paper";
import {TouchableHighlight, View} from "react-native";
import {useForm} from "react-hook-form";

const ProfileSettings = (props) => {
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 };
    const userData = props.route.params.userData;
    const birthdate = new Date(userData.BirthDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });



    const getGenderString = (gender) => {
        switch (gender) {
            case 1:
                return 'Male';
            case 2:
                return 'Female';
            default:
                return 'Other';
        }
    };

    const settings = {
        FirstName: {
            title: 'First name',
            value: userData.FirstName,
        },
        LastName: {
            title: 'Last name',
            value: userData.LastName,
        },
        Email: {
            title: 'Email',
            value: userData.Email,
        },
        BirthDate: {
            title: 'Birth Date',
            value: birthdate,
        },
        Gender: {
            title: 'Gender',
            value: getGenderString(userData.Gender),
        },
        PhoneNumber: {
            title: 'Phone number',
            value: userData.PhoneNumber || ' ',
        },
    };

    const Description = {
        title: 'Description',
        value: userData.UserDetail.Description || ' ',
    };

    const { control, handleSubmit, watch,reset } = useForm();


    const openSettingInput = (key) => {
        props.navigation.navigate('SettingInput', {
            title: settings[key].title,
            name: key,
            defaultValue: settings[key].value,
            control: control,
            handleSubmit: (data) => {
                console.log(control._formValues[key]);
            },
        });
    };



    return (

            <Container>
                <IconButton
                    rippleColor='gray'
                    style={{ position: 'absolute', top: 38, left: 0, zIndex: 3 }}
                    icon='close'
                    iconColor='#1B1B1B'
                    size={28}
                    onPress={() => props.navigation.goBack()}
                />
                <TitleLeft>Settings</TitleLeft>

                {Object.keys(settings).map((key, index) => (
                    <TouchableHighlight
                        key={index}
                        onPress={() => openSettingInput(key)}
                        underlayColor='rgba(128, 128, 128, 0.5)'
                    >
                        <View style={viewStyle}>
                            <SettingsTitle>{settings[key].title}</SettingsTitle>
                            <SettingsVal>{settings[key].value}</SettingsVal>
                        </View>
                    </TouchableHighlight>
                ))}
                <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
            </Container>

    );
};

export default ProfileSettings;
