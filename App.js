import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AuthScreen from "./src/screens/auth/auth";
import Register_login from "./src/screens/register_login/register_login";
import Register_form from "./src/screens/register_login/register_form";
import Login_form from "./src/screens/register_login/login_form";
import Forget_password_form from "./src/screens/register_login/forget_password_form";
import Confirm_password_change from "./src/screens/register_login/confirm_password_change";
import HomeScreen from "./src/screens/home/home";
import {useEffect, useState} from "react";
import {getAccessToken} from "./src/services/api";
import Loading from "./src/components/loading";
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



export default function App() {
    enableLatestRenderer();
    const Stack = createStackNavigator();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    useEffect(() => {
        async function checkAuth() {
            try {
                const accessToken = await getAccessToken();
                if (accessToken) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
            }
        }
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <Loading/>
        );
    }
    return (
        <Provider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator>
                    {isAuthenticated ? (
                        <Stack.Screen
                            name="HomeScreen"
                            options={{ headerShown: false , animationEnabled: false }}
                            component={HomeScreen}

                        />
                    ) : (
                        <Stack.Screen name="AuthScreen" options={{ headerShown: false }} component={AuthScreen} />
                    )}
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
                    <Stack.Screen name="SettingInput"  options={{ headerShown: false }} component={SettingInput} />
                    <Stack.Screen name="VerifyPhoneNumber"  options={{ headerShown: false }} component={VerifyPhoneNumber} />
                    <Stack.Screen name="AddRide"  options={{ headerShown: false }} component={AddRide} />
                    <Stack.Screen name="AddRideCheck"  options={{ headerShown: false , animationEnabled: false}} component={AddRideCheck} />
                    <Stack.Screen name="Notifications"  options={{ headerShown: false , animationEnabled: false }} component={Notifications} />
                    <Stack.Screen name="RideHistory"  options={{ headerShown: false , animationEnabled: false }} component={RideHistory} />
                    <Stack.Screen name="Order"  options={{ headerShown: false , animationEnabled: false }} component={Order} />
                    <Stack.Screen name="MapPointViewScreen"  options={{ headerShown: false , animationEnabled: false }} component={MapPointViewScreen} />
                    <Stack.Screen name="ListFilter"  options={{ headerShown: false , animationEnabled: false }} component={ListFilter} />
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
