import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Player, GameState, isNumberLocked, isNumberLockedForPlayer, updatePlayerScore } from '../utils/gameTypes';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { X, Check } from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(SCREEN_WIDTH * 0.25, 80);
const LARGE_BUTTON_SIZE = Math.min(SCREEN_WIDTH * 0.35, 100);

const NUMEROS = [15, 16, 17, 18, 19, 20, 25];

type PartidaScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type PartidaScreenRouteProp = RouteProp<RootStackParamList, 'Partida'>;

export default function PartidaScreen() {
  const navigation = useNavigation<PartidaScreenNavigationProp>();
  const route = useRoute<PartidaScreenRouteProp>();
  const { players } = route.params;
  const [buttonScale] = useState(new Animated.Value(1));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    players: players,
    currentPlayerIndex: 0,
    currentRound: 1,
    currentThrow: 1,
    lockedNumbers: [],
  });
  const [gameEnded, setGameEnded] = useState(false);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleThrow = (number: number) => {
    try {
      animateButton();
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const isLocked = isNumberLocked(number, gameState.players);

      if (isLocked) {
        Alert.alert('Número bloqueado', 'Este número ya está bloqueado para todos los jugadores');
        return;
      }

      if (number === 25) { // Bullseye
        Alert.alert(
          'Tipo de tiro',
          'Selecciona el tipo de tiro',
          [
            {
              text: 'Simple',
              onPress: () => handleThrowType(number, 'singles'),
            },
            {
              text: 'Doble',
              onPress: () => handleThrowType(number, 'doubles'),
            },
            {
              text: 'Cancelar',
              style: 'cancel',
            },
          ],
          { cancelable: true }
        );
      } else if (number === 0) { // Fuera
        handleThrowType(number, 'singles');
      } else {
        Alert.alert(
          'Tipo de tiro',
          'Selecciona el tipo de tiro',
          [
            {
              text: 'Simple',
              onPress: () => handleThrowType(number, 'singles'),
            },
            {
              text: 'Doble',
              onPress: () => handleThrowType(number, 'doubles'),
            },
            {
              text: 'Triple',
              onPress: () => handleThrowType(number, 'triples'),
            },
            {
              text: 'Cancelar',
              style: 'cancel',
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error('Error en handleThrow:', error);
      Alert.alert('Error', 'Ha ocurrido un error al procesar la tirada');
    }
  };

  const handleThrowType = (number: number, type: 'singles' | 'doubles' | 'triples') => {
    try {
      const { player: updatedPlayer, hasWon } = updatePlayerScore(
        gameState.players[gameState.currentPlayerIndex],
        number,
        type,
        gameState.players
      );

      const newPlayers = [...gameState.players];
      newPlayers[gameState.currentPlayerIndex] = updatedPlayer;

      let newThrow = gameState.currentThrow + 1;
      let newPlayerIndex = gameState.currentPlayerIndex;
      let newRound = gameState.currentRound;

      if (newThrow > 3) {
        newThrow = 1;
        newPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
      }

      if (newPlayerIndex === 0 && gameState.currentPlayerIndex !== 0) {
        newRound++;
      }

      setGameState({
        ...gameState,
        players: newPlayers,
        currentThrow: newThrow,
        currentPlayerIndex: newPlayerIndex,
        currentRound: newRound,
      });

      if (hasWon) {
        Alert.alert(
          '¡Victoria!',
          `${updatedPlayer.name} ha ganado la partida al desbloquear todos los números y tener la puntuación más alta.`,
          [
            {
              text: 'Ver Resultados',
              onPress: () => {
                const winner = newPlayers.find(p => p.name === updatedPlayer.name);
                if (winner) {
                  navigation.navigate('Puntuacion', { winner });
                }
              }
            }
          ]
        );
      } else if (newRound > 20) {
        const winner = newPlayers.reduce((prev, current) => 
          (prev.score > current.score) ? prev : current
        );
        navigation.navigate('Puntuacion', { winner });
      }
    } catch (error) {
      console.error('Error en handleThrowType:', error);
      Alert.alert('Error', 'Ha ocurrido un error al actualizar la puntuación');
    }
  };

  const endGame = (winner?: Player) => {
    if (winner) {
      const currentWinner = gameState.players.find(p => p.name === winner.name);
      if (currentWinner) {
        navigation.navigate('Puntuacion', { winner: currentWinner });
      }
    } else {
      const winner = gameState.players.reduce((prev, current) => 
        (prev.score > current.score) ? prev : current
      );
      navigation.navigate('Puntuacion', { winner });
    }
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const renderNumberButton = (number: number, isLarge: boolean = false) => {
    const isLocked = isNumberLocked(number, gameState.players);
    const isLockedForPlayer = isNumberLockedForPlayer(currentPlayer, number);
    const buttonText = number === 25 ? 'Diana' : number === 0 ? 'Fuera' : number.toString();
    
    return (
      <Animated.View key={`button-${number}`} style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          onPress={() => handleThrow(number)}
          disabled={isLocked}
          style={[
            styles.numberButton,
            isLarge && styles.largeButton,
            isLocked && styles.lockedButton,
            isLockedForPlayer && !isLocked && styles.lockedForPlayerButton
          ]}
        >
          <Text style={[
            styles.buttonText,
            isLarge && styles.largeButtonText,
            isLocked && styles.lockedButtonText
          ]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderNumberStatus = (player: Player, number: number) => {
    const status = player.numbers[number];
    if (!status) return null;

    const isLocked = isNumberLockedForPlayer(player, number);
    const hitsText = `${status.hits}/3`;
    const pointsText = status.points > 0 ? ` (${status.points})` : '';

    return (
      <View key={number} style={[
        styles.numberStatusContainer,
        isLocked && styles.lockedNumberStatus
      ]}>
        <Text style={[
          styles.numberStatusText,
          isLocked && styles.lockedNumberStatusText
        ]}>
          {number}: {hitsText}{pointsText}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (gameEnded) {
      const winner = gameState.players.reduce((prev, current) => 
        (current.score > prev.score) ? current : prev
      );
      navigation.navigate('Puntuacion', { 
        winner: winner.name,
        score: winner.score
      });
    }
  }, [gameEnded, gameState, navigation]);

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Cricket</Text>
          
          <View style={styles.header}>
            <Text style={styles.subtitle}>Ronda: {gameState.currentRound}/20</Text>
            <Text style={styles.playerText}>Jugador: <Text style={styles.playerName}>{currentPlayer.name}</Text></Text>
            <Text style={styles.throwText}>Tirada: {gameState.currentThrow}/3</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonRow}>
              {[15, 16, 17].map(num => renderNumberButton(num))}
            </View>

            <View style={styles.buttonRow}>
              {[18, 19, 20].map(num => renderNumberButton(num))}
            </View>

            <View style={styles.buttonRow}>
              {renderNumberButton(25)}
              {renderNumberButton(0, true)}
            </View>
          </View>

          <View style={styles.scoresContainer}>
            <Text style={styles.subtitle}>Puntuaciones</Text>
            {gameState.players.map((player, index) => (
              <View key={`player-${index}`} style={styles.playerScoreContainer}>
                <Text style={styles.playerScoreText}>{player.name}</Text>
                <Text style={styles.scoreText}>Puntos: {player.score}</Text>
                <View style={styles.numbersStatus}>
                  {[15, 16, 17, 18, 19, 20, 25].map(num => renderNumberStatus(player, num))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
    marginBottom: 20,
    letterSpacing: 1,
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#fff',
  },
  header: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1c1c1e',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  playerText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
  playerName: {
    fontWeight: 'bold',
  },
  throwText: {
    fontSize: 16,
    color: '#fff',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    alignItems: 'center',
  },
  numberButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 12,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  largeButton: {
    width: LARGE_BUTTON_SIZE,
    height: LARGE_BUTTON_SIZE,
  },
  lockedButton: {
    backgroundColor: '#333',
    opacity: 0.7,
  },
  lockedForPlayerButton: {
    backgroundColor: '#38761d',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  largeButtonText: {
    fontSize: 24,
  },
  lockedButtonText: {
    color: '#666',
  },
  scoresContainer: {
    width: '100%',
    marginBottom: 20,
  },
  playerScoreContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1c1c1e',
  },
  playerScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#aaa',
  },
  numbersStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberStatusContainer: {
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#0A84FF',
  },
  lockedNumberStatus: {
    borderColor: '#38761d',
  },
  numberStatusText: {
    fontSize: 14,
    color: '#0A84FF',
    fontWeight: '500',
  },
  lockedNumberStatusText: {
    color: '#38761d',
  },
});