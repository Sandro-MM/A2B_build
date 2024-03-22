import React from 'react';
import {Container, ContainerTop, SettingsVal, Title, TitleLeft} from "../../styles/styles";
import {TouchableHighlight, View} from "react-native";
import {Icon} from "react-native-paper";
import {accEndpoints, getAccessToken, GetApi, headersText} from "../../services/api";
import * as SecureStore from "expo-secure-store";


const LanguageSetting = (props) => {
    const viewStyle = { height: 45, marginTop: 10, marginBottom: 10 , flexDirection:'row', justifyContent:'space-between', marginHorizontal:20, alignItems:'center'};

    const ChangeLang = async (id) => {
        try {
            const accessToken = await getAccessToken();
            const fetchedData = await GetApi(`${accEndpoints.get.ChangeLang}${id}`,{
                headers: {
                    ...headersText.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            props.navigation.navigate('HomeScreen')
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }



    const languges = [
        {
            language:'English',
            id:'1'
        },
        {
            language:'Georgian',
            id:'2'
        },
        {
            language:'Russian',
            id:'3'
        },
    ]
    return (
       <Container style={{marginTop:-400}}>
           <Title style={{marginBottom:-30, marginTop:-80}}>Change languge</Title>
           {languges.map((language, index) => (
               <TouchableHighlight
                   key={index}
                   onPress={() => ChangeLang(language.id)}
                   underlayColor='rgba(128, 128, 128, 0.5)'
               >
                   <View style={viewStyle}>
                       <SettingsVal>{language.language}</SettingsVal>
                       <Icon size={35} color={'#FF5A5F'} source={'chevron-right'}/>
                   </View>
               </TouchableHighlight>
           ))}
       </Container>
    );
};

export default LanguageSetting;
