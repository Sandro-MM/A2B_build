import {
    getAccessToken,
    GetApi,
    headersText,
    headersTextToken,
    OrderEndpoints,
    PostApi,
    PutApi
} from "../../services/api";
import * as SecureStore from "expo-secure-store";
import {useEffect, useState} from "react";
import {Container, SettingsTitle, SettingsVal} from "../../styles/styles";
import {Text, TouchableHighlight, View} from "react-native";
import {Divider, Icon, IconButton, RadioButton} from "react-native-paper";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {colorMappingByName, vehicleTypeMappingByName} from "../../styles/vehicleMappings";
import {useForm} from "react-hook-form";
import MapAToBViewEditScreen from "./mapAToBViewEdit";
import {
    DestionationLocaliRu,
    DestionationLocality,
    DestionationLocalityKa,
    fromLocality,
    fromLocalityKa,
    fromLocalityRu
} from "../add_ride/locatity-functions";

export const EditRide = ({route}) => {
    const { control, handleSubmit, watch,setValue} = useForm();
    const { t } = useTranslation();
    const [responseData, setResponseData] = useState(null);
    const { id } = route.params;
    const { navigation } = route.params;
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 };

    const pickupMoment = moment(responseData?.PickUpTime);
    const formattedDate = pickupMoment.format("DD MMM YYYY");
    const formattedTime = pickupMoment.format("HH:mm");
    console.log(formattedTime,'formattedTime')
    const cf = control._formValues;

    const changeData = async (item) =>{
        setResponseData(null)
        console.log(123123123123123)
        console.log(item,'itemITEM')
        try {
            console.log(item,'itemITEM')
                const accessToken = await getAccessToken();
                const responseData = await PutApi(`${OrderEndpoints.put.updateDetails}${id}`, item, {
                    headers: {
                        ...headersText.headers,
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            fetchData()
        }
    }

    const changeTime = async (time, date) =>{
        const pickupMoment = moment(responseData?.PickUpTime);
        let result;

        if (time) {
            const formattedUpdatedTime = moment(time, 'HH:mm').format('HH:mm');
            result = `${pickupMoment.format('YYYY-MM-DD')}T${formattedUpdatedTime}:00+00:00`;
        } else if (date) {
            const formattedUpdatedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');
            result = `${formattedUpdatedDate}T${pickupMoment.format('HH:mm')}:00+00:00`;
        }
        console.log(result, 'resultTTTT');
        setResponseData(null)
        const data = {
            PickUpTime: result
        }
        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(`${OrderEndpoints.put.updateDetails}${id}`, data, {
                headers: {
                    ...headersText.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            fetchData()
        }
    }

    //
    // const leavingFromLocalityShortName = fromLocality(cf);
    // const leavingFromLocalityShortNameKa = fromLocalityKa(cf);
    // const leavingFromLocalityShortNameRu = fromLocalityRu(cf);





    const settings = {
        FirstName: {
            title: 'edit_date',
            value: formattedDate,
            navigation: () => navigation.navigate('EditDate', { setValue: changeTime, navigation: navigation })
        },
        LastName: {
            title: 'edit_time',
            value: formattedTime,
            navigation: () => navigation.navigate('EditTime', { setValue: changeTime, navigation: navigation, timeNow: formattedTime })
        },
        Email: {
            title: 'edit_passenger_count',
            value: responseData?.MaxPassenger,
            navigation: () => navigation.navigate('EditPassengerCount', { submit: changeData, navigation: navigation })
        },
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const responseData = await GetApi(`${OrderEndpoints.get.order}?orderId=${id}&`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setResponseData(responseData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };




    const handlePress = (key) => {
        console.log("Pressed:", key);
        const setting = settings[key];
        if (setting.navigation) {
            setting.navigation();
        }
    };

    const handleMapChoose = (data) => {
        setValue('MapFrom', data);
        console.log(control._formValues);
        navigation.navigate('MapAToBViewEditScreen',{title:'title', setValue:setValue, startPoint:
            cf.MapFrom
                , endPoint: {
                latitude: responseData?.DestinationLatitude,
                longitude: responseData?.DestinationLatitude,
            } , startAddress:cf.LeavingFrom?.formatted_address,  endAddress:responseData?.Destination, handleSubmit:handleMapEditFrom })
    }

    const handleMapChooseTo = (data) => {
        setValue('MapTo', data);
        navigation.navigate('MapAToBViewEditScreen',{title:'title', setValue:setValue, startPoint:{
                latitude: responseData?.DepartureLatitude,
                longitude: responseData?.DepartureLongitude,
            } , endPoint:control._formValues.MapTo , startAddress:responseData?.Departure,  endAddress:cf.Destination?.formatted_address, handleSubmit:handleMapEditTo })
    }

    const handleMapEditTo = async () => {

        const destinationLocalityShortName = await DestionationLocality(cf);
        const destinationLocalityShortNameKa = await DestionationLocalityKa(cf);
        const destinationLocalityShortNameRu = await DestionationLocaliRu(cf);
        const data = {
            RouteDetails:{
            Destination: {
                Name: {
                    En: cf?.Destination.formatted_address,
                    Ka: cf?.DestinationKa.formatted_address,
                    Ru: cf?.DestinationRu.formatted_address,
                },
                Latitude: cf?.MapTo.latitude,
                Longitude: cf?.MapTo.longitude,
                CityParent: {
                    En: destinationLocalityShortName,
                    Ka: destinationLocalityShortNameKa,
                    Ru: destinationLocalityShortNameRu
                }
            },
            Distance: parseFloat(cf?.distance),
            Duration: parseFloat(cf?.duration)
        }
        }
        await changeDataLocation(data)
    }


    const handleMapEditFrom = async () => {
        const leavingFromLocalityShortName = await fromLocality(cf);
        const leavingFromLocalityShortNameKa = await fromLocalityKa(cf);
        const leavingFromLocalityShortNameRu = await fromLocalityRu(cf);
        const data = {
            RouteDetails:{
            Origin: {
                Name: {
                    En: cf?.LeavingFrom.formatted_address,
                    Ka: cf?.LeavingFrom.formatted_address,
                    Ru: cf?.LeavingFrom.formatted_address,
                },
                Latitude: cf?.MapFrom.latitude,
                Longitude: cf?.MapFrom.longitude,
                CityParent: {
                    En: leavingFromLocalityShortName,
                    Ka: leavingFromLocalityShortNameKa,
                    Ru: leavingFromLocalityShortNameRu
                }
            },
            Distance: parseFloat(cf?.distance),
            Duration: parseFloat(cf?.duration)
            }
        }
        await changeDataLocation(data)
    }




    const changeDataLocation = async (item) =>{
        setResponseData(null)
        try {
            console.log(item,'itemITEM')
            const accessToken = await getAccessToken();
            const responseData = await PutApi(`${OrderEndpoints.put.updateRoute}${id}`, item, {
                headers: {
                    ...headersText.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            navigation.navigate('EditRide',{id:id, navigation:navigation})
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            fetchData()
        }
    }



    return(
        <Container>
            { responseData &&
        <Container>
            <TouchableHighlight
                style={{width:'100%'}}
                onPress={() => navigation.navigate('EditMapViewScreen', { title:t('edit_departure'),  setValue: setValue, navigation: navigation, handleMapChoose:handleMapChoose, valueName:'LeavingFrom'})}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <SettingsTitle>{t('edit_departure')}</SettingsTitle>
                    <SettingsVal style={{paddingLeft:30}}>{responseData?.Departure}</SettingsVal>
                    <IconButton style={{position:'absolute', right:0, top:0}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                </View>


            </TouchableHighlight>
            <TouchableHighlight
                style={{width:'100%'}}
                onPress={() => navigation.navigate('EditMapViewScreen', { title:t('edit_destination'),  setValue: setValue, navigation: navigation, handleMapChoose:handleMapChooseTo, valueName:'Destination'})}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <SettingsTitle>{t('edit_destination')}</SettingsTitle>
                    <SettingsVal style={{paddingLeft:30}}>{responseData?.Destination}</SettingsVal>
                    <IconButton style={{position:'absolute', right:0, top:0}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                </View>


            </TouchableHighlight>
            <Divider style={{ width: '90%', marginBottom: '2%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                style={{width:'100%'}}
                onPress={() => navigation.navigate('RidePriceEdit',{distance:responseData?.Distnace, navigation:navigation, initPrice:responseData?.Price, setValue:changeDataLocation})}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={viewStyle}>
                    <SettingsTitle>{t('edit_price')}</SettingsTitle>
                    <SettingsVal style={{paddingLeft:30}}>{responseData?.Price} ₾</SettingsVal>
                    <IconButton style={{position:'absolute', right:0, top:-10}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                </View>


            </TouchableHighlight>
            {Object.keys(settings).map((key, index) => (
                <TouchableHighlight
                    style={{width:'100%'}}
                    key={index}
                    onPress={() => handlePress(key)}
                    underlayColor='rgba(128, 128, 128, 0.5)'
                >
                    <View style={viewStyle}>
                        <SettingsTitle>{t(settings[key].title)}</SettingsTitle>
                        <SettingsVal style={{paddingLeft:30}}>{settings[key].value}</SettingsVal>
                        <IconButton style={{position:'absolute', right:0, top:-10}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                    </View>


                </TouchableHighlight>
            ))}
            <TouchableHighlight  onPress={() => navigation.navigate('ChooseCar',{navigation:navigation, handleCarChoose:changeData})}
                                underlayColor="rgba(128, 128, 128, 0.5)">
                <View style={{width:'100%'}}>
                    <Divider style={{ width: '90%', marginBottom: '2%' }} horizontalInset={true} bold={true} />
                    <View style={{ flexDirection: 'row', width:'86%' , marginHorizontal:'7%'}}>
                        <IconButton
                            style={{ width: 35, height: 35 }}
                            color='#1B1B1B'
                            size={35}
                            icon={vehicleTypeMappingByName[responseData.UserOrderCar.CarType] || 'car-side'}
                        />
                        <View>
                            <Text style={{ fontSize: 15 }}>{responseData.UserOrderCar.Manufacturer.Name} {responseData.UserOrderCar.Model.Name}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{ fontSize: 14, color: '#667085' }}>{responseData.UserOrderCar.Color.Name}</Text>
                                <IconButton
                                    style={{ width: 16, height: 16, marginTop:2}}
                                    iconColor={colorMappingByName[responseData.UserOrderCar.Color.Name]}
                                    size={16}
                                    icon='circle'
                                />
                            </View>
                        </View>
                    </View>
                    <IconButton style={{position:'absolute', right:0, top:0}} iconColor={'#FF5A5F'} size={30} icon={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%', marginBottom: '2%' }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                onPress={() => navigation.navigate('EditRideDescription', {value: responseData?.Description , submit:changeData } )}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={{ height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginRight:15, marginLeft:30, alignItems:'center'}}>
                    <SettingsVal>{t('edit_description')}</SettingsVal>
                    <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => navigation.navigate('EditDescription', {onSubmit: changeData , navigation:navigation, items:responseData.OrderDescriptionTypeIds } )}
                underlayColor='rgba(128, 128, 128, 0.5)'
            >
                <View style={{ height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginRight:15, marginLeft:30, alignItems:'center'}}>
                    <SettingsVal>{t('edit_prefrences')}</SettingsVal>
                    <Icon size={30} color={'#FF5A5F'} source={'chevron-right'}/>
                </View>
            </TouchableHighlight>
        </Container>}
        </Container>
    )


}
