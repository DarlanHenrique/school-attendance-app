import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { HistoricoScreen } from '../screens/HistoricoScreen';
import { ScannerScreen } from '../screens/ScannerScreen';
import { DisciplinasStackNavigator } from './DisciplinasStackNavigator';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Scanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Meu Histórico') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'Disciplinas') {
            iconName = focused ? 'school' : 'school-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Meu Histórico" 
        component={HistoricoScreen} 
        options={{ title: 'Histórico' }}
      />
      
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen} 
      />
      
      <Tab.Screen 
        name="Disciplinas" 
        component={DisciplinasStackNavigator} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};