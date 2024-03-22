import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AuthScreen from "./src/screens/auth/auth";
import Register_login from "./src/screens/register_login/register_login";
import Register_form from "./src/screens/register_login/register_form";
import Login_form from "./src/screens/register_login/login_form";
import Forget_password_form from "./src/screens/register_login/forget_password_form";
import Confirm_password_change from "./src/screens/register_login/confirm_password_change";
import HomeScreen from "./src/screens/home/home";
import Profile from "./src/screens/Profile/profile";
import Vehicles from "./src/screens/Profile/vehicles";
import {DefaultTheme, Provider} from 'react-native-paper';
import AddVehicle from "./src/screens/Profile/addVehicle";
import Reviews from "./src/screens/Profile/reviews";
import ProfileSettings from "./src/screens/Profile/profileSettings";
import SettingInput from "./src/components/settingInput";
import VerifyPhoneNumber from "./src/screens/Profile/VerifyPhoneNumber";
import AddRide from "./src/screens/add_ride/add_ride";
import {enableLatestRenderer} from 'react-native-maps';
import AddRideCheck from "./src/screens/add_ride/addRideCheck";
import Notifications from "./src/screens/notifications/notifications";
import RideHistory from "./src/screens/rideHistory/rideHistory";
import Order from "./src/screens/home/order";
import MapPointViewScreen from "./src/components/mapPointView";
import {ListFilter} from "./src/components/listFilter";
import {StatusBar} from "react-native";
import {RideAddedSucsess} from "./src/screens/add_ride/rideAddedSucsess";
import {Passengers} from "./src/screens/rideHistory/passengers";
import SettingsPage from "./src/screens/Profile/settings";
import LanguageSetting from "./src/screens/Profile/languageSetting";
import PasswordSettingInput from "./src/screens/Profile/passwordSettingInput";
import NotificationEmailSms from "./src/screens/Profile/notificationEmailSms";
import DescriptionSetting from "./src/screens/Profile/descriptionSetting";
import GenderSetting from "./src/screens/Profile/genderSetting";
import PrefrenceSettings from "./src/screens/Profile/prefrenceSettings";
import RatingsSetting from "./src/screens/Profile/ratingsSetting";



export default function App() {
    enableLatestRenderer();
    const Stack = createStackNavigator();

    return (
        <Provider theme={theme}>
            <NavigationContainer>
                <StatusBar
                    backgroundColor="#FFF"
                    barStyle="dark-content"
                />
                <Stack.Navigator>
                        <Stack.Screen
                            name="HomeScreen"
                            options={{ headerShown: false , animationEnabled: false }}
                            component={HomeScreen}

                        />
                    <Stack.Screen name="AuthScreen" options={{ headerShown: false }} component={AuthScreen} />
                    <Stack.Screen name="Register_login"  options={{ headerShown: false }} component={Register_login} />
                    <Stack.Screen name="Register_form"  options={{ headerShown: false }} component={Register_form} />
                    <Stack.Screen name="Login_form"  options={{ headerShown: false }} component={Login_form} />
                    <Stack.Screen name="Forget_password_form"  options={{ headerShown: false }} component={Forget_password_form} />
                    <Stack.Screen name="Profile"  options={{ headerShown: false , animationEnabled: false}} component={Profile} />
                    <Stack.Screen name="Confirm_password_change"  options={{ headerShown: false }} component={Confirm_password_change} />
                    <Stack.Screen name="Vehicles"  options={{ headerShown: false }} component={Vehicles} />
                    <Stack.Screen name="AddVehicle"  options={{ headerShown: false }} component={AddVehicle} />
                    <Stack.Screen name="Reviews"  options={{ headerShown: false }} component={Reviews} />
                    <Stack.Screen name="ProfileSettings"  options={{ headerShown: false }} component={ProfileSettings} />
                    <Stack.Screen name="SettingsPage"  options={{ headerShown: false }} component={SettingsPage} />
                    <Stack.Screen name="SettingInput"  options={{ headerShown: false }} component={SettingInput} />
                    <Stack.Screen name="VerifyPhoneNumber"  options={{ headerShown: false }} component={VerifyPhoneNumber} />
                    <Stack.Screen name="AddRide"  options={{ headerShown: false }} component={AddRide} />
                    <Stack.Screen name="Notifications"  options={{ headerShown: false , animationEnabled: false }} component={Notifications} />
                    <Stack.Screen name="RideHistory"  options={{ headerShown: false , animationEnabled: false }} component={RideHistory} />
                    <Stack.Screen name="Order"  options={{ headerShown: false , animationEnabled: false }} component={Order} />
                    <Stack.Screen name="MapPointViewScreen"  options={{ headerShown: false , animationEnabled: false }} component={MapPointViewScreen} />
                    <Stack.Screen name="ListFilter"  options={{ headerShown: false , animationEnabled: false }} component={ListFilter} />
                    <Stack.Screen name="AddRideCheck"  options={{ headerShown: false , animationEnabled: false}} component={AddRideCheck} />
                    <Stack.Screen name="RideAddedSucsess"  options={{ headerShown: false , animationEnabled: false}} component={RideAddedSucsess} />
                    <Stack.Screen name="Passengers"  options={{ headerShown: false , animationEnabled: false}} component={Passengers} />
                    <Stack.Screen name="LanguageSetting"  options={{ headerShown: false , animationEnabled: false}} component={LanguageSetting} />
                    <Stack.Screen name="PasswordSettingInput"  options={{ headerShown: false , animationEnabled: false}} component={PasswordSettingInput} />
                    <Stack.Screen name="NotificationEmailSms"  options={{ headerShown: false , animationEnabled: false}} component={NotificationEmailSms} />
                    <Stack.Screen name="DescriptionSetting"  options={{ headerShown: false , animationEnabled: false}} component={DescriptionSetting} />
                    <Stack.Screen name="GenderSetting"  options={{ headerShown: false , animationEnabled: false}} component={GenderSetting} />
                    <Stack.Screen name="PrefrenceSettings"  options={{ headerShown: false , animationEnabled: false}} component={PrefrenceSettings} />
                    <Stack.Screen name="RatingsSetting"  options={{ headerShown: false , animationEnabled: false}} component={RatingsSetting} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}

const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
        ...DefaultTheme.colors,
        primary: "#FF5A5F",
        secondaryContainer: "#f6f6f6",
        surfaceVariant: "#f6f6f6",
        surfaceDisabled: "#808080",
        onPrimaryContainer: "#000000",
    },
};
