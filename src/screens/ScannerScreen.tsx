import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

interface ScannerScreenProps {
  matricula: string;
}

export const ScannerScreen = ({ matricula }: ScannerScreenProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    console.log(`QR Code lido com sucesso! Tipo: ${type} Valor: ${data}`);
    
    Alert.alert(
      "Frequência a ser Registrada",
      `Matrícula: ${matricula}\nSenha do QR Code: ${data}`,
      [{ text: "Escanear Novamente", onPress: () => setScanned(false) }]
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Solicitando permissão da câmera...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Acesso à câmera negado.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Aponte para o QR Code</Text>
        <View style={styles.scannerBox} />
        <Text style={styles.matriculaText}>Matrícula: {matricula}</Text>
      </View>
      {scanned && <Button title={'Escanear Novamente'} onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
    top: '20%'
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10
  },
  matriculaText: {
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    bottom: '15%'
  }
});