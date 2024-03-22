import React, {useState} from 'react';
import {ContainerMid, GenderBntText, SimpleBtnPadded, TitleLeft} from "../../styles/styles";
import {Divider} from "react-native-paper";
import {accEndpoints, getAccessToken, PutApi} from "../../services/api";


const GenderSetting = (props) => {
    const setGenders = props.route.params.setGenders


    const  changeGender = async (id) => {
        const Value =
            {
                Gender: id
            }
        try {
            const accessToken = await getAccessToken();
            const responseData = await PutApi(accEndpoints.put.EditProfile, Value, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setGenders(id)

        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <ContainerMid>
            <TitleLeft>Change gender</TitleLeft>
                    <SimpleBtnPadded
                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                        rippleColor='gray'
                        mode="text"
                        onPress={() => {
                            changeGender(1);

                        }}
                    >
                        <GenderBntText>Male</GenderBntText>
                    </SimpleBtnPadded>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
                    <SimpleBtnPadded
                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                        rippleColor='gray'
                        mode="text"
                        onPress={() => {
                            changeGender(2);

                        }}
                    >
                        <GenderBntText>Female</GenderBntText>
                    </SimpleBtnPadded>
            <Divider style={{ width: '90%' }} horizontalInset={true} bold={true} />
                    <SimpleBtnPadded
                        contentStyle={{ height: 55, justifyContent: 'flex-start' }}
                        rippleColor='gray'
                        mode="text"
                        onPress={() => {
                            changeGender(3)

                        }}
                    >
                        <GenderBntText>Other</GenderBntText>
                    </SimpleBtnPadded>
        </ContainerMid>
    );
};

export default GenderSetting;
