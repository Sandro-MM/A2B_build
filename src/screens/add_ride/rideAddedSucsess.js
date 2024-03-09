import React from 'react';
import {BtnTextAuth, ContainerTop, RedBtn, Title} from "../../styles/styles";
import {Icon} from "react-native-paper";

export const RideAddedSucsess = ({ navigation }) => {
    return (
        <ContainerTop>
            <Title> Your ride is created!</Title>
            <Icon
                source="checkbox-marked-circle-outline"
                color='#7a7a7a'
                size={100}
            />
            <RedBtn
                style={{position:'absolute', bottom:70, width:90}}
                buttonColor='#FF5A5F'
                mode="contained"
                onPress={() => navigation.navigate('RideHistory')}
            >
                <BtnTextAuth>Ok</BtnTextAuth>
            </RedBtn>
        </ContainerTop>
    );
};


