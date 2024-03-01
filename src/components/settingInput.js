import React from 'react';
import {Controller} from 'react-hook-form';
import A2bInput from "./formInput";
import {ContainerMid, SmallBtnText, SmallRedBtn, Title} from "../styles/styles";
import {IconButton} from "react-native-paper";

const SettingInput = (props) => {

    const title = props.route.params.title;
    const name = props.route.params.name;
    const defaultValue = props.route.params.defaultValue;
    const control = props.route.params.control
    const handleSubmit = props.route.params.handleSubmit



    return (
        <ContainerMid>
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
                    <A2bInput
                        placeholder={`Enter ${title}`}
                        value={field.value}
                        onChangeText={(value) => field.onChange(value)}
                        variant='default'
                    />
                )}
                name={name}
                defaultValue={defaultValue}
            />
            <SmallRedBtn buttonColor='#FF5A5F' mode='contained' onPress={handleSubmit}>
                <SmallBtnText>Save</SmallBtnText>
            </SmallRedBtn>
        </ContainerMid>
    );
};

export default SettingInput;
