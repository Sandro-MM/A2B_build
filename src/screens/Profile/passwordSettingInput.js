import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import A2bInput from "../../components/formInput";
import {
    ContainerMid,
    ContainerTop,
    ErrorText,
    ErrorView,
    SmallBtnText,
    SmallRedBtn,
    Title,
    XIcon
} from "../../styles/styles";
import {IconButton} from "react-native-paper";
import {Keyboard} from "react-native";
import {accEndpoints, getAccessToken, headers, PutApi} from "../../services/api";

const PasswordSettingInput = (props) => {
    const { control, handleSubmit} = useForm();
    const [error, setError] = useState(null);


    async function onSubmit(data) {
        Keyboard.dismiss();
        setError(null);
        try {

            const accessToken = await getAccessToken();
                const responseData = await PutApi(accEndpoints.put.ChangePassword, data, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (responseData){
                    props.navigation.navigate('HomeScreen')
                }

        } catch (error) {
            console.error('Error submitting data:', error);
            const errorTitle = error.response.data.detail;
            setError(errorTitle);
        } finally {
        }
    }



    return (
        <ContainerTop style={{paddingTop:20}}>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => props.navigation.goBack()}
            />
            <Title style={{marginBottom:-20}}>Change Password</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput

                        placeholder={`Old Password`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant ='eye'
                    />

                )}
                name={'OldPassword'}
                defaultValue={null}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        placeholder={`Enter new password`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant ='eye'
                    />

                )}
                name={'NewPassword'}
                defaultValue={null}
            />
            <Controller
                control={control}
                render={({ field }) => (
                    <A2bInput
                        placeholder={`Confirm Password`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant ='eye'
                    />

                )}
                name={'NewPasswordConfirm'}
                defaultValue={null}
            />
            <SmallRedBtn style={{position:'absolute', bottom:40}} buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit(onSubmit)}>
                <SmallBtnText>Save</SmallBtnText>
            </SmallRedBtn>
            {error && <ErrorView>
                <ErrorText>{error}</ErrorText>
                <XIcon
                    icon="window-close"
                    iconColor='#FFF'
                    size={20}
                    onPress={() => setError(null)}
                />
            </ErrorView>}
        </ContainerTop>
    );
};

export default PasswordSettingInput;
