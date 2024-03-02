import React, {useState} from 'react';
import {IconButton} from "react-native-paper";
import {ContainerMid, Title} from "../../styles/styles";
import {Text, View} from "react-native";
import A2BNextIcon from "../../components/next_icon";
const PassengerCount = ({ navigation , setValue , control }) => {

    let [count, setCount] = useState(0);


    const decrementCount = () => {
        if (count > 0) {
            setCount(count =>{
                return count - 1
            });
        }
    };

    const incrementCount = () => {
        if (count < 5) {
            setCount(count =>{
                return count + 1
            });
        }
    };

    const nav = () => {
            setValue('passengerCount',count)
            navigation.navigate("Price")
    };

    return (
        <ContainerMid>
            <IconButton
                style={{ position: 'absolute', top: 60, left: 0, zIndex: 3 }}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <Title>How many passengers are you willing to take</Title>
            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-around'}}>
            <IconButton
                icon="minus-circle-outline"
                iconColor='#FF5A5F'
                size={80}
                onPress={decrementCount}
            />
                <Text style={{fontSize:60, marginTop:10}}>{count}</Text>
            <IconButton
                icon="plus-circle-outline"
                iconColor='#FF5A5F'
                size={80}
                onPress={incrementCount}
            />
            </View>
            <A2BNextIcon onPress={nav}/>
        </ContainerMid>
    );
};

export default PassengerCount;
