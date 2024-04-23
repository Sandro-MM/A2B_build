import {View, Text, Image} from 'react-native';
import {
    ReviewBtn, SearchBtn, SearchBtnText,
    SearchSurface, SearchText,
} from "../../styles/styles";
import * as React from "react";
import {Divider, IconButton} from "react-native-paper";
import {format} from "date-fns";
import {getAccessToken, GetApi, OrderEndpoints} from "../../services/api";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";
import PIN from '../../../assets/img/home-search/MapPin.png'
import MAP from '../../../assets/img/home-search/MapTrifold.png'
import CALENDARIMG from  '../../../assets/img/home-search/CalendarBlank.png'
import ARROW from  '../../../assets/img/home-search/arrow-circle-right.png'
import {useFonts, Inter_400Regular, Inter_600SemiBold} from '@expo-google-fonts/inter';


export default function SearchElement({navigation, date , leaving, going, control , setValue, close}) {
    const { t } = useTranslation();
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold
    });

    const textStyle = {fontFamily:'Inter_400Regular', fontSize:16, color:'#667085', lineHeight:20}
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
            const language = await SecureStore.getItemAsync('userLanguage');
            const responseData = await GetApi(`${OrderEndpoints.get.orders}?departureLatitude=${v.departureLatitude}&departureLongitude=${v.departureLongitude}&destinationLatitude=${v.destinationLatitude}&destinationLongitude=${v.destinationLongitude}&date=${formattedStart}&date=${formattedEnd}&luggageAllowed=false&musicAllowed=false&petsAllowed=false&smokingAllowed=false&packageDelivery=false&priceFrom=0&priceTo=500&Page=1&Offset=50&`, {
                headers: {
                     'Accept-Language': language,
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


  if (fontsLoaded)  return (
        <SearchSurface style={{marginTop:16}}>
            <View style={{width:'108%', justifyContent: 'center', marginTop:6}}>
                <IconButton
                    iconColor='#1D2939'
                    style={{position:'absolute', left:'5%', top:5}}
                    size={20}
                    icon= {PIN}/>
                <ReviewBtn contentStyle={{ height: 44, justifyContent: 'flex-start'}} style={{paddingVertical:8, paddingHorizontal:'10%'}} rippleColor='gray' mode="text" onPress={()=>navigation.navigate('Places',{type:'departure'})} >
                    <Text style={textStyle}>   {leaving || t('leaving_from')} </Text>
                </ReviewBtn>
            </View>
            <View style={{width:'108%', justifyContent: 'center',marginTop:-12}}>
                <IconButton
                    iconColor='#1D2939'
                    style={{position:'absolute', left:'5%', top:5}}
                    size={20}
                    icon={MAP}/>
                <ReviewBtn contentStyle={{ height: 44, justifyContent: 'flex-start'}} style={{paddingVertical:8, paddingHorizontal:'10%'}} rippleColor='gray' mode="text" onPress={()=>navigation.navigate('Places',{type:'destination'})} >
                    <Text style={textStyle}>   {going || t('going_to')} </Text>
                </ReviewBtn>
            </View>
            <Divider style={{ width: '94%' }} horizontalInset={true} bold={true} />
            <View style={{width:'108%', justifyContent: 'center'}}>
                <IconButton
                    iconColor='#1D2939'
                    style={{position:'absolute', left:'5%', top:5}}
                    size={20}
                    icon={CALENDARIMG}/>
                <ReviewBtn contentStyle={{ height: 44, justifyContent: 'flex-start'}} style={{paddingVertical:8, paddingHorizontal:'10%'}} rippleColor='gray' mode="text" onPress={()=>navigation.navigate('Calendar')} >
                    <Text style={textStyle}>   {date} </Text>
                </ReviewBtn>
            </View>
            <View style={{width:'94%', backgroundColor:'#EB2931', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16, height:49, marginHorizontal:16}}>
                <Image source={ARROW} style={{position:'absolute', zIndex:3, width:20, height:20, left:95, top:16 }}/>
                <SearchBtn contentStyle={{ height: 48, width:'100%' , justifyContent: 'center'}} style={{ backgroundColor:'#FF5A5F', borderBottomLeftRadius:16, borderBottomRightRadius:16, borderTopLeftRadius:16, borderTopRightRadius:16}} rippleColor='#ff373c' mode="text"
                           onPress={onSubmit}
                >
                    <SearchBtnText style={{fontFamily:'Inter_600SemiBold'}}>    {t('search')}</SearchBtnText>
                </SearchBtn>
            </View>

        </SearchSurface>
    );
}
