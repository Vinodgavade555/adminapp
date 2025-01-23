import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-native-toast-notifications';
import store from './src/Redux/Store';
import { colors } from './src/Global_CSS/TheamColors';
import { UserTypeProvider } from './src/Services/UserContext';
import AuthApp from './src/Navigation/AuthNavigation';

const App = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <PaperProvider>
          <UserTypeProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor={colors.primary}
              translucent={false}
            />
            <NavigationContainer>
              <AuthApp />
            </NavigationContainer>
          </UserTypeProvider>
        </PaperProvider>
      </ToastProvider>
    </Provider>
  );
};

export default App;
