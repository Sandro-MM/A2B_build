
import { ContainerMid, Title} from "../../styles/styles";
import * as React from "react";
import Navigation from "../../components/navigation";
import SearchElement from "./searchElement";
import {createStackNavigator} from "@react-navigation/stack";
import CalendarRange from "../../components/calendarRange";
import {useForm} from "react-hook-form";
import PlacesSearch from "./placesSearch";
import {OrdersList} from "./ordersList";
import {ListFilter} from "../../components/listFilter";




export default function HomeScreen({navigation}) {
    const Stack = createStackNavigator();
    const { control, handleSubmit, watch,setValue} = useForm();
    const startDay = control._formValues.startDay?.slice(2);
    const endDay = control._formValues.endDay?.slice(2);
    const leaving =  control._formValues.departure || null
    const going =  control._formValues.destination || null
    const startDateFormatted = startDay ? startDay : "Today";
    const endDateFormatted = endDay ? `/${endDay}` : "";


    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
                {({ navigation }) => (
                <ContainerMid>
                    <Title>Your pick of rides at low prices</Title>
                    <SearchElement
                        setValue={setValue}
                        control={control}
                        navigation={navigation}
                        date={`${startDateFormatted}${endDateFormatted}`}
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
