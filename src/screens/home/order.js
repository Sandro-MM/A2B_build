import {Image, Text, TouchableHighlight, View} from 'react-native';
import {
    AboutMe,
    Container, ErrorText, ErrorView,
    ListPic,
    SmallBtnText, XIcon,
} from "../../styles/styles";
import { getAccessToken, GetApi, OrderEndpoints, PostApi} from "../../services/api";
import {useEffect, useState} from "react";
import UserNoIMage from "../../../assets/img/default_user.png";
import {Button, Divider, IconButton} from "react-native-paper";
import {
    colorMapping,
     OrderIconColorMapping, OrderIconMapping,
    vehicleTypeMapping
} from "../../styles/vehicleMappings";
import Loading from "../../components/loading";
import CarImage from "../../../assets/img/car-vertical.png";
import BlueImage from "../../../assets/img/blue-big.png";
import GreenImage from "../../../assets/img/green-big.png";
export default function Order({route}) {



    const { item } = route.params;
    const { navigation } = route.params;
    const [data, setResponseData] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await getAccessToken();
                    const responseData = await GetApi(`${OrderEndpoints.get.order}?orderId=${item}&`, {
                        headers: {

                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setResponseData(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);



    const onSubmit = async () => {
        try {
            const accessToken = await getAccessToken();
            const orderId = await PostApi(`${OrderEndpoints.post.order}${item}/order-bind`, null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(orderId)
            if (orderId){
                try {
                } catch (error) {
                    console.error('Error', error);
                }
            }
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {

        }
    };



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

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    const getOrderDescription = (orderDescriptionTypes) => {
        return orderDescriptionTypes.map(type => <Icon key={type.Id} id={type} />);
    };


    const Icon = ({ id }) => (
        <View style={{flexDirection:'row', height:25, marginTop:0, marginBottom:0, width:'50%'}}>
            <IconButton
                style={{marginTop:0, marginBottom:0, height:20}}
                iconColor={OrderIconColorMapping[id.Id]}
                size={20}
                icon={OrderIconMapping[id.Id]}
            />
            <Text style={{fontSize:14, color:'#667085'}}>{id.Name}</Text>
        </View>

    );


    return (
        <Container>
            { data &&
            <View style={{marginHorizontal:16, flex:1, paddingTop:'0.5%'}}>
                <IconButton
                    style={{position:'absolute', top: -4, left:0, zIndex:3}}
                    icon="arrow-left"
                    iconColor='#7a7a7a'
                    size={32}
                    onPress={() => navigation.navigate('List')}
                />
                <Text  style={{textAlign:'center', fontSize:22, fontWeight:'500', marginVertical:'2%'}}>{formatDate(data.PickUpTime)}</Text>
                <View style={{backgroundColor:'#FFF', paddingTop:25, paddingBottom:16, paddingHorizontal:20, borderRadius:13}}>
                    <View style={{flexDirection:'row'}}>
                        <View>
                            <Image style={{marginLeft:5, height:18, width:18}} source={BlueImage}/>
                            <Image style={{marginVertical:10, height:76, width:29}} source={CarImage}/>
                            <Image style={{marginLeft:5,  height:18, width:18}} source={GreenImage}/>
                        </View>
                        <View style={{ justifyContent:'space-between', marginLeft:20, marginTop:-10, marginBottom:-10}}>
                            <View>
                                <Text style={{fontSize:18, fontWeight:'600'}}>{data.DepartureParent}</Text>
                                <Button
                                    style={{position:'absolute', right:0, top:-5}}
                                    onPress={()=> navigation.navigate('MapPointViewScreen',{title:'Departure', startPoint:{latitude: data.DepartureLatitude, longitude: data.DepartureLongitude}, startAddress:data.Departure})}>
                                    <Text> View</Text>
                                </Button>
                            </View>

                            <Text style={{ position:'absolute' , top:40, fontSize:15, fontWeight:'500'}}>{formatTime(data.PickUpTime)}</Text>
                            <Text style={{marginTop:0, backgroundColor:'rgba(165, 190, 0, 0.1)', paddingHorizontal:6 , paddingVertical:2 , borderRadius:15, color:'rgba(165, 190, 0, 1)', fontSize:15, width:135}}>{formatDuration(data.Duration)} estimated</Text>
                            <View style={{ justifyContent:'space-between', marginLeft:0, marginTop:-10, marginBottom:10}}>
                            <Text style={{fontSize:18, fontWeight:'600'}}>{data.DestinationParent}</Text>
                                <Button
                                    style={{position:'absolute', right:0, top:-5}}
                                    onPress={()=> navigation.navigate('MapPointViewScreen',{title:'Destination', startPoint:{latitude: data.DestinationLatitude, longitude: data.DestinationLongitude}, startAddress:data.Destination})}>
                                <Text> View</Text>
                            </Button>
                            </View>
                        </View>
                    </View>

                    <Text style={{marginTop:20, backgroundColor:'rgba(147,147,147,0.1)', paddingHorizontal:6 , paddingVertical:2 , borderRadius:15, color:'#667085', fontSize:15, width:160, marginBottom:'2%'}}> Distance {data.Distnace} Km</Text>

                    <View style={{ flexDirection:'row', justifyContent:'space-between'}}>
                        <View  style={{width:'101%', height:1, backgroundColor:'transparent', borderColor:'#667085', borderBottomWidth:1, borderStyle:'dashed', position:'absolute', top:'50%', marginLeft:2}}></View>
                        <View style={{width:20, height:30, backgroundColor:'#F2F3F4', borderTopRightRadius:15, borderBottomRightRadius:15, marginLeft:-20,}}/>
                        <View style={{width:20, height:30, backgroundColor:'#F2F3F4', borderTopLeftRadius:15, borderBottomLeftRadius:15, marginRight:-20,}}/>
                    </View>


                    <View style={{justifyContent:'space-between', flexDirection:'row', marginTop:'1%'}}>
                        <Text style={{fontSize:20, fontWeight:'500', color:'#667085'}}>
                            Price per passenger
                        </Text>
                        <Text style={{fontWeight:'600', fontSize:22}}>
                            ₾ {data.Price}
                        </Text>
                    </View>
                </View>
                <Text style={{fontSize:20, fontWeight:'500', color:'#667085', marginTop: '3%', marginLeft:16}}>
                    About Driver
                </Text>
                <TouchableHighlight
                    style={{ marginVertical:'1%'}}
                    onPress={()=>navigation.navigate('Profile',{IsUserOrder: data.IsUserOrder, userName:data.User.UserName})}
                    underlayColor="rgba(128, 128, 128, 0.5)"
                >
                <View style={{flexDirection:'row',  marginLeft:16, height:60, alignItems:'center'}}>
                    { data.User.FileDownloadUrl !== null &&
                        <ListPic
                            source={{ uri: data.User.FileDownloadUrl}}
                        />}
                    { data.User.FileDownloadUrl == null &&
                        <ListPic
                            source={UserNoIMage}
                        />}
                    <View style={{ marginLeft:16,marginTop:10}}>
                        <Text style={{fontSize:16}}>{data.User.FirstName} {data.User.LastName}</Text>
                        <View style={{flexDirection:'row', marginTop:"1.2%"}}>
                            <Text style={{fontSize:18}}>
                                {data.User.StarRatingAmount}  </Text>
                            <IconButton
                                style={{marginTop:-8, marginLeft:-12}}
                                iconColor='#FDB022'
                                size={25}
                                icon='star'
                            />
                            <Text style={{fontSize:18}}>
                                {data.User.PhoneNumber}  </Text>
                        </View>
                    </View>
                    <IconButton
                        style={{width:35, height:35, position:'absolute', top:6,right:0}}
                        color='#1B1B1B'
                        size={35}
                        icon={'chevron-right'}
                    />
                </View>
                </TouchableHighlight>
                <AboutMe style={{ marginLeft:16}}  numberOfLines={3} ellipsizeMode="tail">
                    {data?.Description || 'Empty'}
                </AboutMe>
                <Divider style={{ width: '90%', marginBottom:'2%'}} horizontalInset={true} bold={true} />
                <View style={{flexDirection:'row'}}>
                    <IconButton
                        style={{width:35, height:35}}
                        color='#1B1B1B'
                        size={35}
                        icon={vehicleTypeMapping[data?.UserOrderCar?.CarType] || 'car-side'}
                    />
                    <View>
                        <Text style={{fontSize:15}}>{data?.UserOrderCar?.Manufacturer.Name} {data?.UserOrderCar?.Model.Name}</Text>
                        <Text style={{fontSize:14, color:'#667085'}}>{data?.UserOrderCar?.Color.Name} </Text>
                        <IconButton
                            style={{ width:16, height:16, position:'absolute', bottom:3, right:0}}
                            iconColor={colorMapping[data?.UserOrderCar?.Color.Id]}
                            size={16}
                            icon='circle'
                        />
                    </View>
                </View>
                <Divider style={{ width: '90%', marginBottom:10}} horizontalInset={true} bold={true} />
                <View  style={{ width:'100%', flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                    {getOrderDescription(data.OrderDescriptionTypeIds)}
                </View>
                { data.UserStatus === 0 &&
                <Button style={{height: 40, paddingTop: 3, borderRadius: 30, width: '40%', position:'absolute', bottom:'2%', left:'30%'}} buttonColor='#FF5A5F' mode='contained' onPress={onSubmit}>
                    <SmallBtnText style={{fontSize: 20, textAlign: 'center'}}>Ride!</SmallBtnText>
                </Button>}
                { data.UserStatus === 1 &&
                    <Button style={{height: 40, paddingTop: 3, borderRadius: 30, width: '50%', position:'absolute', bottom:'2%', left:'30%'}} buttonColor='#FF5A5F' mode='contained' onPress={()=>console.log(2)}>
                        <SmallBtnText style={{fontSize: 20, textAlign: 'center'}}>Cancel Order</SmallBtnText>
                    </Button>}
                { data.UserStatus === 2 &&
                    <Button style={{height: 40, paddingTop: 3, borderRadius: 30, width: '50%', position:'absolute', bottom:'2%', left:'30%'}} buttonColor='#FF5A5F' mode='contained' onPress={()=>console.log(3)}>
                        <SmallBtnText style={{fontSize: 20, textAlign: 'center'}}>Cancel Ride</SmallBtnText>
                    </Button>}
            </View>
            }
            {
                data == null  &&  <Loading/>
            }
            {error !== null && <ErrorView>
                <ErrorText>{error}</ErrorText>
                <XIcon
                    icon="window-close"
                    iconColor='#FFF'
                    size={20}
                    onPress={() => setError(null)}
                />
            </ErrorView>}
        </Container>
    );
}
