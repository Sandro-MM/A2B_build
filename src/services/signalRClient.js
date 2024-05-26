import 'react-native-url-polyfill/auto';
import * as SignalR from '@microsoft/signalr';
import * as Notifications from 'expo-notifications';
import { getAccessToken } from './api';

// Create the SignalR connection
async function createConnection() {
    const accessToken = await getAccessToken();
    return new SignalR.HubConnectionBuilder()
        .withUrl(`https://api-a2b.azurewebsites.net/notificationsHub?access_token=${accessToken}`)
        .withAutomaticReconnect()
        .build();
}

// Start the connection
async function startConnection() {
    try {
        const connection = await createConnection();
        await connection.start();
        console.log('SignalR Connected.');

        // Handle incoming notifications
        connection.on('ReceiveNotification', (message, type) => {
            console.log('Received notification:', message);
            displayNotification(message);
        });
    } catch (err) {
        console.log('Error while starting connection: ' + err);
        setTimeout(startConnection, 5000);
    }
}

async function displayNotification(message) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "New Notification",
            body: message,
        },
        trigger: null, // Display immediately
    });
}

export { startConnection };
