import { ActivityIndicator, Keyboard,} from 'react-native';
import * as React from 'react';
import {Controller, useForm} from "react-hook-form";
import {accEndpoints, PatchApi, PostApi} from "../../services/api";
import {useState} from "react";
import {
    ContainerMid,
    ErrorText,
    ErrorView,
    LinkLogin,
    TitleLeft,
    XIcon
} from "../../styles/styles";
import A2bInput from "../../components/formInput";
import A2BNextIcon from "../../components/next_icon";
import {createStackNavigator} from "@react-navigation/stack";
import {TextInputMask} from "react-native-masked-text";

const Stack = createStackNavigator();
export default function Forget_password_form({navigation}) {
    const { control, handleSubmit, watch,reset,formState ,formState: { errors }  } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(null);


    const [error, setError] = useState(null);
    const checkEmail = async (data) => {
        const email = {
            Email: data.email
        }
        console.log(data.email)
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await PostApi(accEndpoints.post.CheckEmailForPassReset,email);
            navigation.navigate('ResetPassword')
        } catch (error) {

            setError('Email does not exist');
        } finally {

            setIsLoading(false);
        }
    };
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

            const responseData = await PostApi(accEndpoints.post.VerifyEmailPassReset, newData);
            console.log(responseData);
            setToken(responseData.Token);

            navigation.navigate('ChangePassword');
        } catch (error) {
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
            setIsLoading(false);
        }
    };
    const changePassword = async (data) => {
        Keyboard.dismiss();
        setIsLoading(true);
        setError(null);
        try {
            const newData = {
                Token: token,
                NewPassword: data.password,
                NewPasswordConfirm: data.password
            };

            const responseData = await PatchApi(accEndpoints.patch.ResetPass, newData);
            console.log(responseData);
            navigation.navigate('Confirm_password_change')
        } catch (error) {
            const errorTitle = error.response.data.detail;
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
                        <TitleLeft>What's your email</TitleLeft>
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <React.Fragment>
                                    <A2bInput
                                        placeholder="Email"
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
            <Stack.Screen name="ResetPassword" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <ContainerMid>
                        <TitleLeft>Please enter Code</TitleLeft>
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
                        <LinkLogin onPress={handleSubmit(checkEmail)}>Resend code</LinkLogin>
                    </ContainerMid>
                )}
            </Stack.Screen>
            <Stack.Screen name="ChangePassword" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <ContainerMid>
                        <TitleLeft>Type New Password</TitleLeft>
                        <Controller
                            control={control}
                            render={({ field }) => (
                                <React.Fragment>
                                    <A2bInput
                                        placeholder="Password"
                                        value={field.value}
                                        onChangeText={(value) => field.onChange(value)}
                                        variant ='eye'
                                    />
                                    {field.value.length > 7 && (
                                        <A2BNextIcon onPress={handleSubmit(changePassword)} />
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
        </Stack.Navigator>
    );
}
