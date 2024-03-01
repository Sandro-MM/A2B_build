import { StyleSheet, Text, View } from 'react-native';
import {BtnTextAuth, RedBtn} from "../../styles/styles";
import * as React from "react";
import Navigation from "../../components/navigation";


export default function AddRideCheck({navigation}) {



    return (
        <View style={styles.container}>
            <Text>this is Add Ride Check</Text>
            <RedBtn buttonColor='#FF5A5F' mode="contained" onPress={() => navigation.navigate('AddRide')}>
                <BtnTextAuth>Add ride</BtnTextAuth>
            </RedBtn>
            <Navigation navigation={navigation} activeButton={'AddRideCheck'}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
