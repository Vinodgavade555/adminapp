import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './src/Navigation/stackNavigation';
import {PaperProvider} from 'react-native-paper';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {colors} from './src/Global_CSS/TheamColors';
import {ToastProvider} from 'react-native-toast-notifications';
import store from './src/Redux/Store';

const App = () => {
  return (
<<<<<<< HEAD
    <PaperProvider>
    <StatusBar
      barStyle="light-content"
      // backgroundColor="#004466"
      backgroundColor={colors.primary}
      // backgroundColor="#4f84c4"
      translucent={false}
    />
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  </PaperProvider>
=======
    <Provider store={store}>
      <ToastProvider>
        <PaperProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
            translucent={false}
          />
        
          <NavigationContainer>
            <StackNavigation />
          </NavigationContainer>
        </PaperProvider>
      </ToastProvider>
    </Provider>
>>>>>>> a3c132a83d7a7f43572baf7eeb6134ee03378ad5
  );
};

export default App;
