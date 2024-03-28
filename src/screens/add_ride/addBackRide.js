import React, {useState} from 'react';
import {Divider, IconButton} from "react-native-paper";
import {Container,TitleLeft} from "../../styles/styles";
import {Text, TouchableHighlight, View} from "react-native";
import {useTranslation} from "react-i18next";



const AddBackRide = ({ navigation, handleYesPress , handleNoPress}) => {
    const { t } = useTranslation();
    const viewStyle = { height: 65,  width:'100%', textAlign:'left'};
    const [red, setRed] = useState(false);

    const handleNoPressBtn = () => {
        handleNoPress()
        setRed(false)
    };
    const handleYesPressBtn = () => {
        handleYesPress()
        setRed(true)
    };
    return (
        <Container>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <TitleLeft>{t('coming_back_as_well_publish_your_return_ride_now')}</TitleLeft>
            <TouchableHighlight
                style={{marginVertical:2 }}
                underlayColor="rgba(128, 128, 128, 0.5)"
                onPress={handleYesPressBtn}
            >
                <View
                    style={viewStyle}
                >
                    <Text style={{ marginLeft:20,marginTop: 15, fontSize: 18,  color:red?'#FF5A5F':'black'}}>{t('yes_sure')}</Text>
                    <IconButton
                        style={{position:'absolute', top:0, right:0, zIndex:3}}
                        icon="chevron-right"
                        iconColor='#7a7a7a'
                        size={32}

                    />
                </View>
            </TouchableHighlight>
            <Divider style={{ width: '90%', marginTop: 0 }} horizontalInset={true} bold={true} />
            <TouchableHighlight
                style={{marginVertical:2 }}
                underlayColor="rgba(128, 128, 128, 0.5)"
                onPress={handleNoPressBtn}
            >
                <View
                    style={viewStyle}
                >
                    <Text style={{ marginLeft:20,marginTop: 15, fontSize: 20, color:red?'black':'#FF5A5F'}}>{t('no_thanks')}</Text>
                    <IconButton
                        style={{position:'absolute', top:0, right:0, zIndex:3}}
                        icon="chevron-right"
                        iconColor='#7a7a7a'
                        size={32}
                    />
                </View>

            </TouchableHighlight>
        </Container>
    );
};

export default AddBackRide;
