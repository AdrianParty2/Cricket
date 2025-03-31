import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, useColorScheme } from 'react-native';
import { Button, ButtonText, Input, InputField } from "@gluestack-ui/themed";
import { Plus, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { initializePlayer } from '../utils/gameTypes';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [players, setPlayers] = useState<string[]>(['']);
  const [playerNames, setPlayerNames] = useState<{ [key: string]: string }>({});
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAddPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, '']);
    } else {
      Alert.alert('Límite alcanzado', 'El máximo de jugadores es 4');
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 1) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
      
      const newPlayerNames = { ...playerNames };
      delete newPlayerNames[`player${index}`];
      setPlayerNames(newPlayerNames);
    } else {
      Alert.alert('Error', 'Debe haber al menos un jugador');
    }
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayerNames(prev => ({
      ...prev,
      [`player${index}`]: name
    }));
  };

  const handleStartGame = () => {
    const validPlayers = Object.values(playerNames).filter(name => name.trim() !== '');
    
    if (validPlayers.length < 2) {
      Alert.alert('Error', 'Debe haber al menos 2 jugadores');
      return;
    }

    if (validPlayers.length !== new Set(validPlayers).size) {
      Alert.alert('Error', 'No puede haber nombres duplicados');
      return;
    }

    const gamePlayers = validPlayers.map(name => initializePlayer(name));
    navigation.navigate('Partida', { players: gamePlayers });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, isDark && styles.darkContainer]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.title, isDark && styles.darkText]}>Cricket</Text>
          
          <View style={styles.playersContainer}>
            <Text style={[styles.subtitle, isDark && styles.darkText]}>Jugadores</Text>
            {players.map((_, index) => (
              <View key={index} style={styles.playerRow}>
                <Input 
                  flex={1}
                  size="lg"
                  variant="outline"
                >
                  <InputField
                    placeholder={`Jugador ${index + 1}`}
                    value={playerNames[`player${index}`] || ''}
                    onChangeText={(text) => handleNameChange(index, text)}
                    style={[styles.input, isDark && styles.darkInput]}
                    onSubmitEditing={handleAddPlayer}
                  />
                </Input>
                {players.length > 1 && (
                  <View
                    onTouchEnd={() => handleRemovePlayer(index)}
                    style={[styles.removeButton, isDark && styles.darkRemoveButton]}
                  >
                    <Trash2 size={24} color={isDark ? "#ff6b6b" : "#ef4444"} />
                  </View>
                )}
              </View>
            ))}
            
            {players.length < 4 && (
            <Button
            size="lg"
            variant="outline"
            onPress={handleAddPlayer}
            style={styles.addButton}
          >
            <View style={styles.buttonContent}>
              <Plus size={20} style={styles.addIcon} />
              <ButtonText style={styles.addButtonText}>Añadir Jugador</ButtonText>
            </View>
          </Button>
            )}
          </View>

          <Button
  size="lg"
  onPress={handleStartGame}
  style={styles.startButton}
>
  <ButtonText style={styles.startButtonText}>Iniciar Partida</ButtonText>
</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    darkContainer: {
      backgroundColor: '#1a1a1a',
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      maxWidth: 600,
      width: '100%',
      alignSelf: 'center',
    },
    title: {
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 40,
      color: '#1a1a1a',
      letterSpacing: 1,
    },
    darkText: {
      color: '#fff',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
      color: '#1a1a1a',
    },
    playersContainer: {
      width: '100%',
      marginBottom: 40,
    },
    playerRow: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'center',
      gap: 12,
    },
    input: {
      height: 56,
      fontSize: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 12,
      paddingHorizontal: 16,
    },
    darkInput: {
      backgroundColor: '#2d2d2d',
      color: '#fff',
    },
    removeButton: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: '#f5f5f5',
    },
    darkRemoveButton: {
      backgroundColor: '#2d2d2d',
    },
    addButton: {
      marginTop: 16,
      borderColor: '#007AFF',
      backgroundColor: 'transparent',
      borderRadius: 16,
      height: 56,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addIcon: {
      marginRight: 8,
      color: '#007AFF',
    },
    addButtonText: {
      color: '#007AFF',
      fontWeight: '600',
    },
    startButton: {
      width: '100%',
      height: 64,
      backgroundColor: '#007AFF',
      borderRadius: 16,
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    startButtonText: {
      fontSize: 20,
      fontWeight: '600',
      color: '#fff',
      textAlign: 'center',
    },
  });