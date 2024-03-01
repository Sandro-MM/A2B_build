import {ActivityIndicator, Keyboard} from 'react-native';
import * as React from 'react';
import {Controller, useForm} from "react-hook-form";
import {accEndpoints, PostApi} from "../../services/api";
import {useState} from "react";
import * as SecureStore from 'expo-secure-store';
import {
    ContainerMid,
    ErrorText,
    ErrorView,
    LinkLogin,
    SmallRedBtn,
    TitleLeft,
    XIcon,
    SmallBtnText,
} from "../../styles/styles";
import A2bInput from "../../components/formInput";

export default function LoginForm(props) {
    const { control, handleSubmit, watch,reset } = useForm();
    const isButtonDisabled = !(watch('UserName') && watch('Password'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    const onSubmit = async (data) => {
        Keyboard.dismiss();
        reset();
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await PostApi(accEndpoints.post.Login, data);
            console.log(responseData)
            if (responseData){
                try {
                    const expirationTime = Date.now() + 30 * 60 * 1000;
                    await SecureStore.setItemAsync('accessToken', responseData.AccessToken);
                    await SecureStore.setItemAsync('accessTokenExpiration', expirationTime.toString());
                    await SecureStore.setItemAsync('refreshToken', responseData.RefreshToken);
                    props.navigation.navigate('HomeScreen');
                } catch (error) {
                    console.error('Error saving tokens:', error);
                }
            }
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <ContainerMid>
            <TitleLeft>What's your email and password</TitleLeft>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        placeholder="Email"
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant ='default'
                    />
                )}
                name="UserName"
                defaultValue=""
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        secureTextEntry
                        placeholder="Password"
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant ='eye'
                    />
                )}
                name="Password"
                defaultValue=""
            />
            <LinkLogin onPress={() => props.navigation.navigate('Forget_password_form')}>Forget Password?</LinkLogin>
            {!isButtonDisabled && (
                <SmallRedBtn
                    buttonColor='#FF5A5F'
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                >
                    <SmallBtnText>Login</SmallBtnText>
                </SmallRedBtn>
            )}
            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
            {error && <ErrorView>
                <ErrorText>{error}</ErrorText>
                <XIcon
                    icon="window-close"
                    iconColor='#FFF'
                    size={20}
                    onPress={() => setError(null)}
                />
            </ErrorView>}
        </ContainerMid>
    );
}
