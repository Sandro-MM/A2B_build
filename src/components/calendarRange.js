import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { TitleMap } from "../styles/styles";
import {calculateDate28Day} from "../services/TodayAndThreeMonthRange";
import A2BNextIcon from "./next_icon";
function CalendarRange({ navigation, setValue }) {

    useEffect(() => {
        calculateDate28Day(setFormattedDate, setMaxDate);
    }, []);


    const [formattedDate, setFormattedDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [startDay, setStartDay] = useState('');
    const [endDay, setEndDay] = useState('');

    const handleDayPress = (day) => {
        if (!startDay) {
            console.log(0)
            setStartDay(day.dateString);
            setEndDay('');
        } else if (!endDay) {

            console.log(startDay > day.dateString)
            if (day.dateString > startDay){
                console.log(123)
                setEndDay(day.dateString);
            } else {
                setEndDay(startDay)
                setStartDay(day.dateString)
            }

        } else {
            console.log(11)
            setStartDay(day.dateString);
            setEndDay('');
        }
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

        if (startDay && endDay) {
            for (let d = new Date(startDay); d <= new Date(endDay); d.setDate(d.getDate() + 1)) {
                const dateString = d.toISOString().split('T')[0];
                marked[dateString] = {
                    color: dateString === startDay ? '#FF5A5F' : dateString === endDay ? '#FF5A5F' : '#FEE4E2',
                    textColor: dateString === startDay ? 'white' : dateString === endDay ? 'white' : 'black',
                    startingDay: dateString === startDay,
                    endingDay: dateString === endDay,
                    // customContainerStyle: dateString === startDay ?  styles.startEndDays : dateString === endDay ? styles.startEndDays : styles.range,
                    container: {borderRadius:30}
                };
            }
        } else if (startDay) {
            marked[startDay] = {
                color: '#FF5A5F',
                textColor: 'white',
                startingDay: true,
                endingDay: true,
            };
        }

        return marked;
    };

   const handleSubmit = () =>{
       setValue('startDay', startDay)
       setValue('endDay', endDay || null )
       navigation.goBack()
   }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{zIndex:2, flex:0.5, position:'absolute', backgroundColor: '#F2F3F4', top:0, left:0, width:'100%', paddingLeft:4, paddingTop:0}}>
                <TitleMap>Choose date</TitleMap>
            </View>
            {formattedDate && (
                <CalendarList
                    theme={{calendarBackground: '#F2F3F4', todayTextColor:'#FF5A5F',  dayTextColor: '#000',
                        monthTextColor: '#000', selectedDayBackgroundColor: '#FF5A5F', selectedDayTextColor: '#ffffff', day:{
                        borderRadius:0
                        }}}
                    style={{ paddingTop:29}}
                    pastScrollRange={0}
                    futureScrollRange={1}
                    minDate={formattedDate}
                    maxDate={maxDate}
                    onDayPress={handleDayPress}
                    markingType="period"
                    markedDates={getMarked()}
                />

            )}
            <A2BNextIcon onPress={handleSubmit}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default CalendarRange;
