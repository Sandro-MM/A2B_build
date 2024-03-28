import React, {useState} from 'react';
import {Animated, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Button, IconButton} from "react-native-paper";
import {useTranslation} from "react-i18next";

export const OrderListHeader = ({ setModalVisible, navigation, departure, destination, OrdersTotalCount ,scrollY}) => {

    const [expanded, setExpanded] = useState(false);

    const categoryContainerTranslateY = scrollY.interpolate({
        inputRange: [0, 90],
        outputRange: [50, 4.2],
        extrapolate: 'clamp',
    });

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <View style={{ width: '100%', height: categoryContainerTranslateY+10, backgroundColor: 'white', zIndex: 12, paddingTop:expanded?15:0}}>
            <View style={{ backgroundColor: 'white', display: expanded ? 'none' : 'block' }}>
                <TouchableHighlight
                    style={{ marginHorizontal: 25, marginTop: 3, marginBottom: 2, borderRadius: 16, height: 48 }}
                    onPress={() => setModalVisible(true)}
                    underlayColor="rgba(128, 128, 128, 0.5)"
                >
                    <View style={{ borderRadius: 16, borderStyle: 'solid', borderColor: '#D8D9DA', borderWidth: 1, paddingTop: 3, paddingLeft: 40, height: 40 }}>
                        <IconButton
                            style={{ position: 'absolute', top: -10, left: -12, zIndex: 3 }}
                            icon="arrow-left"
                            iconColor='#7a7a7a'
                            size={32}
                            onPress={() => navigation.goBack()}
                        />
                        <Text style={{ fontSize: 20, marginTop: 3 }}>
                            {departure} → {destination}
                        </Text>
                        <Button style={{ position: 'absolute', right: 0, top: 1 }} onPress={() => navigation.navigate('ListFilterScreen')}>
                            <Text> Filter</Text>
                        </Button>
                    </View>
                </TouchableHighlight>
            </View>
            <Animated.View style={[styles.categoryContainer, { height:categoryContainerTranslateY ,display: expanded ? 'none' : 'block' }]}>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text style={styles.categoryTitle}>Car Pool</Text>
                    <View style={{ flexDirection: 'row', marginLeft:'-12%'}}>
                        <IconButton icon='car' size={25} iconColor={'#667085'} style={styles.categoryIcon} />
                        <Text style={styles.categoryText}>
                            {OrdersTotalCount}
                        </Text>
                    </View>

                </View>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text style={styles.categoryTitle}>Intercity</Text>
                    <View style={{ flexDirection: 'row', marginLeft:'-12%'}}>
                        <IconButton icon='bus' size={25} iconColor={'#667085'} style={styles.categoryIcon} />
                        <Text style={styles.categoryText}>
                            -
                        </Text>
                    </View>
                </View>
            </Animated.View>
            <View style={{ width: '40%', height: 3, backgroundColor: '#FF5A5F', alignSelf: 'center', zIndex: 99, marginBottom: 0, paddingBottom:0 }}>
                <IconButton icon={expanded?'menu-down':'menu-up'} size={25} iconColor={'#FF5A5F'} style={{ position: 'absolute', top:expanded? -22:-29, alignSelf: 'center' }} onPressOut={toggleExpand} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryText:{
        marginTop:3,
        marginLeft:-35,
        fontWeight:'600',
        color:'#667085'
    },
    categoryIcon: {
        marginTop:-19,
        width:80,
        height:50,
        paddingTop:10,
        borderRadius:0,
        paddingRight:10
    },
    categoryTitle:{
        fontWeight:'600',
        color:'#667085'
    },
    categoryContainer: {
        width:'100%',
        backgroundColor:'#fff',
        marginTop:-10,
        flexDirection:'row',
        overflow:'hidden'
    }
})
