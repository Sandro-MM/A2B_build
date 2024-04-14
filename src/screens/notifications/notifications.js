import {FlatList, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import * as React from "react";
import {DelApi, getAccessToken, GetApi, headersTextToken, OrderEndpoints} from "../../services/api";
import {useEffect, useState} from "react";
import {
    BtnTextAuth,
    ContainerTop,
    ErrorText,
    ErrorView,
    RedBtn, Subtitle,
    XIcon
} from "../../styles/styles";
import Loading from "../../components/loading";
import {IconButton} from "react-native-paper";
import LoadingSmall from "../../components/loading-small";
import Navigation from "../../components/navigation";
import DeleteConfirmationModal from "../../components/modal";
import {useTranslation} from "react-i18next";
import * as SecureStore from "expo-secure-store";

export default function Notifications({navigation}) {
    const { t } = useTranslation();
    const [responseData, setResponseData] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isEndOfItems, setIsEndOfItems] = useState(false);
    const [activeColor, setActiveColor] = useState(1);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isDelModalVisible, setDelModalVisible] = useState(false);
    const [ModalStatus, setModalStatus] = useState(null);
    const [error, setError] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(() => null);
    const showModal = (id,status) => {
        setModalVisible(true);
        setModalStatus({id:id, status:status})
    }
    const showDelModal = (messege, action) => {
        setModalMessage(messege)
        setConfirmAction(() => action)
        setDelModalVisible(true);
        setModalVisible(false);
    }
    const hideModal = () => setModalVisible(false);
    const hideDelModal = () => setDelModalVisible(false);

    const getStatusStyles = (statusName) => {
        switch (statusName) {
            case 'Waiting To Start':
                return { textColor: '#f79009', backgroundColor: '#fef0c7' };
            case 'Done':
                return { textColor: '#4ca30d', backgroundColor: '#d7ffb8' };
            case 'Cancelled':
                return { textColor: '#f04438', backgroundColor: '#fee4e2' };
            case 'Cancelled By System':
                return { textColor: '#667085', backgroundColor: '#d0d5dd' };
            case 'In Progress':
                return { textColor: '#0088cc', backgroundColor: '#c9eeff' };
            case 'Pending Completion':
                return { textColor: '#00ac89', backgroundColor: '#afeee1' };
            default:
                return { textColor: 'black', backgroundColor: 'white' }; // Default style
        }
    };

    const monthNames = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec',
    };

    const getFormattedDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = monthNames[date.getMonth() + 1];
        const year = date.getFullYear().toString().substr(-2);
        return `${day}/${month}/${year}`;
    };

    // useEffect(() => {
    //     fetchData(1, 15,1);
    // }, []);

    const renderItem = ({ item, index }) => (
        <TouchableHighlight style={{width:'100%'}} key={`${item.Id}_${index}`}
                            underlayColor="rgba(128, 128, 128, 0.5)"
                            onPress={()=>navigation.navigate('Order',{item:item.Id, navigation:navigation,  destination:'RideHistory'})}>

            <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'white', borderRadius:15, marginHorizontal:5, marginVertical:8}}>
                <Text style={{marginHorizontal:15, marginTop:10}}> {getFormattedDate(item.PickUpTime)}</Text>
                <View  style={{width:'100%', flexDirection:'row', height:60, justifyContent:'space-between'}}>
                    <Text style={{marginHorizontal:15, marginTop:30}}>{item.From || 'no item'}</Text>
                    <Text style={{marginHorizontal:15, marginTop:30}}>{item.To|| 'no item'}</Text>
                </View>
                <Text style={{
                    marginVertical:8,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 15,
                    color: getStatusStyles(item.Status.Name).textColor,
                    backgroundColor: getStatusStyles(item.Status.Name).backgroundColor
                }}>{item.Status.Name}</Text>
            </View>
        </TouchableHighlight>

    );

    const handleLoadMore = () => {
        console.log(responseData.Page)
        const maxPage = responseData.PageCount;
        console.log(maxPage)
        setIsLoadingMore(true);
        if (responseData.Page < maxPage-1) {
            const nextPage = responseData.Page + 1;
            fetchData(nextPage, 15)
                .finally(() => setIsLoadingMore(false));
        } else if (responseData.Page === maxPage-1) {
            fetchData(maxPage, 15)
                .finally(() => setIsLoadingMore(false));
            setIsEndOfItems(true);
        }
    };

    const toggleRideType =(number) =>{
        setResponseData(null)
        setActiveColor(number)
        fetchData(1, 15, number)
    }


    const fetchData = async (page, offset, type) => {
        try {
            const accessToken = await getAccessToken();
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await GetApi(`${OrderEndpoints.get.userOrders}?Page=${page}&Offset=${offset}&sortingField=PickUpTime&sortDirection=1&MyOrderTypes=${type}`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setResponseData(prevData => {
                if (page > 1) {
                    return {
                        ...prevData,
                        Data: [...prevData.Data, ...fetchedData.Data],
                        Page: fetchedData.Page
                    };
                } else {
                    const newData = fetchedData;
                    const isLastPage = newData.PageCount === 1;
                    setIsEndOfItems(isLastPage);
                    return newData;
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteOrder = async (id) =>{
        const accessToken = await getAccessToken();
        try{
            const fetchedData = await DelApi(`${OrderEndpoints.delete.cancelOrder}${id}/cancel-order?id=${id}&`, {
                headers: {
                    ...headersTextToken.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        }
        setResponseData(null)
        setModalVisible(false)
        fetchData(1, 15, 1);
    }
    const startOrder = async (id) =>{
        const accessToken = await getAccessToken();
        console.log(id)
        try{
            const language = await SecureStore.getItemAsync('userLanguage');
            const fetchedData = await GetApi(`${OrderEndpoints.get.startOrder}${id}&`, {
                headers: {
                    'Accept-Language': language,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }catch (error){
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        }
        setResponseData(null)
        setModalVisible(false)
        fetchData(1, 15, 1);
    }



    return (
        <View style={{flex:1}}>
            { responseData ?
                <ContainerTop>
                    <View style={{width:'100%', height:50, backgroundColor:'white', marginTop:35, flexDirection:'row'}}>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===1?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.5)"
                            onPress={() => toggleRideType(1)}>

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'black',fontSize:18, fontWeight:'500', marginTop:8}}>{t('notifications')}</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===2?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.5)">

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center',alignItems:'center', marginTop:8}}>
                                <Text style={{color:'black', fontSize:18, fontWeight:'500'}}>{t('chat')}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <FlatList
                        style={{width:'100%', marginBottom:50}}
                        data={responseData.Data}
                        renderItem={renderItem}
                        ListFooterComponent={() => (
                            <View style={{width:'100%', height:60, justifyContent:'center', alignItems:'center', marginTop:30}}>
                                {isLoadingMore && <LoadingSmall />}
                                {(!isLoadingMore && !isEndOfItems) && (
                                    <RedBtn
                                        style={{ position: 'absolute', bottom: 0, width:180 }}
                                        buttonColor='#FF5A5F'
                                        mode="contained"
                                        onPress={handleLoadMore}
                                    >
                                        <BtnTextAuth>{t('load_more')}</BtnTextAuth>
                                    </RedBtn>
                                )}
                            </View>
                        )}
                        keyExtractor={(item) => item.Id.toString()}
                    />
                </ContainerTop> : <Loading/>
            }
            {error && <ErrorView style={{marginBottom:50}}>
                <ErrorText>{error}</ErrorText>
                <XIcon
                    icon="window-close"
                    iconColor='#FFF'
                    size={20}
                    onPress={() => setError(null)}
                />
            </ErrorView>}
            <Navigation navigation={navigation} activeButton={'Notifications'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
