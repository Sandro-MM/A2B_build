import * as React from 'react';
import {BackHandler} from 'react-native';
import { ContainerMid, Logo, TitleLeft} from "../../styles/styles";
import {useEffect} from "react";
import {Icon} from "react-native-paper";

export default function Confirm_password_change({ navigation }) {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                navigation.navigate('AuthScreen');
                return true;
            }
        );
        return () => backHandler.remove();
    }, [navigation]);
    return (
        <ContainerMid>
            <Logo source={require("../../../assets/img/logos.png")} />
            <TitleLeft>Your password was changed.</TitleLeft>
            <Icon
                source="checkbox-marked-circle-outline"
                color='#FF5A5F'
                size={100}
            />
        </ContainerMid>
    );
}
