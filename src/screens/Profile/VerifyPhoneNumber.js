import React, {useEffect, useState} from 'react';
import {Controller, useForm,} from 'react-hook-form';


import {
    Agreement,
    ContainerTop,
    ErrorText,
    ErrorView,
    LinkLogin,
    SmallBtnText,
    SmallRedBtn,
    TitleLeft, XIcon
} from "../../styles/styles";
import A2bInput from "../../components/formInput";
import {IconButton} from "react-native-paper";
import {
    accEndpoints,
    getAccessToken,
    headersTextToken,
    PatchApi,
    PostApi
} from "../../services/api";
import {Keyboard, Text, View} from "react-native";
import Loading from "../../components/loading";
import {useTranslation} from "react-i18next";

const VerifyPhoneNumber = (props) => {
    const { t } = useTranslation();
    const { control, handleSubmit, watch,reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const phoneNumber = props.route.params.phoneNumber;
    const nav = props.route.params.nav;

    const [seconds, setSeconds] = useState(60);
    const [isRunning, setIsRunning] = useState(false);


    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds === 0) {
                        clearInterval(interval);
                        // Handle countdown completion here
                        setIsRunning(false); // Optionally stop the timer here
                    } else {
                        return prevSeconds - 1;
                    }
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const startCountdown = () => {
        setSeconds(60);
        setIsRunning(true);
    };




    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const accessToken = await getAccessToken();
            const responseData = await PostApi(accEndpoints.post.VerifyPhone,null ,{
                headers: {
                    ...headersTextToken.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            startCountdown()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    async function onSubmit(data) {
        console.log(data.confirmationCode,'data.confirmationCode')
        setError(null);
        setLoading(true);
        Keyboard.dismiss();
        reset();
        try {
            const accessToken = await getAccessToken();
                const responseData = await PatchApi(`${accEndpoints.patch.ConfirmPhone}?confirmationCode=${data.confirmationCode}`, null, {
                    headers: {
                        Accept: '*/*',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                    props.navigation.navigate(nav)
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
            console.error('Error submitting data:', error);
        } finally {
            setLoading(false);

        }
    }


    return (
<>
        {loading && <Loading />}
    {!loading && (
        <ContainerTop style={{paddingTop:90}}>
            <IconButton
                rippleColor='gray'
                style={{ position: 'absolute', top: 38, left: 0, zIndex: 3 }}
                icon='close'
                iconColor='#1B1B1B'
                size={28}
                onPress={() => props.navigation.goBack()}
            />
            <TitleLeft>{t('verify_your_phone_number')}</TitleLeft>
            <Agreement>{t('we_send_code_to')} {phoneNumber}</Agreement>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        placeholder='enter code'
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name='confirmationCode'
                defaultValue=''
            />
            <View style={{flexDirection:'row', alignItems:'flex-start', width:'80%'}}>
                <LinkLogin style={{width:'max-content'}}  disabled={isRunning} onPress={()=>fetchData()}>{t('resend_code')}</LinkLogin>
                <Text>  {seconds}</Text>
            </View>

            <SmallRedBtn buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}>
                <SmallBtnText>{t('verify')}</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    )}
    {error && <ErrorView>
        <ErrorText>{error}</ErrorText>
        <XIcon
            icon="window-close"
            iconColor='#FFF'
            size={20}
            onPress={() => setError(null)}
        />
    </ErrorView>}
</>
    );
};

export default VerifyPhoneNumber;
