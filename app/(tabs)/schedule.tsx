import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DateData } from 'react-native-calendars';

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState('');

  const onDayPress = (day: DateData) => {
    setSelectedDay(day.dateString);
    // In a real app, you would show appointments for this day
    Alert.alert('Day Selected', `You selected ${day.dateString}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Schedule</Text>
      <Calendar
        style={styles.calendar}
        onDayPress={onDayPress}
        markedDates={{
          [selectedDay]: { selected: true, selectedColor: '#1976D2' }
        }}
        theme={{
          todayTextColor: '#1976D2',
          arrowColor: '#1976D2',
        }}
      />
      
      <View style={styles.appointments}>
        <Text style={styles.subHeader}>
          Appointments for {selectedDay || 'today'}:
        </Text>
        {/* You would show a list of appointments here */}
        <Text>No appointments scheduled.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { fontSize: 28, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 10, marginBottom: 10 },
  calendar: {
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointments: {
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  subHeader: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
});