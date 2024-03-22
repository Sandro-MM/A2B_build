import {FlatList, Text, TouchableHighlight, TouchableWithoutFeedback, View} from 'react-native';
import * as React from "react";
import {accEndpoints, getAccessToken, GetApi} from "../../services/api";
import {useEffect, useRef, useState} from "react";
import {
    AboutMe, Agreement,
    BtnTextAuth,
    ContainerTop,
    RedBtn, ReviewBtn, SurfaceArea,
} from "../../styles/styles";
import Loading from "../../components/loading";
import {Icon} from "react-native-paper";
import LoadingSmall from "../../components/loading-small";
import DeleteConfirmationModal from "../../components/modal";
import {formatDate} from "date-fns";

export default function RatingsSetting(props) {
    const [responseData, setResponseData] = useState(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isEndOfItems, setIsEndOfItems] = useState(false);
    const [activeColor, setActiveColor] = useState(1);
    const [visibleItemIndex, setVisibleItemIndex] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const aboutMeRefs = useRef([]);

    const showDeleteModal = (index) => {
        setVisibleItemIndex(index);
        const lines = aboutMeRefs.current[index];
        if (lines > 3) {
            setIsModalVisible(true);
        } else {
            setIsModalVisible(false);
        }
    };

    const hideModal = () => {
        setVisibleItemIndex(null);
        setIsModalVisible(false);
    };

    const handleAboutMeLayout = (event, index) => {
        const { lines } = event.nativeEvent;
        aboutMeRefs.current[index] = lines.length;
    };




    useEffect(() => {
        fetchData(1, 15,1);
    }, []);

    const renderItem = ({ item, index }) => (
            <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'white', borderRadius:15, marginHorizontal:5, marginVertical:8}}>

                <TouchableWithoutFeedback onPress={() => showDeleteModal(index)}>
                    <SurfaceArea style={{ paddingTop: 15 }}>
                        <AboutMe                       onTextLayout={(event) => handleAboutMeLayout(event, index)}
                                                       style={{lineHeight:18}} numberOfLines={3} ellipsizeMode="tail">{item.Review}</AboutMe>
                        <View style={{ width: '100%' }}>
                            <ReviewBtn contentStyle={{ height: 36, justifyContent: 'flex-start' }} mode="text">
                                <Icon
                                    source="star"
                                    color='#FF5A5F'
                                    size={18}
                                />
                                <AboutMe>  {item.StarCount}    </AboutMe>
                            </ReviewBtn>
                            <AboutMe style={{ position: 'absolute', left: '75%', top: 8 }}> {formatDate(item.CreateDate)}</AboutMe>
                        </View>
                        {visibleItemIndex === index && isModalVisible && (
                            <DeleteConfirmationModal isVisible={true} onCancel={hideModal}>
                                <Agreement> {item.Review}</Agreement>
                            </DeleteConfirmationModal>
                        )}
                    </SurfaceArea>
                </TouchableWithoutFeedback>
            </View>
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

            const ulr = type === 1?  accEndpoints.get.UserReview : accEndpoints.get.UserSendReview

            const fetchedData = await GetApi(`${ulr}?Page=${page}&Offset=${offset}&sortingField=PickUpTime&sortDirection=1&MyOrderTypes=${type}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setResponseData(prevData => {
                if (page > 1) {
                    console.log(responseData?.RatingReceived[Data],'setResponseData')
                    return {
                        ...prevData,
                        Data: [...prevData.Data, ...fetchedData.Data],
                        Page: fetchedData.Page
                    };
                } else {
                    const newData = fetchedData;
                    const isLastPage = newData.PageCount === 1;
                    setIsEndOfItems(isLastPage);
                    console.log(responseData?.RatingReceived[Data],'setResponseData')
                    return newData;
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };



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
                                <Text style={{color:'black',fontSize:18, fontWeight:'500', marginTop:8}}>My rating</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{flex:1, borderStyle:'solid', borderBottomWidth:2.2, borderBottomColor: activeColor===2?'#FF5A5F':'transparent'}}
                            underlayColor="rgba(128, 128, 128, 0.5)"
                            onPress={() =>toggleRideType(2)}>

                            <View
                                style={{flex:1, width:'100%', height:60, justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'black', fontSize:18, fontWeight:'500', marginTop:8}}>Rating given</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <FlatList
                        style={{width:'100%', marginBottom:50}}
                        data={responseData.RatingReceived}
                        renderItem={renderItem}
                        ListFooterComponent={() => (
                            <View style={{width:'100%', height:60, justifyContent:'center', alignItems:'center', marginTop:30}}>
                                {isLoadingMore && <LoadingSmall />}
                                {(!isLoadingMore && !isEndOfItems && responseData.length > 1) && (
                                    <RedBtn
                                        style={{ position: 'absolute', bottom: 0, width:180 }}
                                        buttonColor='#FF5A5F'
                                        mode="contained"
                                        onPress={handleLoadMore}
                                    >
                                        <BtnTextAuth>Load More</BtnTextAuth>
                                    </RedBtn>
                                )}
                            </View>
                        )}
                        keyExtractor={(item) => item.Id.toString()}
                    />
                </ContainerTop> : <Loading/>
            }
        </View>
    );
}
