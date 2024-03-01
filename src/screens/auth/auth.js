import * as React from 'react';
import { Button } from 'react-native-paper';
import {BtnTextAuth, ContainerMid, LgnText, Logo, RedBtn, Title} from "../../styles/styles";
export default function AuthScreen({ navigation }) {
    return (
        <ContainerMid>
            <Logo source={require("../../../assets/img/logos.png")}/>
            <Title>Sample Text Here For Display Will Be Replaced!</Title>
            <RedBtn buttonColor='#FF5A5F' mode="contained" onPress={() => navigation.navigate('Register_login', { screenMode: 'Register' })}>
                <BtnTextAuth>Register</BtnTextAuth>
            </RedBtn>
                <Button  mode="text" rippleColor='transparent'  textColor='#FF5A5F' onPress={() => navigation.navigate('Register_login',{ screenMode : 'Login' })}>
                    <LgnText>Login</LgnText>
                </Button>
        </ContainerMid>
    );
}



