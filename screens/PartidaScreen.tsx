import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, useColorScheme, Animated, Dimensions } from 'react-native';
import { Button, ButtonText } from "@gluestack-ui/themed";
import { Player, GameState, initializePlayer, isNumberLocked, isNumberLockedForPlayer, updatePlayerScore } from '../utils/gameTypes';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(SCREEN_WIDTH * 0.25, 80); // 25% del ancho de pantalla o máximo 80
const LARGE_BUTTON_SIZE = Math.min(SCREEN_WIDTH * 0.35, 100); // 35% del ancho de pantalla o máximo 100

export default function PartidaScreen({ route, navigation }) {
  const { players: initialPlayers } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [buttonScale] = useState(new Animated.Value(1));

  const [gameState, setGameState] = useState<GameState>({
    players: initialPlayers,
    currentPlayerIndex: 0,
    currentRound: 1,
    currentThrow: 1,
    lockedNumbers: [],
  });

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
      const newPlayers = [...gameState.players];
      newPlayers[gameState.currentPlayerIndex] = updatePlayerScore(
        newPlayers[gameState.currentPlayerIndex],
        number,
        type,
        newPlayers
      );

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

      if (newRound > 20) {
        endGame();
      }
    } catch (error) {
      console.error('Error en handleThrowType:', error);
      Alert.alert('Error', 'Ha ocurrido un error al actualizar la puntuación');
    }
  };

  const endGame = () => {
    const winner = gameState.players.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    navigation.navigate('Puntuacion', { winner });
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const renderNumberButton = (number: number, isLarge: boolean = false) => {
    const isLocked = isNumberLocked(number, gameState.players);
    const isLockedForPlayer = isNumberLockedForPlayer(currentPlayer, number);
    const buttonText = number === 25 ? 'Diana' : number === 0 ? 'Fuera' : number.toString();
    
    return (
      <Animated.View key={`button-${number}`} style={{ transform: [{ scale: buttonScale }] }}>
        <Button
          size="lg"
          variant="solid"
          action={isLocked ? "secondary" : isLockedForPlayer ? "warning" : "primary"}
          onPress={() => handleThrow(number)}
          style={[
            styles.numberButton,
            isLarge && styles.largeButton,
            isLocked && styles.lockedButton
          ]}
          isDisabled={isLocked}
        >
          <ButtonText style={[
            styles.buttonText,
            isLarge && styles.largeButtonText,
            isLocked && styles.lockedButtonText
          ]}>
            {buttonText}
          </ButtonText>
        </Button>
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

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, isDark && styles.darkHeader]}>
        <Text style={[styles.roundText, isDark && styles.darkText]}>Ronda: {gameState.currentRound}/20</Text>
        <Text style={[styles.playerText, isDark && styles.darkText]}>Jugador: <Text style={{fontWeight: 'bold'}}>{currentPlayer.name}</Text></Text>
        <Text style={[styles.throwText, isDark && styles.darkText]}>Tirada: {gameState.currentThrow}/3</Text>
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

      <ScrollView 
        style={[styles.scoresContainer, isDark && styles.darkScoresContainer]}
        contentContainerStyle={styles.scoresContent}
        showsVerticalScrollIndicator={false}
      >
        {gameState.players.map((player, index) => (
          <View key={`player-${index}`} style={[
            styles.playerScoreContainer,
            isDark && styles.darkPlayerScoreContainer
          ]}>
            <Text style={[
              styles.playerName,
              isDark && styles.darkText
            ]}>{player.name}</Text>
            <Text style={[
              styles.scoreText,
              isDark && styles.darkScoreText
            ]}>Puntos: {player.score}</Text>
            <View style={styles.numbersStatus}>
              {[15, 16, 17, 18, 19, 20, 25].map(num => renderNumberStatus(player, num))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SCREEN_WIDTH * 0.05, // 5% del ancho de la pantalla
    backgroundColor: '#F5FCFF',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    marginBottom: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  darkHeader: {
    backgroundColor: '#2d2d2d',
  },
  roundText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.05, 20),
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  playerText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.045, 18),
    marginBottom: 8,
    color: '#1a1a1a',
  },
  throwText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.045, 18),
    marginBottom: 8,
    color: '#1a1a1a',
  },
  darkText: {
    color: '#fff',
  },
  buttonsContainer: {
    marginBottom: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SCREEN_HEIGHT * 0.02,
    alignItems: 'center',
  },
  numberButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE * 0.2,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeButton: {
    width: LARGE_BUTTON_SIZE,
    height: LARGE_BUTTON_SIZE,
  },
  lockedButton: {
    opacity: 0.7,
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.06, 24),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  largeButtonText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.07, 28),
  },
  lockedButtonText: {
    color: '#666',
  },
  scoresContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  darkScoresContainer: {
    backgroundColor: '#2d2d2d',
  },
  scoresContent: {
    padding: SCREEN_WIDTH * 0.04,
  },
  playerScoreContainer: {
    marginBottom: SCREEN_HEIGHT * 0.02,
    padding: SCREEN_WIDTH * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkPlayerScoreContainer: {
    borderBottomColor: '#444',
  },
  playerName: {
    fontSize: Math.min(SCREEN_WIDTH * 0.045, 18),
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  scoreText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.04, 16),
    color: '#666',
    marginBottom: 8,
  },
  darkScoreText: {
    color: '#aaa',
  },
  numbersStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SCREEN_WIDTH * 0.02,
  },
  numberStatusContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: SCREEN_WIDTH * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedNumberStatus: {
    backgroundColor: '#E8F5E9',
  },
  numberStatusText: {
    fontSize: Math.min(SCREEN_WIDTH * 0.035, 14),
    color: '#1976D2',
    fontWeight: '500',
    textAlign: 'center',
  },
  lockedNumberStatusText: {
    color: '#4CAF50',
  },
});