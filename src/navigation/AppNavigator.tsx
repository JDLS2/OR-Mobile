import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {useAuth} from '../contexts/AuthContext';
import {LoadingSpinner, DrawerContent} from '../components';
import {
  AuthScreen,
  DashboardScreen,
  MediaDetailsScreen,
  SubmitUrlScreen,
  RequestsScreen,
  AnalyticsScreen,
  ResetPasswordScreen,
  ReadInAppScreen,
} from '../screens';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MediaDetails: {mediaId: string};
  ResetPassword: undefined;
};

export type DrawerParamList = {
  Dashboard: undefined;
  Submit: undefined;
  Requests: undefined;
  Analytics: undefined;
  ReadInApp: {url?: string} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: '#0f0f0f',
          width: 280,
        },
        overlayColor: 'rgba(0, 0, 0, 0.7)',
      }}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Submit" component={SubmitUrlScreen} />
      <Drawer.Screen name="ReadInApp" component={ReadInAppScreen} />
      <Drawer.Screen name="Requests" component={RequestsScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#0f0f0f'},
        }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainDrawer} />
            <Stack.Screen
              name="MediaDetails"
              component={MediaDetailsScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
