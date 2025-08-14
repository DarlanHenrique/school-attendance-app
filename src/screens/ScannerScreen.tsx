import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import Toast from 'react-native-toast-message';
import { useIsFocused } from '@react-navigation/native';

import { registerFrequency } from '../services/api'; 
import { useMatricula } from '../hooks/useMatricula';

export const ScannerScreen = () => {
  const { matricula, isLoading: isMatriculaLoading } = useMatricula();
  
  const isFocused = useIsFocused();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (isRegistering || !matricula) return;
    setIsRegistering(true);

    try {
      await registerFrequency({ matricula, qrCodeData: data });
      Toast.show({
        type: 'success',
        text1: 'Presença Registrada!',
        text2: 'Sua frequência foi computada com sucesso.',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao Registrar',
        text2: error.message || 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setTimeout(() => setIsRegistering(false), 3000);
    }
  };
  
  if (isMatriculaLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#FFFFFF" /></View>;
  }
  
  if (!matricula) {
    return <View style={styles.container}><Text style={{ color: 'white' }}>Erro: Matrícula não encontrada.</Text></View>;
  }
  
  if (hasPermission === null) {
    return <View style={styles.container}><Text style={{ color: 'white' }}>Solicitando permissão...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text style={{ color: 'white' }}>Acesso à câmera negado.</Text></View>;
  }

  if (!isFocused) {
    return <View style={styles.container}><Text style={{color: 'white'}}>Carregando câmera...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={isRegistering ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Aponte para o QR Code da Aula</Text>
        <View style={styles.scannerBox} />
        <Text style={styles.matriculaText}>Matrícula: {matricula}</Text>
      </View>
      {isRegistering && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  overlay: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  title: { fontSize: 22, color: 'white', fontWeight: 'bold', position: 'absolute', top: '20%' },
  scannerBox: { width: 250, height: 250, borderWidth: 2, borderColor: 'white', borderRadius: 10 },
  matriculaText: { fontSize: 16, color: 'white', position: 'absolute', bottom: '15%' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }
});