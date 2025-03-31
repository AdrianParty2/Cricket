import React from 'react';
import { View, Text, StyleSheet, useColorScheme, Animated } from 'react-native';
import { Button, ButtonText } from "@gluestack-ui/themed";
import { Player } from '../utils/gameTypes';
import { Trophy } from 'lucide-react-native';

export default function PuntuacionScreen({ route, navigation }) {
  const { winner } = route.params;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [scale] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Animated.View style={[styles.winnerContainer, { transform: [{ scale }] }]}>
        <Trophy size={64} color={isDark ? "#FFD700" : "#FFA500"} style={styles.trophyIcon} />
        <Text style={[styles.title, isDark && styles.darkText]}>¡Fin de la Partida!</Text>
        <Text style={[styles.winnerText, isDark && styles.darkText]}>Ganador:</Text>
        <Text style={[styles.winnerName, isDark && styles.darkText]}>{winner.name}</Text>
        <Text style={[styles.scoreText, isDark && styles.darkScoreText]}>Puntuación: {winner.score}</Text>
      </Animated.View>

      <Button
        size="lg"
        variant="solid"
        action="primary"
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      >
        <ButtonText style={styles.buttonText}>Nueva Partida</ButtonText>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  winnerContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 40,
    width: '100%',
    maxWidth: 400,
  },
  trophyIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  winnerText: {
    fontSize: 24,
    marginBottom: 16,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  winnerName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 28,
    color: '#007AFF',
    textAlign: 'center',
  },
  darkText: {
    color: '#fff',
  },
  darkScoreText: {
    color: '#64B5F6',
  },
  button: {
    width: '100%',
    maxWidth: 400,
    height: 64,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 