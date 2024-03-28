import React, {useEffect, useState} from 'react';
import {IconButton} from "react-native-paper";
import {ContainerMid, Title} from "../../styles/styles";
import { getAccessToken, GetApi, headersTextToken, OrderEndpoints} from "../../services/api";
import {Text, View} from "react-native";
import {useTranslation} from "react-i18next";

const RidePrice = ({ distance, navigation , setValue , control }) => {
    const { t } = useTranslation();
    const greenPrice = 5;
    const greenCoef = 0.6;
    const redPrice = 0.9;
    const decrementCount = () => {
        if (val > 0) {
            setVal(count =>{
                return count - 1
            });
        }
        setValue('RidePrice',val)
    };
    const incrementCount = () => {
        if (val < responseData.MaxPrice) {
            setVal(count =>{
                return count + 1
            });
            setValue('RidePrice',val)
        }
    };

    const [responseData, setResponseData] = useState({"MaxPrice": 5} );
    const [val, setVal] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = await getAccessToken();
                    const responseData = await GetApi(`${OrderEndpoints.get.maxPrice}?orderDistance=${distance}&`, {
                        headers: {
                            ...headersTextToken.headers,
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

    const setPriceVal = (value) =>{
        setValue('RidePrice',value)
        setVal(value)
        console.log(val,'123')
    }

    return (
        <ContainerMid>
            <IconButton
                style={{ position: 'absolute', top: 60, left: 0, zIndex: 3 }}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title>{t('set_your_price_per_seat')}</Title>

            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
                <IconButton
                    icon="minus-circle-outline"
                    iconColor='#FF5A5F'
                    size={80}
                    onPress={decrementCount}
                />
                <Text style={{fontSize:60, marginTop:10}}>₾ {val}</Text>
                <IconButton
                    icon="plus-circle-outline"
                    iconColor='#FF5A5F'
                    size={80}
                    onPress={incrementCount}
                />
            </View>

            {responseData && (
                <Text style={{
                    backgroundColor: val <= (greenCoef * responseData.MaxPrice || greenPrice)  ? '#65CA18' :
                        (val >= redPrice * responseData.MaxPrice ? '#F04438' : '#F79009'),
                    fontSize:16,
                    color: 'white',
                    paddingHorizontal:10,
                    paddingVertical:5,
                    borderRadius:30
                }}>
                    Recommended Price: 0 - {responseData.MaxPrice * 0.6}
                </Text>
            )}

        </ContainerMid>
    );
};

export default RidePrice;
