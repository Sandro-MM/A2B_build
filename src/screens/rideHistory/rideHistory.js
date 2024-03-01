import { StyleSheet, Text, View } from 'react-native';
import * as React from "react";
import Navigation from "../../components/navigation";


export default function RideHistory({navigation}) {



    return (
        <View style={styles.container}>
            <Text>this is RideHistory</Text>

            <Navigation navigation={navigation} activeButton={'RideHistory'}/>
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
