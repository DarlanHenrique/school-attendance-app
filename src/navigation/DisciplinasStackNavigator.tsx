import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DisciplinasListScreen } from '../screens/DisciplinasListScreen';
import { TurmaHistoricoScreen } from '../screens/TurmaHistoricoScreen';

const Stack = createStackNavigator();

export const DisciplinasStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DisciplinasList" 
        component={DisciplinasListScreen}
        options={{ title: 'Minhas Disciplinas' }} 
      />
      <Stack.Screen 
        name="TurmaHistorico" 
        component={TurmaHistoricoScreen} 
        options={{ title: 'Histórico da Turma' }}
      />
    </Stack.Navigator>
  );
};