import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { useMatricula } from './src/hooks/useMatricula';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MatriculaScreen } from './src/screens/MatriculaScreen';

const App = () => {
  const { matricula, isLoading } = useMatricula();

  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <>
      <NavigationContainer>
        {matricula ? (
          <AppNavigator />
        ) : (
          <MatriculaScreen />
        )}
      </NavigationContainer>
      
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0'
  }
});

export default App;