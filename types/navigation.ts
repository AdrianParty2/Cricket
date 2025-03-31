import { Player } from '../utils/gameTypes';

export type RootStackParamList = {
  Home: undefined;
  Partida: { players: Player[] };
}; 