import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert 
} from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { initializePlayer } from '../utils/gameTypes';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [players, setPlayers] = useState<string[]>(['']);
  const [playerNames, setPlayerNames] = useState<{ [key: string]: string }>({});
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleAddPlayer = () => {
    setPlayers([...players, '']);
  };

  const handleRemovePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    
    const newPlayerNames: { [key: string]: string } = {};
    Object.entries(playerNames).forEach(([key, value]) => {
      const playerIndex = parseInt(key.replace('player', ''));
      if (playerIndex < index) {
        newPlayerNames[key] = value;
      } else if (playerIndex > index) {
        newPlayerNames[`player${playerIndex - 1}`] = value;
      }
    });

    setPlayers(newPlayers);
    setPlayerNames(newPlayerNames);
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayerNames(prev => ({
      ...prev,
      [`player${index}`]: name
    }));
  };

  const handleSubmitEditing = (index: number) => {
    if (index === players.length - 1) {
      handleAddPlayer();
      setTimeout(() => {
        inputRefs.current[players.length]?.focus();
      }, 100);
    } else if (index < players.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleStartGame = () => {
    const validPlayers = Object.values(playerNames).filter(name => name.trim() !== '');
    
    if (validPlayers.length < 2) {
      Alert.alert('Error', 'Debe haber al menos 2 jugadores');
      return;
    }

    const gamePlayers = validPlayers.map(name => initializePlayer(name));
    navigation.navigate('Partida', { players: gamePlayers });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Cricket</Text>

          <View style={styles.playersContainer}>
            <Text style={styles.subtitle}>Jugadores</Text>
            {players.map((_, index) => (
              <View key={index} style={styles.playerRow}>
                <TextInput
                  ref={ref => inputRefs.current[index] = ref}
                  style={styles.input}
                  placeholder={`Jugador ${index + 1}`}
                  placeholderTextColor="#666"
                  value={playerNames[`player${index}`] || ''}
                  onChangeText={(text) => handleNameChange(index, text)}
                  onSubmitEditing={() => handleSubmitEditing(index)}
                  returnKeyType="next"
                />
                {players.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemovePlayer(index)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={24} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddPlayer}
              style={styles.addButton}
            >
              <View style={styles.buttonContent}>
                <Plus size={20} color="#007AFF" />
                <Text style={styles.addButtonText}>
                  Añadir Jugador
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleStartGame}
            disabled={Object.values(playerNames).filter(name => name.trim()).length < 2}
            style={[
              styles.startButton,
              { opacity: Object.values(playerNames).filter(name => name.trim()).length >= 2 ? 1 : 0.5 }
            ]}
          >
            <Text style={styles.startButtonText}>
              Comenzar Partida
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    letterSpacing: 1,
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#fff',
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
    flex: 1,
    height: 56,
    fontSize: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1c1c1e',
    color: '#fff',
  },
  removeButton: {
    padding: 12,
    borderRadius: 12,
  },
  addButton: {
    marginTop: 16,
    borderRadius: 16,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1c1c1e',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#0A84FF',
  },
  startButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
  },
});