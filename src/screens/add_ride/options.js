import React from 'react';
import {Icon, IconButton} from "react-native-paper";
import {ContainerMid, VehicleName} from "../../styles/styles";
import {View} from "react-native";
import CheckboxForm from "../../components/checkboxForm";
import A2BNextIcon from "../../components/next_icon";

const Description = ({setValue, navigation, onSubmit}) => {


    return (
        <ContainerMid>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.navigate("Description")}
            />
            <View style={{flexDirection:'row'}}>
                <Icon
                    source="smoking"
                    color={'black'}
                    size={33}
                />
                <VehicleName>  Is smoking Allowed</VehicleName>

            </View>
            <CheckboxForm options={['Yes','On Stops','No']} setValue={setValue} param={'Smoking'}/>
            <View style={{flexDirection:'row', marginTop:30}}>
                <Icon
                    source="paw"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   Are pets allowed</VehicleName>

            </View>
            <CheckboxForm options={['Yes','Depends on pet','No']} setValue={setValue} param={'Pets'}/>
            <View style={{flexDirection:'row' , marginTop:30}}>
                <Icon
                    source="music"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   Is music allowed</VehicleName>

            </View>
            <CheckboxForm options={['Yes','No']} setValue={setValue} param={'Music'}/>
            <View style={{flexDirection:'row' , marginTop:30}}>
                <Icon
                    source="bag-suitcase"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   Is luggage allowed</VehicleName>

            </View>
            <CheckboxForm options={['Yes','No']} setValue={setValue} param={'Luggage'}/>
            <View style={{flexDirection:'row' , marginTop:30}}>
                <Icon
                    source="package-variant-closed"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   Is package allowed</VehicleName>

            </View>
            <CheckboxForm options={['Yes','No']} setValue={setValue} param={'Package'}/>

            <A2BNextIcon onPress={onSubmit}/>

        </ContainerMid>
    );
};

export default Description;
