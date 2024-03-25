import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: require('./src/assets/i18n/en.json'),
    },
    // Add other languages rrhere, referencing their JSON files
};

i18n
    .use(initReactI18next) // Initializes i18next for React
    .init({
        resources,
        lng: 'en', // Initial language
        interpolation: {
            escapeValue: false, // Prevent escaping of special characters
        },
    });

export default i18n;
