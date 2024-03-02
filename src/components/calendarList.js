import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { TitleMap } from "../styles/styles";
import {calculateDates} from "../services/TodayAndThreeMonthRange";
function CalendarListScreen({ control, navigation, setValue }) {
    const [formattedDate, setFormattedDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const handleDayPress = (day) => {
        const selectedDate = day.dateString;
        setValue('selectedDate', selectedDate);
        navigation()
    };

    useEffect(() => {
        calculateDates(setFormattedDate, setMaxDate);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{zIndex:2, flex:0.5, position:'absolute', backgroundColor: '#F2F3F4', top:0, left:0, width:'100%', paddingLeft:4, paddingTop:0}}>
                <TitleMap>Choose date</TitleMap>
            </View>
            {formattedDate && (
                <CalendarList
                    style={{paddingTop:29}}
                    theme={{
                        calendarBackground: '#F2F3F4',
                        dayTextColor: '#000',
                        monthTextColor: '#000',
                        todayTextColor:'#FF5A5F'
                    }}
                    onDayPress={handleDayPress}
                    minDate={formattedDate}
                    pastScrollRange={0}
                    futureScrollRange={3}
                    maxDate={maxDate}
                    disableAllTouchEventsForDisabledDays={true}
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

export default CalendarListScreen;
