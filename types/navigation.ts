import type { Player } from '../utils/gameTypes';

export type RootStackParamList = {
  Home: undefined;
  Partida: {
    players: Player[];
  };
  Puntuacion: {
    winner: string;
    score: number;
  };
}; 