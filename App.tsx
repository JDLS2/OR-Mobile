import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import {AuthProvider} from './src/contexts/AuthContext';
import {AppNavigator} from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
