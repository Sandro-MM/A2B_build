import React from 'react';
import {Controller} from 'react-hook-form';
import {IconButton} from "react-native-paper";
import A2btextarea from "../../components/a2btextarea";
import {ContainerMid, ContainerTop, SmallBtnText, SmallRedBtn, Title} from "../../styles/styles";
import {accEndpoints, getAccessToken, PutApi} from "../../services/api";

const DescriptionSetting = (props) => {

    const title = props.route.params.title;
    const name = props.route.params.name;
    const defaultValue = props.route.params.defaultValue;
    const control = props.route.params.control
    const handleSubmit = props.route.params.handleSubmit


    const  Save = async () => {
        const Value =
            {
                UserDetailsModel: {
                    Description: control._formValues.Description
                }
            }
        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <ContainerTop style={{paddingTopTop:100}}>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => props.navigation.goBack()}
            />
            <Title>{title}</Title>
            <Controller
                control={control}
                render={({ field }) => (
                    <A2btextarea
                        placeholder={`Enter description`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name={'Description'}
                defaultValue={defaultValue}
            />
            <SmallRedBtn style={{position:'absolute', bottom:40}} buttonColor='#FF5A5F' mode='contained' onPress={Save}>
                <SmallBtnText>Save</SmallBtnText>
            </SmallRedBtn>
        </ContainerTop>
    );
};

export default DescriptionSetting;
