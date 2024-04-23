import React, {useRef, useState} from 'react';
import {Animated, FlatList, Image, ImageBackground, Text, View, StyleSheet, TouchableHighlight} from "react-native";
import {
    Container,
    ListPic,
    ListPlaces,
    ListTime,
    SurfaceListItem,
} from "../../styles/styles";
import {IconButton} from "react-native-paper";
import {
    ListIconMapping, ListIconSizeMapping,
} from "../../styles/vehicleMappings";
import TicketIMage from "../../../assets/img/ticket.png"
import UserNoIMage from "../../../assets/img/default_user.png"
import BeltImage from "../../../assets/img/seat-belt.png"
import {ListFilterModal} from "../../components/listFilterModal";
import {OrderListHeader} from "./orderListHeader";
import {useTranslation} from "react-i18next";
import {NotoSans_500Medium, NotoSans_600SemiBold, useFonts} from "@expo-google-fonts/noto-sans";
export const  OrdersList = ({ navigation, data, setValue }) => {
    const { t } = useTranslation();
    const [isModalVisible, setModalVisible] = useState(false);

    let [fontsLoaded] = useFonts({
        NotoSans_600SemiBold, NotoSans_500Medium
    });


    console.log(data._formValues,'data')

    const startDay = data._formValues.startDay?.slice(2);
    const endDay = data._formValues.endDay?.slice(2);
    const startDateFormatted = startDay ? startDay : "Today";
    const endDateFormatted = endDay ? `/${endDay}` : "";

    const listValues = data._formValues.results.Orders.Data
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTextSize = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [50, 0],
        extrapolate: 'clamp',
    });


    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short'};
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const renderItem = ({ item }) => (
        <View style={{ marginBottom: 20 }}>
            <View style={{flexDirection:"row", alignItems:'center', justifyContent:'center'}}>
                <View style={{backgroundColor: '#EAECF0', width:'40%', height:1, marginRight:5, marginTop:2}}/>
                <Text style={{color:'#667085', textAlign:'center', fontSize:14,  fontFamily:'NotoSans_500Medium'}}>{formatDate(item.Date)}</Text>
                <View style={{backgroundColor: '#EAECF0', width:'40%', height:1,  marginLeft:5, marginTop:2}}/>
            </View>
            <FlatList
                data={item.Orders}
                renderItem={renderOrderItem}
                keyExtractor={(order, index) => index.toString()}
            />
        </View>
    );


        const formatTime = (timeString) => {
            const date = new Date(timeString);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        };

    const formatDuration = (durationInMinutes) => {
        const hours = Math.floor(durationInMinutes / 60);
        const minutes = Math.round(durationInMinutes % 60);
        return `${hours}h ${minutes}m`;
    };

    const getOrderDescription = (orderDescriptionTypes) => {
        return orderDescriptionTypes.map(type => <Icon key={type.Id} id={type.Id} />);
    };


    const Icon = ({ id }) => (
        <IconButton
            iconColor={'#667085'}
            style={{ marginRight: -15}}
            size={ListIconSizeMapping[id]}
            icon={ListIconMapping[id]}
        />
    );

    const beltColor = ( item ) => ( item > 1 ? '#0592FB' : 'red');

    const categoryContainerTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [50, 0],
        extrapolate: 'clamp',
    });

    const renderOrderItem = ({ item }) => (
        <TouchableHighlight onPress={()=>navigation.navigate('Order',{item:item.Order.Id, navigation:navigation, destination:'List'})}
                            underlayColor="rgba(128, 128, 128, 0.5)">
        <SurfaceListItem>
            <ImageBackground
                source={TicketIMage}
                style={{flex:1,width:'100%', height:260, zIndex:10}}
                resizeMode="stretch"
            >
            <View style={{alignItems: 'center',paddingHorizontal:0,paddingBottom:15}}>
                <Text style={{fontSize:28, position:'absolute' , top:16, right:16, lineHeight:38, fontFamily:'NotoSans_600SemiBold'}}>₾{item.Order.OrderPrice}</Text>
                <View style={{flexDirection:'row', marginTop:24, width:'100%'}}>
                    <View style={{marginTop:-7, marginLeft:'4.3%', height:103, justifyContent:'space-between', alignItems:'flex-end'}}>
                        <ListTime style={{fontFamily:'NotoSans_600SemiBold'}}>{formatTime(item.Order.PickUpTime)}</ListTime>
                        <ListTime style={{fontFamily:'NotoSans_600SemiBold'}}>{formatTime(item.Order.ArrivalTime)}</ListTime>
                    </View>
                    <View style={{marginTop:-12, marginLeft:'6.9%', height:112, justifyContent:'space-between'}}>
                        <ListPlaces style={{fontFamily:'NotoSans_600SemiBold'}}>{item.Order.DepartureParent}</ListPlaces>
                        <ListPlaces style={{fontFamily:'NotoSans_600SemiBold'}}>{item.Order.DestionationParent}</ListPlaces>
                    </View>
                    {/*<Text style={{marginTop:3, backgroundColor:'rgba(165, 190, 0, 0.1)', paddingHorizontal:6 , paddingVertical:2 , borderRadius:15, color:'rgba(165, 190, 0, 1)'}}>{formatDuration(item.Order.Duration)} {t('estimated')}</Text>*/}

                </View>


                <View style={{flexDirection:'row', width:'100%', marginTop:1 }}>
                    <View style={{position:'absolute' , bottom:6, left:20, flexDirection:'row'}}>
                        <Image style={{backgroundColor:beltColor(item.Order.SeatsLeft), width:22, height:22, borderRadius:12, marginTop:4}} source={BeltImage}/>
                        <Text style={{fontSize:16, fontFamily:'NotoSans_500Medium' , color:beltColor(item.Order.SeatsLeft)}}> {item.Order.SeatsLeft} Seats left</Text>
                    </View>
                    <View style={{flexDirection:'row',  justifyContent:'flex-end', width:'100%', marginLeft:'-8%', height:48}}>
                        {getOrderDescription(item.Order.OrderDescriptionTypes)}
                    </View>
                </View>
                <TouchableHighlight
                    onPress={()=>navigation.navigate('Profile',{IsUserOrder: item.UserStatus, userName:item.User.UserName})}
                    style={{ height:60, marginBottom:15, width:'100%', marginTop:13}}
                    underlayColor="rgba(128, 128, 128, 0.5)">
                <View style={{flexDirection:'row', height:60, width:'100%',  paddingHorizontal:20, marginTop:10}}>
                    { item.User.ProfilePictureUrl !== null &&
                    <ListPic
                        source={{ uri: item.User.ProfilePictureUrl}}
                    />}
                    { item.User.ProfilePictureUrl == null &&
                        <ListPic
                            source={UserNoIMage}
                        />}
                    <View style={{ marginLeft:16, marginTop:-5}}>
                        <Text style={{fontSize:16, color:'#344054', fontFamily:'NotoSans_500Medium'}}>{item.User.FirstName} {item.User.LastName}</Text>
                        <View style={{flexDirection:'row', marginTop:3}}>
                            <Text style={{fontSize:18}}>
                                {item.User.Rating}  </Text>
                            <IconButton
                                style={{marginTop:-8, marginLeft:-12}}
                                iconColor='#FDB022'
                                size={25}
                                icon='star'
                            />
                        </View>

                    </View>

                </View>
                </TouchableHighlight>
            </View>
            </ImageBackground>
        </SurfaceListItem>
        </TouchableHighlight>
    );

    const closeModal = () => {
        setModalVisible(false)
    }

  if (fontsLoaded)  return (
        <Container style={{paddingTop:0}}>
            { isModalVisible &&
            <ListFilterModal
                state = {isModalVisible}
                close={closeModal}
                setValue={setValue}
                control={data}
                going={data._formValues.destination}
                leaving={data._formValues.departure}
                date={`${startDateFormatted}${endDateFormatted}`}
                navigation={navigation}
                isVisible={isModalVisible}
            />}

           <OrderListHeader
               departure={data._formValues.departure}
               destination={data._formValues.destination}
               OrdersTotalCount= {data._formValues.results.OrdersTotalCount}
               navigation={navigation}
               scrollY={scrollY}
               setModalVisible={() => setModalVisible(true)}
               startDay={data._formValues.startDay}
               endDay={data._formValues.endDay}
           />

            <FlatList
                style={{marginTop:12}}
                scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                showsVerticalScrollIndicator={false}
                data={listValues}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </Container>
    );
};

const styles = StyleSheet.create({
    shadow:{
        // borderRadius: 13,
        // overflow: 'hidden',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.7,
        // shadowRadius: 6,
        // elevation: 5,
    },
    divider:{
        width: '110%',
        height:0.9,
        backgroundColor: '#e5e5e5'
    },
    categoryText:{
        position:'absolute',
        bottom:15,
        right:28,
        fontWeight:'600',
        color:'#667085'
    },
    categoryIcon: {
        marginTop:-19,
        width:80,
        height:50,
        paddingTop:10,
        borderRadius:0,
        paddingRight:10
    },
    categoryTitle:{
        fontWeight:'600',
        color:'#667085'
    },
    categoryContainer: {
        width:'100%',
        backgroundColor:'#fff',
        marginTop:-10,
        flexDirection:'row',
        overflow:'hidden'
    }


})




