import React from 'react';
import {Text, View} from 'react-native';
import {Button, Checkbox, IconButton} from 'react-native-paper';
import { Container, SmallBtnText, Subtitle} from "../styles/styles";
import {
    OrderIconColorMapping, OrderIconMapping
} from "../styles/vehicleMappings";
import {format} from "date-fns";
import {getAccessToken, GetApi, OrderEndpoints} from "../services/api";
import {Slider} from "@miblanchard/react-native-slider";

export const ListFilter = ({navigation, control, setValue}) => {


    const [checked0_6, setChecked0_6] = React.useState(false);
    const [checked6_12, setChecked6_12] = React.useState(false);
    const [checked12_18, setChecked12_18] = React.useState(false);
    const [checked18_0, setChecked18_0] = React.useState(false);
    const [pets, setPets] = React.useState(false);
    const [smoke, setSmoke] = React.useState(false);
    const [music, setMusic] = React.useState(false);
    const [luggage, setLuggage] = React.useState(false);
    const [packageItem, setPackageItem] = React.useState(false);
    const [sliderVal, setSliderVal] = React.useState([0, 30]);


    async function onSubmit() {
        const v = control._formValues
        const formattedStartDay = format(new Date(v.startDay), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        const startDate = new Date(formattedStartDay);
        const utcTimeStartDay = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000));
        const formattedStart = utcTimeStartDay.toISOString();
        const formattedEndDay = (format(new Date(v.endDay || v.startDay), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"))
        const EndDate = new Date(formattedEndDay);
        const utcTimeEndDay = new Date(EndDate.getTime() - (EndDate.getTimezoneOffset() * 60000));
        const formattedEnd = utcTimeEndDay.toISOString();

        const allStatesFalse = !checked0_6 && !checked6_12 && !checked12_18 && !checked18_0;

        const TimeDiapazon = allStatesFalse ? '' :
            (checked0_6 ? '&DepartureTimeDiapazon=0,6' : '') +
            (checked6_12 ? '&DepartureTimeDiapazon=6,12' : '') +
            (checked12_18 ? '&DepartureTimeDiapazon=12,18' : '') +
            (checked18_0 ? '&DepartureTimeDiapazon=18,0' : '') +
            '&';

        try {
            const accessToken = await getAccessToken();
            const responseData = await GetApi(`${OrderEndpoints.get.orders}?departureLatitude=${v.departureLatitude}&departureLongitude=${v.departureLongitude}&destinationLatitude=${v.destinationLatitude}&destinationLongitude=${v.destinationLongitude}&date=${formattedStart}&date=${formattedEnd}&luggageAllowed=${luggage}&musicAllowed=${music}&petsAllowed=${pets}&smokingAllowed=${smoke}&packageDelivery=${packageItem}&priceFrom=${sliderVal[0]}&priceTo=${sliderVal[1]}&Page=1&Offset=50&${TimeDiapazon}`, {
                headers: {
                    Authorization: `Bearer ${accessToken || null}`,
                },
            });
            console.log(responseData)
            setValue('results', responseData)
            navigation.navigate('List')
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
        }
    }





    return (
        <Container>
            <IconButton
                style={{position:'absolute',top:30, left: 16}}
                icon='close'
                onPress={()=>navigation.navigate('List')}
            />
            <View style={{ width:'100%', height:'100%', marginTop:200, alignItems:'center'}}>
                <View style={{width:'80%'}} >
                    <Slider
                        thumbStyle={{backgroundColor:'white', borderWidth:2, borderStyle:'solid', borderColor:'#FF5A5F'}}
                        animateTransitions
                        maximumTrackTintColor="#d3d3d3"
                        maximumValue={30}
                        minimumTrackTintColor="#FF5A5F"
                        minimumValue={0}
                        step={1}
                        value={sliderVal}
                        onValueChange={value => setSliderVal(value)}
                    />
                    <Text>Price: {sliderVal[0]}-{sliderVal[1]}</Text>
                </View>

                <Subtitle>
                    Departure Time
                </Subtitle>
                <View style={{justifyContent:'flex-start', width:'70%'}} >
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                    <Checkbox

                        color={'#FF5A5F'}
                        status={checked0_6 ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked0_6(!checked0_6);
                        }} />
                    <Text style={{fontSize:16}}> 00:00-06:00
                    </Text>
                        <Text style={{fontSize:16, position:'absolute', right:0}}>
                        {control._formValues.results.DepartureValueCountModel?.NightOrdersCount}</Text>
                    </View>
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={checked6_12 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked6_12(!checked6_12);
                            }} />
                        <Text style={{fontSize:16}}> 06:00-12:00
                        </Text>
                        <Text style={{fontSize:16, position:'absolute', right:0}}>
                            {control._formValues.results.DepartureValueCountModel?.MorningOrdersCount}</Text>
                    </View>
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={checked12_18 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked12_18(!checked12_18);
                            }} />
                        <Text style={{fontSize:16}}> 12:00-18:00
                        </Text>
                        <Text style={{fontSize:16, position:'absolute', right:0}}>
                            {control._formValues.results.DepartureValueCountModel?.AfternoonOrdersCount}
                        </Text>
                    </View>
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={checked18_0 ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setChecked18_0(!checked18_0);
                            }} />
                        <Text style={{fontSize:16}}> 18:00-00:00
                        </Text>
                        <Text style={{fontSize:16, position:'absolute', right:0}}>
                            {control._formValues.results.DepartureValueCountModel?.EveningOrdersCount}</Text>
                    </View>
                </View>
                <Subtitle>
                    Comfort
                </Subtitle>
                <View style={{justifyContent:'flex-start', width:'70%'}} >
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={smoke ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setSmoke(!smoke);
                            }} />
                        <IconButton
                            style={{marginTop:0, marginBottom:0, height:20, width:24}}
                            iconColor={OrderIconColorMapping[1]}
                            size={20}
                            icon={OrderIconMapping[1]}
                        />
                        <Text style={{fontSize:16, marginLeft:-5}}> Smoking Allowed</Text>
                        <Text style={{fontSize:16,position:'absolute', right:0}}>
                            {control._formValues.results.ComfortCountModel.SmokingAllowedCount}</Text>
                    </View>
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={pets ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setPets(!pets);
                            }} />
                        <IconButton
                            style={{marginTop:0, marginBottom:0, height:20, width:24}}
                            iconColor={OrderIconColorMapping[4]}
                            size={20}
                            icon={OrderIconMapping[4]}
                        />
                        <Text style={{fontSize:16, marginLeft:-5}}> Pets Allowed</Text>
                        <Text style={{fontSize:16,position:'absolute', right:0}}>
                            {control._formValues.results.ComfortCountModel.PetsAllowedCount}</Text>
                    </View>
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={music ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setMusic(!music);
                            }} />
                        <IconButton
                            style={{marginTop:0, marginBottom:0, height:20, width:24}}
                            iconColor={OrderIconColorMapping[7]}
                            size={20}
                            icon={OrderIconMapping[7]}
                        />
                        <Text style={{fontSize:16, marginLeft:-5}}> Music Allowed</Text>
                        <Text style={{fontSize:16,position:'absolute', right:0}}>
                            {control._formValues.results.ComfortCountModel.MusicAllowedCount}</Text>
                    </View>
                    <View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={luggage ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setLuggage(!luggage);
                            }} />
                        <IconButton
                            style={{marginTop:0, marginBottom:0, height:20, width:24}}
                            iconColor={OrderIconColorMapping[9]}
                            size={20}
                            icon={OrderIconMapping[9]}
                        />
                        <Text style={{fontSize:16, marginLeft:-5}}> Luggage Allowed</Text>
                        <Text style={{fontSize:16,position:'absolute', right:0}}>  {control._formValues.results.ComfortCountModel.LuggageAllowedCount}</Text>
                    </View>
                    <View  style={{flexDirection:'row', alignItems:'center', width:250}}>
                        <Checkbox

                            color={'#FF5A5F'}
                            status={packageItem ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setPackageItem(!packageItem);
                            }} />
                        <IconButton
                            style={{marginTop:0, marginBottom:0, height:20, width:24}}
                            iconColor={OrderIconColorMapping[11]}
                            size={20}
                            icon={OrderIconMapping[11]}
                        />
                        <Text style={{fontSize:16, marginLeft:-5}}> Package Delivery</Text>
                        <Text style={{fontSize:16,position:'absolute', right:0}}> {control._formValues.results.ComfortCountModel.PackageDeliveryCount}</Text>
                    </View>
                </View>
                <Button style={{height: 40, paddingTop: 3, borderRadius: 30, width: '40%', marginTop:'6%'}} buttonColor='#FF5A5F' mode='contained' onPress={onSubmit}>
                    <SmallBtnText style={{fontSize: 20, textAlign: 'center'}}>Filter</SmallBtnText>
                </Button>
            </View>

        </Container>
    );
};




