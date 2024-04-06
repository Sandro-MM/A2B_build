import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import {TitleMap} from "../../styles/styles";
import {calculateDates} from "../../services/TodayAndThreeMonthRange";

function EditDate({ route }) {
    const { navigation, setValue, RideDate} = route.params;
    const [formattedDate, setFormattedDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [startDay, setStartDay] = useState('');


    const handleDayPress = (day) => {
        setStartDay(day.dateString);
        setValue(null , day.dateString);
        navigation.goBack()
    };

    const styles = StyleSheet.create({
        startEndDays: {
            color:'blue',
            backgroundColor:'red'
        },
        range: {
            marginTop: 4,
            backgroundColor:'#FEE4E2',
            borderRadius:0,
            height:26,
            width:47
        },
    })

    const getMarked = () => {
        let marked = {};
         if (startDay) {
            marked[startDay] = {
                color: '#FF5A5F',
                textColor: 'white',
                startingDay: true,
                endingDay: true,
            };
        }

        return marked;
    };


    useEffect(() => {
        if (RideDate){
            calculateDates(setFormattedDate, setMaxDate);
            setFormattedDate(RideDate)
        }else {
            calculateDates(setFormattedDate, setMaxDate);
        }

    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{zIndex:2, flex:0.5, position:'absolute', backgroundColor: '#F2F3F4', top:0, left:0, width:'100%', paddingLeft:4, paddingTop:0}}>
                <TitleMap>Choose date</TitleMap>
            </View>
            {formattedDate && (
                <CalendarList
                    style={{paddingTop:29}}
                    theme={{calendarBackground: '#F2F3F4', todayTextColor:'#FF5A5F',  dayTextColor: '#000',
                        monthTextColor: '#000', selectedDayBackgroundColor: '#FF5A5F', selectedDayTextColor: '#ffffff', day:{
                            borderRadius:0
                        }}}
                    onDayPress={handleDayPress}
                    minDate={formattedDate}
                    pastScrollRange={0}
                    markingType="period"
                    futureScrollRange={3}
                    maxDate={maxDate}
                    disableAllTouchEventsForDisabledDays={true}
                    markedDates={getMarked()}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default EditDate;
