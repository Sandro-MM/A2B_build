import React, {useState} from 'react';
import {
    ContainerTop,
    SettingsTitle,
    SettingsVal,
    Title,
} from "../../styles/styles";
import {Divider, IconButton} from "react-native-paper";
import {TouchableHighlight, View} from "react-native";
import {useForm} from "react-hook-form";
import {accEndpoints, getAccessToken, GetApi, headers, headersTextToken, PatchApi, PutApi} from "../../services/api";
import * as ImagePicker from "expo-image-picker";

const ProfileSettings = (props) => {
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 };
    const userData = props.route.params.userData;
    const birthdate = new Date(userData.BirthDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });

    const [name , setName] = useState(null);
    const [gender , setGenders] = useState(null);
    const [LastName , setLastName] = useState(null);
    const [Email , setEmail] = useState(null);
    const [BirthDate , setBirthDate] = useState(null);
    const [ PhoneNumber , setPhoneNumber] = useState(null);
    const getGenderString = (gender) => {
        switch (gender) {
            case 1 :
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
            value: name || userData.FirstName,
        },
        LastName: {
            title: 'Last name',
            value: LastName|| userData.LastName,
        },
        Email: {
            title: 'Email',
            value: Email || userData.Email,
        },
        BirthDate: {
            title: 'Birth Date',
            value: BirthDate || birthdate,
        },
        Gender: {
            title: 'Gender',
            value: gender? getGenderString(gender) :  getGenderString(userData.Gender),
        },
        PhoneNumber: {
            title: 'Phone number',
            value: PhoneNumber || userData.PhoneNumber || ' ',
        },
    };

    const Description = {
        title: 'Description',
        value: userData.UserDetail.Description || ' ',
    };

    const { control, handleSubmit, watch,reset } = useForm();


    const openSettingInput = (key) => {
        if (key == 'Gender'){
            props.navigation.navigate('GenderSetting',{ setGenders: setGenders})
        }else{
            props.navigation.navigate('SettingInput', {
                title: settings[key].title,
                name: key,
                defaultValue: settings[key].value,
                control: control,
                handleSubmit: async (data) => {
                    const Value = {[key]: control._formValues[key]};
                    try {
                        const accessToken = await getAccessToken();
                        const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });

                        switch (key) {
                            case 'FirstName':
                                setName(control._formValues[key]);
                                break;
                            case 'LastName':
                                setLastName(control._formValues[key]);
                                break;
                            case 'Email':
                                setEmail(control._formValues[key]);
                                break;
                            case 'BirthDate':
                                setBirthDate(control._formValues[key]);
                                break;
                            case 'PhoneNumber':
                                setPhoneNumber(control._formValues[key]);
                                break;
                            default:
                                break;
                        }

                    } catch (error) {
                        console.error('Error submitting data:', error);
                    }
                },
            });
        }
    };

    const  changeBio = async () => {
       const Value =
           {
               UserDetailsModel: {
            Description: control._formValues[Description]
        }
       }
        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 3],
                quality: 1,
            });




            if (result){
                const formData = new FormData();
                formData.append('file', { uri: result.assets[0].uri, type: 'image/jpeg', name: `image.jpg` });
                console.log(formData,'formData')
                try {
                    const accessToken = await getAccessToken();
                    const responseData = await PatchApi(accEndpoints.patch.EditImage, formData, {
                        headers: {
                            ...headers.headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                } catch  (error) {
                    console.error('ImagePicker Error: ', error);
                }
                }



        } catch (error) {
            console.error('ImagePicker Error: ', error);
        }
    };


    return (

            <ContainerTop style={{alignItems:'flex-start'}}>
                <IconButton
                    rippleColor='gray'
                    style={{ position: 'absolute', top: 38, left: 0, zIndex: 3 }}
                    icon='close'
                    iconColor='#1B1B1B'
                    size={28}
                    onPress={() => props.navigation.goBack()}
                />
                <Title style={{textAlign:'center', width:'100%', marginBottom:-40}}>Settings</Title>

                {Object.keys(settings).map((key, index) => (
                    <TouchableHighlight
                        style={{width:'100%'}}
                        key={index}
                        onPress={() => openSettingInput(key)}
                        underlayColor='rgba(128, 128, 128, 0.5)'
                    >
                            <View style={viewStyle}>
                                <SettingsTitle>{settings[key].title}</SettingsTitle>
                                <SettingsVal style={{paddingLeft:30}}>{settings[key].value}</SettingsVal>
                                <IconButton style={{position:'absolute', right:0, top:-10}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                            </View>


                    </TouchableHighlight>
                ))}
                <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
                <TouchableHighlight
                    style={{width:'100%'}}
                    onPress={() =>  props.navigation.navigate('DescriptionSetting',{title:'About me', name:'Description', defaultValue:control._formValues.Description, control:control, handleSubmit:changeBio()})}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={[viewStyle,{justifyContent:'center'}]}>
                        <SettingsVal style={{paddingLeft:30}}>About Me</SettingsVal>
                        <IconButton style={{position:'absolute', right:0, top:-10}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={{width:'100%'}}
                    onPress={() => pickImage()}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={[viewStyle,{justifyContent:'center'}]}>
                        <SettingsVal style={{paddingLeft:30}}>Change Picture</SettingsVal>
                        <IconButton style={{position:'absolute', right:0, top:-10}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={{width:'100%'}}
                    onPress={() => props.navigation.navigate('PrefrenceSettings')}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={[viewStyle,{justifyContent:'center'}]}>
                        <SettingsVal style={{paddingLeft:30}}>Change Prefrences</SettingsVal>
                        <IconButton style={{position:'absolute', right:0, top:-10}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                    </View>
                </TouchableHighlight>
            </ContainerTop>

    );
};

export default ProfileSettings;
