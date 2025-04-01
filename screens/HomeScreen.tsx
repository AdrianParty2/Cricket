import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, useColorScheme, TextInput } from 'react-native';
import { Button, ButtonText, Input, InputField } from "@gluestack-ui/themed";
import { Plus, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { initializePlayer } from '../utils/gameTypes';
import { lightTheme, darkTheme } from '../utils/theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [players, setPlayers] = useState<string[]>(['']);
  const [playerNames, setPlayerNames] = useState<{ [key: string]: string }>({});
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleAddPlayer = () => {
    setPlayers([...players, '']);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 2) {
      Alert.alert('Error', 'Debe haber al menos 2 jugadores');
      return;
    }
    
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
    
    const newPlayerNames = { ...playerNames };
    // Reajustar las keys para mantener la secuencia correcta
    for (let i = index; i < players.length - 1; i++) {
      newPlayerNames[`player${i}`] = newPlayerNames[`player${i + 1}`];
    }
    delete newPlayerNames[`player${players.length - 1}`];
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
      // Si estamos en el último input, crear uno nuevo
      handleAddPlayer();
      // El nuevo input se creará en el siguiente render
      setTimeout(() => {
        inputRefs.current[players.length]?.focus();
      }, 100);
    } else {
      // Si no estamos en el último, pasar al siguiente
      inputRefs.current[index + 1]?.focus();
    }
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
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Cricket</Text>
          
          <View style={styles.playersContainer}>
            <Text style={[styles.subtitle, { color: theme.text }]}>Jugadores</Text>
            {players.map((_, index) => (
              <View key={index} style={styles.playerRow}>
                <Input 
                  flex={1}
                  size="lg"
                  variant="outline"
                >
                  <InputField
                    ref={ref => inputRefs.current[index] = ref}
                    placeholder={`Jugador ${index + 1}`}
                    value={playerNames[`player${index}`] || ''}
                    onChangeText={(text) => handleNameChange(index, text)}
                    style={[styles.input, { 
                      backgroundColor: theme.surface,
                      color: theme.text,
                    }]}
                    placeholderTextColor={theme.textSecondary}
                    onSubmitEditing={() => handleSubmitEditing(index)}
                    returnKeyType="next"
                  />
                </Input>
                {players.length > 2 && (
                  <View
                    onTouchEnd={() => handleRemovePlayer(index)}
                    style={[styles.removeButton, { backgroundColor: theme.surface }]}
                  >
                    <Trash2 size={24} color={isDark ? "#ff6b6b" : "#ef4444"} />
                  </View>
                )}
              </View>
            ))}
            
            <Button
              size="lg"
              variant="outline"
              onPress={handleAddPlayer}
              style={[styles.addButton, { 
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              }]}
            >
              <View style={styles.buttonContent}>
                <Plus size={20} style={styles.addIcon} />
                <ButtonText style={styles.addButtonText}>Añadir Jugador</ButtonText>
              </View>
            </Button>
          </View>

          <Button
            size="lg"
            variant="solid"
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
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
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
    borderRadius: 12,
    paddingHorizontal: 16,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addIcon: {
    color: '#007AFF',
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  startButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});