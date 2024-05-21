import {AppState, Keyboard, Text, TouchableHighlight, View} from 'react-native';
import {
    BtnTextAuth, ContainerMid,
    ContainerTop, ProfileAge,
    RedBtn,
    Title
} from "../../styles/styles";
import * as React from "react";
import Navigation from "../../components/navigation";
import {accEndpoints, CarEndpoints, getAccessToken, GetApi, PatchApi, PostApi, PutApi} from "../../services/api";
import {useEffect, useState} from "react";
import Loading from "../../components/loading";
import {Button, Divider, Icon, IconButton, RadioButton} from "react-native-paper";
import {
    colorMappingByName,
    vehicleTypeMappingByName
} from "../../styles/vehicleMappings";
import {createStackNavigator} from "@react-navigation/stack";
import {EmailVerification} from "../register_login/emailVerification";
import {useForm} from "react-hook-form";
import Next_icon from "../../components/next_icon";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import ProfileSettings from "../Profile/profileSettings";


const Stack = createStackNavigator();
export default function AddRideCheck({navigation}) {
    const { t } = useTranslation();

    const { control, handleSubmit,formState ,formState: { errors }  } = useForm();
    const  [activeRidesNumber, setActiveRidesNumber ] = useState(null)
    const  [userContactInfo, setUserContactInfo ] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const  [userCars, setUserCars ] = useState(null)
    const  [Car, setCar ] = useState(null)




    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                fetchData();
            }
        };
        const focusListener = navigation.addListener('focus', fetchData);
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
        fetchData();
        return () => {
            if (focusListener && typeof focusListener.remove === 'function') {
                focusListener.remove();
            }
            if (appStateSubscription) {
                appStateSubscription.remove();
            }
        };
    }, [navigation]);

    const fetchData = async () => {
        try {
            setCar(null)
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');

            // Make all API calls simultaneously
            const [ActiveRidesNumberGet, UserContactInfoGet, UserCarsGet] = await Promise.all([
                GetApi(accEndpoints.get.ActiveRidesNumber, {
                    headers: {
                        'Accept-Language': language,
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
                GetApi(accEndpoints.get.IsUserVerified, {
                    headers: {
                        'Accept-Language': language,
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
                GetApi(CarEndpoints.get.Cars, {
                    headers: {
                        'Accept-Language': language,
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
            ]);
            setActiveRidesNumber(ActiveRidesNumberGet);
            setUserContactInfo(UserContactInfoGet);
            setUserCars(UserCarsGet);
            if (UserCarsGet && UserCarsGet.length === 1){
                setCar(UserCarsGet[0].Id)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const checkEmail = async () => {
        const accessToken = await getAccessToken();
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await PatchApi(accEndpoints.patch.ValidateEmail, null,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchData();
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyEmail = async (data) => {
        const accessToken = await getAccessToken();
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await PatchApi(`${accEndpoints.patch.ConfirmEmail}?confirmationCode=${data.code}&`,null,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigation.navigate('Check');
            fetchData();
        } catch (error) {
            const errorTitle = error.response.data.detail || 'An error occurred';
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };

    const navigationStatus = () => {
        if ( userContactInfo?.IsConfirmedEmail && userContactInfo?.IsConfirmedPhone){
            navigation.navigate('AddRide', { activeRidesNumber: activeRidesNumber.RideNumber, car:Car })
        }else {
            navigation.navigate('ContactInfo', { activeRidesNumber: activeRidesNumber.RideNumber })
        }

    }



    const addNumber =  async () => {
        const Value = {phone_number: control._formValues.phone_number};
        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchData();
            navigation.navigate('AddRideCheck')
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const RenderCars = ({ userCars }) => (

            <View style={{width:'100%'}}>
                {userCars.map((car, index) => (
                    <TouchableHighlight key={index}  onPress={() => setCar(car.Id)}
                                        underlayColor="rgba(128, 128, 128, 0.5)">
                    <View style={{width:'100%'}}>
                        <Divider style={{ width: '90%', marginBottom: '2%' }} horizontalInset={true} bold={true} />
                        <View style={{ flexDirection: 'row', width:'86%' , marginHorizontal:'7%'}}>
                            <IconButton
                                style={{ width: 35, height: 35 }}
                                color='#1B1B1B'
                                size={35}
                                icon={vehicleTypeMappingByName[car.CarType] || 'car-side'}
                            />
                            <View>
                                <Text style={{ fontSize: 15 }}>{car.Manufacturer} {car.Model}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{ fontSize: 14, color: '#667085' }}>{car.Color}</Text>
                                    <IconButton
                                        style={{ width: 16, height: 16, marginTop:2}}
                                        iconColor={colorMappingByName[car.Color]}
                                        size={16}
                                        icon='circle'
                                    />
                                </View>

                            </View>
                            <View style={{position:'absolute', right:0, top:3, zIndex:-1}}>
                                <RadioButton
                                    onPress={() => setCar(car.Id)}
                                    value={car.Id}
                                    status={Car === car.Id ? 'checked' : 'unchecked'}
                                />
                            </View>
                        </View>
                    </View>
                        </TouchableHighlight>
                ))}
            </View>

    );




    return (
<Stack.Navigator>
<Stack.Screen  name="Check" options={{ headerShown: false }}>
    {({ navigation }) => (
        <View style={{flex:1}}>
            {activeRidesNumber && userContactInfo && userCars ? (
                <ContainerMid>
                    <Title>{t('vehicles')}</Title>
                    {
                        userCars.length > 0 ? <RenderCars userCars={userCars}/> :

                            <View style={{height:80}}>
                             <Text style={{fontSize:16, marginBottom:5}}>
                                 You don't have any vehicles!
                             </Text>
                                <Button
                                    onPress={()=> navigation.navigate('AddVehicle',{mode:'addVehicle', navigation:navigation})}>
                                    <Text style={{fontSize:16}}> Add vehicle</Text>
                                </Button>
                            </View>
                    }

                    <Divider style={{ width: '90%', marginBottom: 10 }} horizontalInset={true} bold={true} />

                    {activeRidesNumber && activeRidesNumber.RideNumber < 3 ? (
                        Car ? (
                                <View style={{position:'absolute', bottom:70, right:0}}>
                                <Next_icon
                                    onPress={() => navigationStatus()}
                                >
                                </Next_icon>
                                </View>
                            ) : null
                    ) : (
                        <Text
                            style={{
                                position: 'absolute',
                                bottom: 70,
                                fontSize: 17,
                                color: '#FF5A5F'
                            }}
                        >
                            {t('you_have_maximum_active_rides')}
                        </Text>
                    )}
                </ContainerMid>
            ) : (
                <Loading />
            )}
            <Navigation navigation={navigation} activeButton={'AddRideCheck'}/>
        </View>
    )}
</Stack.Screen>
    <Stack.Screen  name="ContactInfo" options={{ headerShown: false }}>
        {({ navigation }) => (
            <View style={{flex:1}}>
                {activeRidesNumber && userContactInfo && userCars ? (
                    <ContainerTop>
                        <Title>{t('contact_information')}</Title>
                        <ProfileAge style={{marginLeft:55, marginBottom:8}}>{t('email')}</ProfileAge>
                        <View style={{ height: 38,  flexDirection:'row', width:'80%'}} rippleColor='gray' mode="text" onPress={() => console.log('Pressed')}>
                            <Icon
                                source="email"
                                color='#FF5A5F'
                                size={18}
                            />
                            <Text style={{fontWeight:'500', color: '#2f2f2f', fontSize: 16, lineHeight: 18, marginBottom: 10}}>  {userContactInfo.Email} </Text>
                            {userContactInfo?.IsConfirmedEmail ? (
                                <Icon
                                    source="check-decagram"
                                    color='#1B1B1B'
                                    size={18}
                                />
                            ) : <Button
                                style={{position:'absolute', right:0, top:-11}}
                                onPress={()=> navigation.navigate('VerifyEmail')}>
                                <Text> {t('verify')}</Text>
                            </Button>}
                        </View>
                        <ProfileAge style={{marginLeft:55, marginBottom:8}}>  {t('phonenumber')} </ProfileAge>
                        <View style={{ height: 38,  flexDirection:'row', width:'80%'}} rippleColor='gray' mode="text" onPress={() => console.log('Pressed')}>
                            <Icon
                                source="cellphone"
                                color='#FF5A5F'
                                size={18}
                            />
                            <Text style={{fontWeight:'500', color: '#2f2f2f', fontSize: 16, lineHeight: 18, marginBottom: 10}}>   {userContactInfo?.Phone || t('no_phone_number')} </Text>

                            {userContactInfo?.Phone? userContactInfo?.IsConfirmedPhone ? (
                                <Icon
                                    source="check-decagram"
                                    color='#1B1B1B'
                                    size={18}
                                />
                            ) : <Button
                                style={{position:'absolute', right:0, top:-11}}
                                onPress={()=> navigation.navigate('VerifyPhoneNumber', { phoneNumber: userContactInfo?.Phone , nav:'Check'})}>
                                <Text> {t('verify')}</Text>
                            </Button> :  <Button
                                style={{position:'absolute', right:0, top:-11}}
                                onPress={()=> navigation.navigate('SettingInput', { title: 'add_phone_number', name:'phone_number', defaultValue:'', control: control, handleSubmit:addNumber
                                })}>
                                <Text> {t('add')}</Text>
                            </Button>}
                        </View>

                        {
                            userContactInfo?.IsConfirmedEmail && userContactInfo?.IsConfirmedPhone ? (
                                    <RedBtn
                                        style={{ position: 'absolute', bottom: 70 }}
                                        buttonColor='#FF5A5F'
                                        mode="contained"
                                        onPress={() => navigation.navigate('AddRide', { activeRidesNumber: activeRidesNumber.RideNumber, car:Car })}
                                    >
                                        <BtnTextAuth> {t('create_ride')}</BtnTextAuth>
                                    </RedBtn>
                            ) : (
                                <Text
                                    style={{
                                        position: 'absolute',
                                        bottom: 70,
                                        fontSize: 17,
                                        color: '#FF5A5F'
                                    }}
                                >
                                    {t('confirm_contact_information')}
                                </Text>
                        )}
                    </ContainerTop>
                ) : (
                    <Loading />
                )}
            </View>
        )}
    </Stack.Screen>
    <Stack.Screen  name="VerifyEmail" options={{ headerShown: false }}>
        {({ navigation }) => (
            <EmailVerification checkEmail={handleSubmit(checkEmail)} control={control} onSubmitCode={handleSubmit(verifyEmail)} isLoading={isLoading} errors={errors} error={error} setError={setError} navigation={navigation}/>
        )}
    </Stack.Screen>
</Stack.Navigator>
    );
}
