import { View } from 'react-native';
import * as React from 'react';
import { Divider, Icon} from 'react-native-paper';
import {Agreement, BtnText, Container, Link, SimpleBtn, Subtitle, SubtitleLink, Title} from "../../styles/styles";
import {useTranslation} from "react-i18next";

export default function Register_login(props) {
    const { t } = useTranslation();
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
            <Title>{t(screenMode === 'Register' ? 'create_new_acc' : 'welcome_back')}</Title>
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
                /> <BtnText>{t('c_with_email')}</BtnText>
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
                <BtnText>{t('c_with_fb')}</BtnText>
                <Icon
                    source="chevron-right"
                    color='#1B1B1B'
                    size={24}
                />
            </SimpleBtn>
            <Subtitle>{t(screenMode === 'Register' ? 'alr_member' : 'n_member_yet')}</Subtitle>
            <SubtitleLink  onPress={() => handleSwitchMode()}>{t(screenMode === 'Register' ? 'login' : 'register')}</SubtitleLink>
            <View>{screenMode === 'Register' ?
                <Agreement>{t("agree")} <Link>{t('agree_link')}</Link> {t('agree_text')}</Agreement>
                : null}</View>
        </Container>
    );
}

