import { StyleSheet, Text, View } from 'react-native';
import * as React from "react";
import Navigation from "../../components/navigation";


export default function Notifications({navigation}) {



    return (
        <View style={styles.container}>
            <Text>this is Notifications</Text>

            <Navigation navigation={navigation} activeButton={'Notifications'}/>
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
