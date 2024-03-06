import React from 'react';
import {Button, IconButton} from "react-native-paper";
import {View} from "react-native";
import {ContainerMid, Title} from "../styles/styles";
import styled from "styled-components/native";
import {registerTranslation, TimePickerModal} from "react-native-paper-dates";
import A2BNextIcon from "./next_icon";

registerTranslation('en', {
    save: 'Save',
    close: 'Close',
    minute: 'Minute',
    hour: 'Hour'
})
const TimePicker = ({ setValue, navigation }) => {
    const [time, setTime] = React.useState('11:00');
    const [visibleTime, setVisibleTime] = React.useState(false)

    const onDismissTime = React.useCallback(() => {
        setVisibleTime(false)
    }, [setVisibleTime])


    const onConfirmTime = React.useCallback(
        ({ hours, minutes }) => {
            setVisibleTime(false);
            const formatedMinutes = minutes < 10 ? `0${minutes}` : minutes
            setTime(hours + ':'+ formatedMinutes)


        },
        [setVisibleTime]
    );

    const handlePress = () => {
        setValue('time', time);
        navigation()
    };

    return (
        <ContainerMid>
           <Title>At what time will you pick passengers up? </Title>
            <View style={{width:'100%', alignItems:'center'}}>
            <TimeBtn
                buttonColor='transparent'
                mode="outlined"
                textColor='black'
                onPress={()=> setVisibleTime(true)}
            >
                <TimeText>{time}</TimeText>
            </TimeBtn>
            <IconButton
                style={{position:'absolute',right:60,top:3, zIndex:-1}}
                icon="chevron-down"
                iconColor='#FF5A5F'
                size={30}
            />
        </View>

            <TimePickerModal
                use24HourClock={true}
                visible={visibleTime}
                onDismiss={onDismissTime}
                onConfirm={onConfirmTime}
                hours={12}
                minutes={14}
            />
            <View style={{position:'absolute', zIndex:3, bottom:0, right:0}}>
                <A2BNextIcon onPress={handlePress}/>
            </View>
        </ContainerMid>
    );
};

export default TimePicker;

const TimeBtn = styled(Button)`
  padding-top: 8px;
  height: 65px;
  border-radius: 35px;
  width: 70%;
`;
const TimeText = styled.Text`
    height: 30px;
    line-height: 44px;
    font-size: 33px;
    text-align: center;
    font-weight: 600;
`;
