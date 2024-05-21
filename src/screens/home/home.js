
import {ContainerMid, HomeBg, ProfilePic, Title} from "../../styles/styles";
import * as React from "react";
import Navigation from "../../components/navigation";
import SearchElement from "./searchElement";
import {createStackNavigator} from "@react-navigation/stack";
import CalendarRange from "../../components/calendarRange";
import {useForm} from "react-hook-form";
import PlacesSearch from "./placesSearch";
import {OrdersList} from "./ordersList";
import {ListFilter} from "../../components/listFilter";
import {useTranslation} from "react-i18next";
import BG from '../../../assets/img/home-search/bg.png'
import {ImageBackground} from "react-native";
import {format} from "date-fns";



export default function HomeScreen({navigation}) {


    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yy');
    };
    const { t } = useTranslation();
    const Stack = createStackNavigator();
    const { control, handleSubmit, watch,setValue} = useForm();
    const startDay = control._formValues.startDay;
    const endDay = control._formValues.endDay;

    const leaving =  control._formValues.departure || null
    const going =  control._formValues.destination || null
    const startDateFormatted = startDay ? formatDate(startDay) : "today";
    const endDateFormatted = endDay ? `/${formatDate(endDay)}` : "";




    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
                {({ navigation }) => (
                <ContainerMid style={{paddingTop:90}}>
                    <HomeBg
                        style={{marginTop:6}}
                        source={BG}
                    />
                    <SearchElement
                        setValue={setValue}
                        control={control}
                        navigation={navigation}
                        date={t(`${startDateFormatted}${endDateFormatted}`)}
                        leaving={leaving}
                        going={going}
                    />
                    <Navigation navigation={navigation} activeButton={'HomeScreen'}/>
                </ContainerMid>
                    )}
            </Stack.Screen>
            <Stack.Screen name="Calendar" options={{ headerShown: false }}>
                {({ navigation }) => (
                    <CalendarRange navigation={navigation} setValue={setValue} control={control}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="Places" options={{ headerShown: false }}>
                {({ navigation, route }) => (
                    <PlacesSearch navigation={navigation} setValue={setValue}  type={route.params?.type} handleNavigation={()=>navigation.goBack()}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="List" options={{ headerShown: false }}>
                {({ navigation}) => (
                    <OrdersList navigation={navigation} data={control} setValue={setValue}/>
                )}
            </Stack.Screen>
            <Stack.Screen name="ListFilterScreen" options={{ headerShown: false }}>
                {({ navigation}) => (
                    <ListFilter navigation={navigation} control={control} setValue={setValue}/>
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
