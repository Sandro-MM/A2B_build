import {AppState, Keyboard, Text, TouchableHighlight, View} from 'react-native';
import {
    BtnTextAuth, ContainerMid,
    ContainerTop, ProfileAge,
    RedBtn,
    Title
} from "../../styles/styles";
import * as React from "react";
import Navigation from "../../components/navigation";
import {accEndpoints, CarEndpoints, getAccessToken, GetApi, PatchApi, PostApi} from "../../services/api";
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


const Stack = createStackNavigator();
export default function AddRideCheck({navigation}) {
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

            // Make all API calls simultaneously
            const [ActiveRidesNumberGet, UserContactInfoGet, UserCarsGet] = await Promise.all([
                GetApi(accEndpoints.get.ActiveRidesNumber, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
                GetApi(accEndpoints.get.IsUserVerified, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }),
                GetApi(CarEndpoints.get.Cars, {
                    headers: {
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
                                <Text style={{ fontSize: 14, color: '#667085' }}>{car.Color}</Text>
                                <IconButton
                                    style={{ width: 16, height: 16, position: 'absolute', bottom: 3, right: 0 }}
                                    iconColor={colorMappingByName[car.Color]}
                                    size={16}
                                    icon='circle'
                                />
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
                    <Title>Vehicles</Title>
                    {
                        userCars ? <RenderCars userCars={userCars}/> :

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
                                <View style={{position:'absolute', bottom:60, right:0}}>
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
                            You Have Maximum Active Rides!
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
                        <Title>Contact Information</Title>
                        <ProfileAge style={{marginLeft:55, marginBottom:8}}>  Email </ProfileAge>
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
                                <Text> Verify</Text>
                            </Button>}
                        </View>
                        <ProfileAge style={{marginLeft:55, marginBottom:8}}>  Phone number </ProfileAge>
                        <View style={{ height: 38,  flexDirection:'row', width:'80%'}} rippleColor='gray' mode="text" onPress={() => console.log('Pressed')}>
                            <Icon
                                source="cellphone"
                                color='#FF5A5F'
                                size={18}
                            />
                            <Text style={{fontWeight:'500', color: '#2f2f2f', fontSize: 16, lineHeight: 18, marginBottom: 10}}>   {userContactInfo?.Phone || 'No Phone Number'} </Text>
                            {userContactInfo?.IsConfirmedPhone ? (
                                <Icon
                                    source="check-decagram"
                                    color='#1B1B1B'
                                    size={18}
                                />
                            ) : <Button
                                style={{position:'absolute', right:0, top:-11}}
                                onPress={()=> navigation.navigate('VerifyPhoneNumber', { phoneNumber: userContactInfo?.Phone , nav:'Check'})}>
                                <Text> Verify</Text>
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
                                        <BtnTextAuth>Create Ride</BtnTextAuth>
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
                                    Confirm Contact Information
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
