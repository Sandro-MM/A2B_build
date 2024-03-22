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
    ListIconColorMapping,
    ListIconMapping, ListIconSizeMapping,
} from "../../styles/vehicleMappings";
import TicketIMage from "../../../assets/img/App_210_400.png"
import UserNoIMage from "../../../assets/img/default_user.png"
import BlueImage from "../../../assets/img/blue.png"
import GreenImage from "../../../assets/img/green.png"
import CarImage from "../../../assets/img/car-way.png"
import BeltImage from "../../../assets/img/seat-belt.png"
import {ListFilterModal} from "../../components/listFilterModal";
import {OrderListHeader} from "./orderListHeader";
export const  OrdersList = ({ navigation, data, setValue }) => {
    const [isModalVisible, setModalVisible] = useState(false);


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
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const renderItem = ({ item }) => (
        <View style={{ marginBottom: 20 }}>
            <Text style={{color:'#FF5A5F', textAlign:'center', fontSize:18, fontWeight:"500"}}>{formatDate(item.Date)}</Text>
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
            iconColor={ListIconColorMapping[id]}
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
        <SurfaceListItem style={styles.shadow}>
            <ImageBackground
                source={TicketIMage}
                style={{flex:1,width:'100%', height:210, zIndex:10}}
                resizeMode="stretch"
            >
            <View style={{alignItems: 'center',paddingHorizontal:0,paddingBottom:15}}>
                <View style={{flexDirection:'row' , paddingTop:15, justifyContent:'space-between'}}>
                    <ListPlaces>{item.Order.DepartureParent}</ListPlaces>
                    <View style={{width:'55%', flexDirection:'row', justifyContent:'center', marginTop:2}}>
                        <Image style={{marginTop:5}} source={BlueImage}/>
                        <Image style={{marginHorizontal:4}} source={CarImage}/>
                        <Image style={{marginTop:5}} source={GreenImage}/>
                    </View>
                    <ListPlaces>{item.Order.DestionationParent}</ListPlaces>
                </View>
                <Text style={{marginTop:3, backgroundColor:'rgba(165, 190, 0, 0.1)', paddingHorizontal:6 , paddingVertical:2 , borderRadius:15, color:'rgba(165, 190, 0, 1)'}}>{formatDuration(item.Order.Duration)} estimated</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between', width:'90%',marginTop:-6}}>
                    <ListTime>{formatTime(item.Order.PickUpTime)}</ListTime>
                    <ListTime>{formatTime(item.Order.ArrivalTime)}</ListTime>
                </View>

                <View style={{flexDirection:'row', width:'100%', marginTop:10 }}>
                    <View style={{position:'absolute' , bottom:10, left:16, flexDirection:'row'}}>
                        <Image style={{backgroundColor:beltColor(item.Order.SeatsLeft), width:24, height:24, borderRadius:12, marginTop:-1}} source={BeltImage}/>
                        <Text style={{fontSize:16, color:beltColor(item.Order.SeatsLeft)}}> {item.Order.SeatsLeft} Seats left</Text>
                    </View>
                    <View style={{flexDirection:'row',  justifyContent:'flex-end', width:'100%', marginLeft:'-8%', height:48}}>
                        {getOrderDescription(item.Order.OrderDescriptionTypes)}
                    </View>
                </View>
                <TouchableHighlight
                    onPress={()=>navigation.navigate('Profile',{IsUserOrder: item.UserStatus, userName:item.User.UserName})}
                    style={{ height:60, marginBottom:15, width:'100%', marginTop:13}}
                    underlayColor="rgba(128, 128, 128, 0.5)">
                <View style={{flexDirection:'row', height:60, width:'100%',  paddingHorizontal:20}}>
                    { item.User.ProfilePictureUrl !== null &&
                    <ListPic
                        source={{ uri: item.User.ProfilePictureUrl}}
                    />}
                    { item.User.ProfilePictureUrl == null &&
                        <ListPic
                            source={UserNoIMage}
                        />}
                    <View style={{ marginLeft:16}}>
                        <Text style={{fontSize:16}}>{item.User.FirstName} {item.User.LastName}</Text>
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
                    <Text style={{fontSize:28, position:'absolute' , bottom:15, right:20}}>₾{item.Order.OrderPrice}</Text>
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

    return (
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
           />

            <FlatList
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
        borderRadius: 13,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
        elevation: 5,
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




