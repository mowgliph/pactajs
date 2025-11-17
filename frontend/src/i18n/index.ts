import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      contracts: 'Contracts',
      notifications: 'Notifications',
      users: 'Users',
      login: 'Login',
      logout: 'Logout',
    },
  },
  es: {
    translation: {
      dashboard: 'Panel de Control',
      contracts: 'Contratos',
      notifications: 'Notificaciones',
      users: 'Usuarios',
      login: 'Iniciar Sesión',
      logout: 'Cerrar Sesión',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Default to Spanish
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;