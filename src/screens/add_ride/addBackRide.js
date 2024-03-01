import React from 'react';
import {Divider, IconButton} from "react-native-paper";
import {Container,TitleLeft} from "../../styles/styles";
import {Text, TouchableHighlight, View} from "react-native";



const AddBackRide = ({ navigation, handleYesPress , handleNoPress}) => {

    const viewStyle = { height: 65,  width:'100%', textAlign:'left'};
    return (
        <Container>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />

            <TitleLeft>Coming Back as Well? Publish your return ride now!</TitleLeft>
            <TouchableHighlight
                style={{marginVertical:2 }}
                underlayColor="rgba(128, 128, 128, 0.5)"
                onPress={handleYesPress}
            >
                <View
                    style={viewStyle}
                >
                    <Text style={{ marginLeft:20,marginTop: 15, fontSize: 20, color:'#FF5A5F' }}> Yes Sure</Text>
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
                onPress={handleNoPress}
            >

                <View
                    style={viewStyle}
                >

                    <Text style={{ marginLeft:20,marginTop: 15, fontSize: 18 }}> No, thanks</Text>
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
