import React, {useEffect, useState} from 'react';
import {Controller, useForm,} from 'react-hook-form';


import {
    Agreement,
    ContainerMid,
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
import {Keyboard} from "react-native";
import Loading from "../../components/loading";

const VerifyPhoneNumber = (props) => {
    const { control, handleSubmit, watch,reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const phoneNumber = props.route.params.phoneNumber;
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
                    props.navigation.navigate('HomeScreen')
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
        <ContainerMid>
            <IconButton
                rippleColor='gray'
                style={{ position: 'absolute', top: 38, left: 0, zIndex: 3 }}
                icon='close'
                iconColor='#1B1B1B'
                size={28}
                onPress={() => props.navigation.goBack()}
            />
            <TitleLeft>Verify your phone number</TitleLeft>
            <Agreement>we send code to {phoneNumber}</Agreement>
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
            <LinkLogin  onPress={()=>fetchData()}>Resend Code</LinkLogin>
            <SmallRedBtn buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}>
                <SmallBtnText>Save</SmallBtnText>
            </SmallRedBtn>
        </ContainerMid>
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
