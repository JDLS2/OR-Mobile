import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet} from 'react-native';

import {useAuth} from '../contexts/AuthContext';
import {LoadingSpinner} from '../components';
import {
  AuthScreen,
  DashboardScreen,
  MangaDetailsScreen,
  SubmitUrlScreen,
  RequestsScreen,
  AnalyticsScreen,
  SettingsScreen,
} from '../screens';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MangaDetails: {mangaId: string};
};

export type MainTabParamList = {
  Dashboard: undefined;
  Submit: undefined;
  Requests: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({label, focused}: {label: string; focused: boolean}) {
  const icons: Record<string, string> = {
    Dashboard: 'H',
    Submit: '+',
    Requests: 'R',
    Analytics: 'A',
    Settings: 'S',
  };

  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
        {icons[label] || label[0]}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#71717a',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name="Submit"
        component={SubmitUrlScreen}
        options={{tabBarLabel: 'Add'}}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
        options={{tabBarLabel: 'Requests'}}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{tabBarLabel: 'Stats'}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{tabBarLabel: 'Settings'}}
      />
    </Tab.Navigator>
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
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="MangaDetails"
              component={MangaDetailsScreen}
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#27272a',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  tabIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabIconFocused: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  tabIconText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
  },
  tabIconTextFocused: {
    color: '#7c3aed',
  },
});
