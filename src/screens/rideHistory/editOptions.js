import React, {useState} from 'react';
import {Icon, IconButton} from "react-native-paper";
import {ContainerMid, VehicleName} from "../../styles/styles";
import {View} from "react-native";
import CheckboxForm from "../../components/checkboxForm";
import A2BNextIcon from "../../components/next_icon";
import Loading from "../../components/loading";
import {useTranslation} from "react-i18next";
import CheckboxEditForm from "../../components/checkboxFormEdit";
import {useForm} from "react-hook-form";

const EditDescription = ({route}) => {
    const {navigation, onSubmit, items, isLoading} = route.params;

    const { control, handleSubmit, watch,setValue} = useForm();
    const { t } = useTranslation();

    console.log(items)
    // const itemStatus  = (val) => {
    //     console.log(val)
    //     if ((val.Id) === 1 || (val.Id) === 5 || (val.Id) === 8 || (val.Id) === 9 || (val.Id) === 12){
    //         return "No"
    //     } else if ((val.Id) === 3 || (val.Id) === 6){
    //         return "Maybe"
    //     } else return "Yes"
    // }

    const nav = () => {
        const cf = control._formValues;
        const Smoking = cf.Smoking === "No" ? 1 : cf.Smoking === "Yes" ? 2 : cf.Smoking === "On Stops" ? 3 : items[0];
        const Pets = cf.Pets === "No" ? 5 : cf.Pets === "Yes" ? 4 : cf.Pets === "Depends on pet" ? 6 :  items[1];
        const Music = cf.Music === "No" ? 8 : cf.Music === "Yes"?7 : items[2];
        const Luggage = cf.Luggage === "No" ? 9 : cf.Luggage === "Yes"?10 : items[3];
        const Package = cf.Package === "No" ? 12 : cf.Package === "Yes"?11 : items[4];
        console.log(cf,'cfcfcfcfcfcfcfcfcfcfcfcf')
        onSubmit({ OrderDescriptionIds: [
                Smoking,Pets,Music,Luggage,Package
            ]
        });
        navigation.goBack();
    };

    return (
        <ContainerMid>
        {
            isLoading ? <Loading/> :

                <ContainerMid>
            <IconButton
                style={{position:'absolute', top:60, left:0, zIndex:3}}
                icon="arrow-left"
                iconColor='#7a7a7a'
                size={32}
                onPress={() => navigation.goBack()}
            />
            <View style={{flexDirection:'row'}}>
                <Icon
                    source="smoking"
                    color={'black'}
                    size={33}
                />
                <VehicleName>  {t('is_smoking_allowed')}</VehicleName>

            </View>
            <CheckboxEditForm options={['Yes','On Stops','No']} setValue={setValue}  param={'Smoking'}/>
            <View style={{flexDirection:'row', marginTop:30}}>
                <Icon
                    source="paw"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   {t('are_pets_allowed')}</VehicleName>

            </View>
            <CheckboxEditForm options={['Yes','Depends on pet','No']} setValue={setValue}  param={'Pets'}/>
            <View style={{flexDirection:'row' , marginTop:30}}>
                <Icon
                    source="music"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   {t('is_music_allowed')}</VehicleName>

            </View>
            <CheckboxEditForm options={['Yes','No']} setValue={setValue}  param={'Music'}/>
            <View style={{flexDirection:'row' , marginTop:30}}>
                <Icon
                    source="bag-suitcase"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   {t('is_luggage_allowed')}</VehicleName>

            </View>
            <CheckboxEditForm options={['Yes','No']} setValue={setValue}  param={'Luggage'}/>
            <View style={{flexDirection:'row' , marginTop:30}}>
                <Icon
                    source="package-variant-closed"
                    color={'black'}
                    size={33}
                />
                <VehicleName>   {t('is_package_allowed')}</VehicleName>

            </View>
            <CheckboxEditForm options={['Yes','No']} setValue={setValue}   param={'Package'}/>

            <A2BNextIcon onPress={nav}/>
        </ContainerMid>
        }
        </ContainerMid>
    );
};

export default EditDescription;
