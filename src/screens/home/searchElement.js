import {View} from 'react-native';
import {
    ReviewBtn, SearchBtnText,
    SearchSurface, SearchText,
} from "../../styles/styles";
import * as React from "react";
import {Divider, IconButton} from "react-native-paper";
import {format} from "date-fns";
import {getAccessToken, GetApi, OrderEndpoints} from "../../services/api";



export default function SearchElement({navigation, date , leaving, going, control , setValue, close}) {


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
        try {
            const accessToken = await getAccessToken();
            const responseData = await GetApi(`${OrderEndpoints.get.orders}?departureLatitude=${v.departureLatitude}&departureLongitude=${v.departureLongitude}&destinationLatitude=${v.destinationLatitude}&destinationLongitude=${v.destinationLongitude}&date=${formattedStart}&date=${formattedEnd}&luggageAllowed=false&musicAllowed=false&petsAllowed=false&smokingAllowed=false&packageDelivery=false&priceFrom=0&priceTo=500&Page=1&Offset=50&`, {
                headers: {
                    Authorization: `Bearer ${accessToken || null}`,
                },
            });
            console.log(responseData)
            setValue('results', responseData)
            navigation.navigate('List')

            if (close !== undefined){
                close()
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
        }
    }


    return (
        <SearchSurface>
            <View style={{width:'100%', justifyContent: 'center'}}>
                <IconButton
                    iconColor='#969696'
                    style={{position:'absolute', left:'5%', top:4}}
                    size={22}
                    icon='circle-double'/>
                <ReviewBtn contentStyle={{ height: 44, justifyContent: 'flex-start'}} style={{paddingVertical:8, paddingHorizontal:'10%'}} rippleColor='gray' mode="text" onPress={()=>navigation.navigate('Places',{type:'departure'})} >
                    <SearchText>   {leaving || 'Leaving from...'} </SearchText>
                </ReviewBtn>
            </View>
            <Divider style={{ width: '80%' }} horizontalInset={true} bold={true} />
            <View style={{width:'100%', justifyContent: 'center'}}>
                <IconButton
                    iconColor='#969696'
                    style={{position:'absolute', left:'5%', top:4}}
                    size={22}
                    icon='circle-double'/>
                <ReviewBtn contentStyle={{ height: 44, justifyContent: 'flex-start'}} style={{paddingVertical:8, paddingHorizontal:'10%'}} rippleColor='gray' mode="text" onPress={()=>navigation.navigate('Places',{type:'destination'})} >
                    <SearchText>   {going || 'Going to...'} </SearchText>
                </ReviewBtn>
            </View>
            <Divider style={{ width: '80%' }} horizontalInset={true} bold={true} />
            <View style={{width:'100%', justifyContent: 'center'}}>
                <IconButton
                    iconColor='#969696'
                    style={{position:'absolute', left:'5%', top:4}}
                    size={22}
                    icon='calendar-month'/>
                <ReviewBtn contentStyle={{ height: 44, justifyContent: 'flex-start'}} style={{paddingVertical:8, paddingHorizontal:'10%'}} rippleColor='gray' mode="text" onPress={()=>navigation.navigate('Calendar')} >
                    <SearchText>   {date} </SearchText>
                </ReviewBtn>
            </View>
            <ReviewBtn contentStyle={{ height: 60, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:13, borderBottomRightRadius:13}} rippleColor='#ff373c' mode="text"
                onPress={onSubmit}
            >
                <SearchBtnText>Search</SearchBtnText>
            </ReviewBtn>
        </SearchSurface>
    );
}
