import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Trophy } from 'lucide-react-native';

export default function PuntuacionScreen({ route, navigation }) {
  const { winner } = route.params;
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
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.winnerContainer, { transform: [{ scale }] }]}>
          <Trophy size={64} color="#FFD700" style={styles.trophyIcon} />
          <Text style={styles.title}>¡Fin de la Partida!</Text>
          <Text style={styles.winnerText}>Ganador:</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.scoreText}>Puntuación: {winner.score}</Text>
        </Animated.View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>
            Nueva Partida
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  winnerContainer: {
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 40,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333',
  },
  trophyIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
  },
  winnerText: {
    fontSize: 24,
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  winnerName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 28,
    color: '#0A84FF',
    textAlign: 'center',
  },
  startButton: {
    width: '100%',
    maxWidth: 400,
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