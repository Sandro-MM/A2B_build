import {View} from 'react-native';
import * as React from "react";
import MapViewScreen from "../../components/mapView";
import {createStackNavigator} from "@react-navigation/stack";
import MapAToBViewScreen from "../../components/mapAToBView";
import A2BNextIcon from "../../components/next_icon";
import RidePrice from "./ridePrice";
import ChooseCar from "./chooseCar";
import Description from "./description";
import {useForm} from "react-hook-form";
import CalendarListScreen from "../../components/calendarList";
import TimePicker from "../../components/timePicker";
import PassengerCount from "./passengerCount";
import Options from "./options";
import {getAccessToken, headersTextToken, OrderEndpoints, PostApi} from "../../services/api";
import AddBackRide from "./addBackRide";
import {useState} from "react";

export default function AddRide({navigation}) {
   const fromTitle = 'Where are you leaving from?'
    const toTitle = 'What is your destination?'
    const Stack = createStackNavigator();
    const { control, handleSubmit, watch,setValue} = useForm();
    const cf = control._formValues;
    const [reverseObj,setReverseObj]= useState(false)
    async function createRide(data) {
        const selectedDate = control._formValues.selectedDate;
        const time = control._formValues.time;
        const [year, month, day] = selectedDate.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        const pickUpTime = new Date(year, month - 1, day, hours, minutes);
        const pickUpTimeISOString = pickUpTime.toISOString();
        const fromLocality = () => {
            return new Promise(resolve => {
                const localityComponent = cf.LeavingFrom.address_components.find(component => component.types.includes("locality"));
                resolve(localityComponent ? localityComponent.short_name : "");
            });
        };
        const fromLocalityKa = () => {
            return new Promise(resolve => {
                const localityComponent = cf.LeavingFromKa.address_components.find(component => component.types.includes("locality"));
                resolve(localityComponent ? localityComponent.short_name : "");
            });
        };
        const fromLocalityRu = () => {
            return new Promise(resolve => {
                const localityComponent = cf.LeavingFromRu.address_components.find(component => component.types.includes("locality"));
                resolve(localityComponent ? localityComponent.short_name : "");
            });
        };
        const DestionationLocality = () => {
            return new Promise(resolve => {
                const localityComponent = cf.Destination.address_components.find(component => component.types.includes("locality"));
                resolve(localityComponent ? localityComponent.short_name : "");
            });
        };
        const DestionationLocalityKa = () => {
            return new Promise(resolve => {
                const localityComponent = cf.DestinationKa.address_components.find(component => component.types.includes("locality"));
                resolve(localityComponent ? localityComponent.short_name : "");
            });
        };
        const DestionationLocaliRu = () => {
            return new Promise(resolve => {
                const localityComponent = cf.DestinationRu.address_components.find(component => component.types.includes("locality"));
                resolve(localityComponent ? localityComponent.short_name : "");
            });
        };



        const leavingFromLocalityShortName = await fromLocality();
        const leavingFromLocalityShortNameKa = await fromLocalityKa();
        const leavingFromLocalityShortNameRu = await fromLocalityRu();

        const destinationLocalityShortName = await DestionationLocality();
        const destinationLocalityShortNameKa = await DestionationLocalityKa();
        const destinationLocalityShortNameRu = await DestionationLocaliRu();


        const Smoking = cf.Smoking === "No" ? 1 : cf.Smoking === "Yes" ? 2 : cf.Smoking === "On Stops" ? 3 : 2;
        const Pets = cf.Pets === "No" ? 5 : cf.Pets === "Yes" ? 4 : cf.Pets === "Depends on pet" ? 6 : 4;
        const Music = cf.Music === "No" ? 8 : cf.Music === "Yes"?7 : 7;
        const Luggage = cf.Luggage === "No" ? 9 : cf.Luggage === "Yes"?10 : 10;
        const Package = cf.Package === "No" ? 12 : cf.Package === "Yes"?11 : 11;



        const  reqObject =[
            {
                PickUpTime: pickUpTimeISOString,
                MiddleSeat: true,
                Price: cf.RidePrice,
                MaxPassenger:  cf.passengerCount,
                CarId: cf.carId,
                Description: cf.description,
                InstantBooking: true,
                RouteDetails: {
                    Origin: {
                        Name: {
                            En: cf.LeavingFrom.formatted_address,
                            Ka: cf.LeavingFromKa.formatted_address,
                            Ru: cf.LeavingFromRu.formatted_address,
                        },
                        Latitude: cf.MapFrom.latitude,
                        Longitude: cf.MapFrom.longitude,
                        CityParent: {
                            En: leavingFromLocalityShortName,
                            Ka: leavingFromLocalityShortNameKa,
                            Ru: leavingFromLocalityShortNameRu
                        }
                    },
                    Destination: {
                        Name: {
                            En:cf.Destination.formatted_address,
                            Ka: cf.DestinationKa.formatted_address,
                            Ru: cf.DestinationRu.formatted_address,
                        },
                        Latitude: cf.MapTo.latitude,
                        Longitude: cf.MapTo.longitude,
                        CityParent: {
                            En: destinationLocalityShortName,
                            Ka: destinationLocalityShortNameKa,
                            Ru: destinationLocalityShortNameRu
                        }
                    },
                    Distance: cf.distance,
                    Duration: cf.duration
                },
                OrderDescriptionIds: [
                    Smoking,Pets,Music,Luggage,Package
                ]
            }]

        const  reversReqObject =[
            {
                PickUpTime: pickUpTimeISOString,
                MiddleSeat: true,
                Price: cf.RidePrice,
                MaxPassenger:  cf.passengerCount,
                CarId: cf.carId,
                Description: cf.description,
                InstantBooking: true,
                RouteDetails: {
                    Origin: {
                        Name: {
                            En:cf.Destination.formatted_address,
                            Ka: cf.DestinationKa.formatted_address,
                            Ru: cf.DestinationRu.formatted_address,
                        },
                        Latitude: cf.MapTo.latitude,
                        Longitude: cf.MapTo.longitude,
                        CityParent: {
                            En: destinationLocalityShortName,
                            Ka: destinationLocalityShortNameKa,
                            Ru: destinationLocalityShortNameRu
                        }
                    },
                    Destination: {
                        Name: {
                            En: cf.LeavingFrom.formatted_address,
                            Ka: cf.LeavingFromKa.formatted_address,
                            Ru: cf.LeavingFromRu.formatted_address,
                        },
                        Latitude: cf.MapFrom.latitude,
                        Longitude: cf.MapFrom.longitude,
                        CityParent: {
                            En: leavingFromLocalityShortName,
                            Ka: leavingFromLocalityShortNameKa,
                            Ru: leavingFromLocalityShortNameRu
                        }
                    },
                    Distance: cf.distance,
                    Duration: cf.duration
                },
                OrderDescriptionIds: [
                    Smoking,Pets,Music,Luggage,Package
                ]
            }]

            console.log(reqObject,'reqObject')


        try {
                if (reverseObj === false){
                    const accessToken = await getAccessToken();
                    const responseData = await PostApi(OrderEndpoints.post.createOrder, reqObject, {
                        headers: {
                            ...headersTextToken.headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setReverseObj(true)
                    navigation.navigate("AreYouGoingBack");
                }
                else {
                    const accessToken = await getAccessToken();
                    const responseData = await PostApi(OrderEndpoints.post.createOrder, reversReqObject, {
                        headers: {
                            ...headersTextToken.headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    navigation.navigate("HomeScreen");
                }


        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {


        }
    }


    return (
        <Stack.Navigator>
            <Stack.Screen name="LeavingFrom" options={{ headerShown: false }}>
                {({ navigation }) => (
                <MapViewScreen
                    title={fromTitle}
                    setValue={setValue}
                    valueName={'LeavingFrom'}
                    handleMapChoose={(handleMapChoose) => {
                        setValue('MapFrom', handleMapChoose);
                        console.log(control._formValues);
                        navigation.navigate("Destination")
                    }}
                />
                )}
            </Stack.Screen>
            <Stack.Screen name="Destination" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <MapViewScreen
                        title={toTitle}
                        setValue={setValue}
                        valueName={'Destination'}
                        handleMapChoose={(handleMapChoose) => {
                            setValue('MapTo', handleMapChoose);
                            console.log(control._formValues);
                            navigation.navigate("AToBRoute")
                        }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="AToBRoute" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <MapAToBViewScreen
                            startAddress={cf.LeavingFrom.formatted_address}
                            endAddress={cf.Destination.formatted_address}
                            title={toTitle}
                            startPoint={control._formValues.MapFrom}
                            endPoint={control._formValues.MapTo}
                            setValue={setValue}
                            control={control}
                        />
                        <View style={{position:'absolute', zIndex:3, bottom:0, right:0}}>
                            <A2BNextIcon onPress={() => navigation.navigate("Calendar")}/>
                        </View>
                    </View>

                )}
            </Stack.Screen>
            <Stack.Screen name="Calendar" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <CalendarListScreen control={control} setValue={setValue} navigation={() => navigation.navigate("ChooseTime")} />
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="ChooseTime" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                       <TimePicker setValue={setValue}  navigation={() => navigation.navigate("PassengerCount")}/>
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="PassengerCount" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                        <PassengerCount  navigation={navigation} control={control} setValue={setValue}/>

                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="Price" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <View style={{width:'100%', flex:1}}>
                   <RidePrice distance={control._formValues.distance}  navigation={navigation} control={control} setValue={setValue}/>
                        <A2BNextIcon onPress={() =>  navigation.navigate("ChooseCar")}/>
                    </View>
                )}
            </Stack.Screen>
            <Stack.Screen name="ChooseCar" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <ChooseCar
                        navigation={navigation}
                        handleCarChoose={(carId) => {
                            console.log('Selected Car ID:', carId);
                            setValue('carId',carId);
                        }}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen name="Description" options={{ headerShown: false }}>
                {({ navigation }) => (
                   <Description control={control} navigation={navigation} name={'description'} handleSubmit={(value) => {
                       console.log(control._formValues);
                       navigation.navigate("Options");
                   }}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="Options" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <Options setValue={setValue} navigation={navigation} onSubmit={()=>createRide(control)}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="AreYouGoingBack" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <AddBackRide navigation={navigation} handleYesPress={() => navigation.navigate("Calendar")} handleNoPress={()=>navigation.navigate('HomeScreen')}/>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
