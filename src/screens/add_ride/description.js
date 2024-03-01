import React from 'react';
import {Controller} from 'react-hook-form';
import {IconButton} from "react-native-paper";
import {ContainerMid, TitleDesc} from "../../styles/styles";
import A2btextarea from "../../components/a2btextarea";
import A2BNextIcon from "../../components/next_icon";

const Description = ({name,control, navigation, handleSubmit}) => {
    return (
        <ContainerMid style={{paddingTop:25}}>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <TitleDesc>Add details about your ride!</TitleDesc>
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
                name={name}
                defaultValue=' '
            />
            <A2BNextIcon onPress={handleSubmit}/>
        </ContainerMid>
    );
};

export default Description;
