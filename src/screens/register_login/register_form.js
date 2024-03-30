import { ActivityIndicator, Keyboard,} from 'react-native';
import * as React from 'react';
import { Divider } from 'react-native-paper';
import {Controller, useForm} from "react-hook-form";
import {accEndpoints, headers, PostApi} from "../../services/api";
import {useState} from "react";
import { createStackNavigator } from '@react-navigation/stack';
import {TextInputMask} from "react-native-masked-text";
import moment from "moment";
import {
    ContainerMid,
    ErrorText,
    ErrorView,
    GenderBntText, LinkLogin,
    SimpleBtnPadded,
    TitleLeft,
    XIcon
} from "../../styles/styles";
import A2bInput from "../../components/formInput";
import A2BNextIcon from "../../components/next_icon";
import * as SecureStore from "expo-secure-store";
import {useTranslation} from "react-i18next";
import MaskInput from "react-native-mask-input/src/MaskInput";
import {Masks} from "react-native-mask-input";

const Stack = createStackNavigator();
export default function Register_form({navigation}) {
    const { t } = useTranslation();
    const { control, handleSubmit, watch,reset,formState ,formState: { errors }  } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkEmail = async (data) => {
        const email = {
            Email: data.email
        };
        console.log(data.email);
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await PostApi(accEndpoints.post.CheckEmailExists, email);

            if (responseData?.IsEmailExist) {
                setError('Email is taken');
            } else {
                navigation.navigate('Name');
            }
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };

    async function onSubmit(data) {
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        const dateString = data?.birthDate;
        const parsedDate = moment(dateString, "DD/MM/YYYY");
        const formattedDate = parsedDate.format("ddd MMM DD YYYY");
        const formData = new FormData();
        formData.append('firstName', data?.firstName);
        formData.append('lastName', data?.lastName);
        formData.append('email', data.email);
        formData.append('gender', data.gender);
        formData.append('birthDate', formattedDate);
        formData.append('password', data.password);
        formData.append('acceptTerms', 'true');
        try {
            const responseData = await PostApi(accEndpoints.post.Register, formData, headers);
            navigation.navigate('ActivateEmail');
        }catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    }
    const onSubmitCode = async (data) => {
        console.log(1);
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);

        try {
            const newData = {
                Email: data.email,
                confirmationCode: data.code
            };
            const loginData = {
                UserName: data.email,
                Password: data.password
            };
            const responseData = await PostApi(accEndpoints.post.ActivateEmailForReg, newData);
            if (responseData) {
                console.log(responseData)
                const login = await PostApi(accEndpoints.post.Login, loginData);
                if(login){
                    try {
                        const expirationTime = Date.now() + 30 * 60 * 1000;
                        await SecureStore.setItemAsync('accessToken', login.AccessToken);
                        await SecureStore.setItemAsync('accessTokenExpiration', expirationTime.toString());
                        await SecureStore.setItemAsync('refreshToken', login.RefreshToken);
                        navigation.navigate('Profile', { IsUserOrder: 1, navigation: navigation });
                    } catch (error) {
                        console.error('Error saving tokens:', error);
                    }
                }
            } else {
                const errorTitle = responseData ? responseData.detail : 'Activation failed';
                setError(errorTitle);
            }
        } catch (error) {
            const errorTitle = error.response ? error.response.data.detail : 'An error occurred';
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };

    return (
            <Stack.Navigator>
                <Stack.Screen name="Email" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerMid>
                            <TitleLeft>{t("what's_your_email")}</TitleLeft>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <A2bInput
                                            placeholder={t("email")}
                                            value={field.value}
                                            onChangeText={(value) => field.onChange(value)}
                                            variant ='default'
                                        />
                                        {field.value.length > 5 && (
                                            <A2BNextIcon onPress={handleSubmit(checkEmail)} />
                                        )}
                                    </React.Fragment>
                                )}
                                name="email"
                                defaultValue=""
                                rules={{
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email address',
                                    },
                                }}
                            />
                            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
                            {(errors.email || error) && (
                                <ErrorView>
                                    <ErrorText>{errors.email?.message || error}</ErrorText>
                                    <XIcon
                                        icon="window-close"
                                        iconColor='#FFF'
                                        size={20}
                                        onPress={() => setError(null)}
                                    />
                                </ErrorView>
                            )}
                        </ContainerMid>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Name" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerMid>
                            <TitleLeft>{t( "tell_us_your_name")}</TitleLeft>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <A2bInput
                                        placeholder={t(  "first_name")}
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value)}
                                        variant ='default'
                                    />
                                )}
                                name="firstName"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <A2bInput
                                        placeholder={t("last_name")}
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value)}
                                        variant ='default'
                                    />
                                )}
                                name="lastName"
                                defaultValue=""
                            />
                            {(formState.dirtyFields.firstName && formState.dirtyFields.lastName) && (
                                <A2BNextIcon onPress={() => navigation.navigate('DateOfBirth')} />
                            )}
                        </ContainerMid>
                    )}
                </Stack.Screen>
                <Stack.Screen name="DateOfBirth" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerMid>
                            <TitleLeft>{t("what's_your_date_of_birth")}</TitleLeft>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <MaskInput
                                            autoFocus={true}
                                            style={{height:45, backgroundColor:'#D8D9DA', width:'85%', borderRadius:14, paddingVertical:5, paddingHorizontal:15, fontSize:18}}
                                            keyboardType = 'numeric'
                                            placeholder={'DD/MM/YYYY'}
                                            value={field.value}
                                            mask={Masks.DATE_DDMMYYYY}
                                            onChangeText={(value) => field.onChange(value)}
                                        />
                                        {field.value.length > 9 && (
                                            <A2BNextIcon onPress={() => navigation.navigate('Gender')} />
                                        )}
                                    </React.Fragment>
                                )}
                                name="birthDate"
                                defaultValue=""
                            />
                        </ContainerMid>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Gender" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerMid>
                            <TitleLeft>{t('how_would_you_like_to_be_addressed')}</TitleLeft>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <SimpleBtnPadded
                                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                                        rippleColor='gray'
                                        mode="text"
                                        onPress={() => {
                                            field.onChange(1);
                                            navigation.navigate('Password');
                                        }}
                                    >
                                        <GenderBntText>{t('male')}</GenderBntText>
                                    </SimpleBtnPadded>
                                )}
                                name="gender"
                                defaultValue="1"
                            />
                            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <SimpleBtnPadded
                                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                                        rippleColor='gray'
                                        mode="text"
                                        onPress={() => {
                                            field.onChange(2);
                                            navigation.navigate('Password');
                                        }}
                                    >
                                        <GenderBntText>{t('female')}</GenderBntText>
                                    </SimpleBtnPadded>
                                )}
                                name="gender"
                                defaultValue="2"
                            />
                            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <SimpleBtnPadded
                                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                                        rippleColor='gray'
                                        mode="text"
                                        onPress={() => {
                                            field.onChange(3);
                                            navigation.navigate('Password');
                                        }}
                                    >
                                        <GenderBntText>{t('other')}</GenderBntText>
                                    </SimpleBtnPadded>
                                )}
                                name="gender"
                                defaultValue="3"
                            />
                        </ContainerMid>
                    )}
                </Stack.Screen>
                <Stack.Screen name="Password" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerMid>
                            <TitleLeft>{t('define_your_password')}</TitleLeft>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <A2bInput
                                            placeholder={t("password")}
                                            value={field.value}
                                            onChangeText={(value) => field.onChange(value)}
                                            variant ='eye'
                                        />
                                        {field.value.length > 7 && (
                                            <A2BNextIcon onPress={handleSubmit(onSubmit)} />
                                        )}
                                        {(errors.password && field.value.length > 7) && (
                                            <ErrorView>
                                                <ErrorText>{errors.password?.message}</ErrorText>
                                                <XIcon
                                                    icon="window-close"
                                                    iconColor='#FFF'
                                                    size={20}
                                                    onPress={() => setError(null)}
                                                />
                                            </ErrorView>
                                        )}
                                    </React.Fragment>
                                )}
                                name="password"
                                defaultValue=""
                                rules={{
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                        message: 'Password requires 8 characters, uppercase, lowercase and digit.',
                                    },
                                }}
                            />
                            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
                        </ContainerMid>
                    )}
                </Stack.Screen>
                <Stack.Screen name="ActivateEmail" options={{ headerShown: false }}>
                    {({ navigation }) => (
                        <ContainerMid>
                            <TitleLeft>{t('please_confirm_your_email')}</TitleLeft>
                            <Controller
                                control={control}
                                render={({ field }) => (
                                    <React.Fragment>
                                        <A2bInput
                                            placeholder="Code"
                                            value={field.value}
                                            onChangeText={(value) => field.onChange(value)}
                                            variant ='default'
                                            render={props => (
                                                <TextInputMask
                                                    {...props}
                                                    type={'only-numbers'}
                                                />
                                            )}
                                        />
                                        {field.value.length > 5 && (
                                            <A2BNextIcon onPress={handleSubmit(onSubmitCode)} />
                                        )}
                                    </React.Fragment>
                                )}
                                name="code"
                                defaultValue=""
                            />
                            {isLoading && <ActivityIndicator size="large"  color="#FF5A5F" />}
                            {(errors.code || error) && (
                                <ErrorView>
                                    <ErrorText>{errors.code?.message || error}</ErrorText>
                                    <XIcon
                                        icon="window-close"
                                        iconColor='#FFF'
                                        size={20}
                                        onPress={() => setError(null)}
                                    />
                                </ErrorView>
                            )}
                            <LinkLogin onPress={handleSubmit(checkEmail)}>{t('resend_code')}</LinkLogin>
                        </ContainerMid>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
    );
}
