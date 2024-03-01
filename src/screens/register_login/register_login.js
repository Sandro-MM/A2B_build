import { View } from 'react-native';
import * as React from 'react';
import { Divider, Icon} from 'react-native-paper';
import {Agreement, BtnText, Container, Link, SimpleBtn, Subtitle, SubtitleLink, Title} from "../../styles/styles";

export default function Register_login(props) {
    const screenMode = props.route.params.screenMode;
    const handleSwitchMode = () => {
        const newScreenMode = screenMode === 'Register' ? 'Login' : 'Register';
        props.navigation.navigate('Register_login', { screenMode: newScreenMode });
    };

    const handleButtonPress = () => {
        const nextScreen = screenMode === 'Register' ? 'Register_form' : 'Login_form';
        props.navigation.navigate(nextScreen, { screenMode: screenMode });
    };
    return (
        <Container>
            <Title>{screenMode === 'Register' ? 'Create a New Account' : 'Welcome Back!'}</Title>
            <SimpleBtn contentStyle={{ height: 55, justifyContent: 'flex-start'}} rippleColor='gray' mode="text" onPress={() => handleButtonPress()}>
                <Icon
                    source="email-outline"
                    color='#F2F3F4'
                    size={28}
                />
                <Icon
                    source="email-outline"
                    color='#1B1B1B'
                    size={24}
                /> <BtnText>Continue with Email</BtnText>
                <Icon
                    source="chevron-right"
                    color='#1B1B1B'
                    size={24}
                />
            </SimpleBtn>
            <Divider horizontalInset={true} bold={true}  />
            <SimpleBtn contentStyle={{ height: 55, justifyContent: 'flex-start'}}  rippleColor='gray' mode="text" onPress={() => console.log('Fb')}>
                <Icon
                    source="email-outline"
                    color='#F2F3F4'
                    size={28}
                />
                <Icon
                    source="facebook"
                    color='#1B1B1B'
                    size={24}
                />
                <BtnText>Continue with Facebook</BtnText>
                <Icon
                    source="chevron-right"
                    color='#1B1B1B'
                    size={24}
                />
            </SimpleBtn>
            <Subtitle>{screenMode === 'Register' ? 'Already a member?' : 'Not a member yet?'}</Subtitle>
            <SubtitleLink  onPress={() => handleSwitchMode()}>{screenMode === 'Register' ? 'Login' : 'Register'}</SubtitleLink>
            <View>{screenMode === 'Register' ?
                <Agreement>By signing up you agree to our <Link>policy</Link> text will be updated for referance text will be updated for referance text will be updated for referance text will be updated for referance text will be updated for referance!!!</Agreement>
                : null}</View>
        </Container>
    );
}

