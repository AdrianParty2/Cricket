export type Player = {
  name: string;
  score: number;
  numbers: {
    [key: number]: {
      hits: number;
      points: number;
      isLocked: boolean;
    };
  };
};

export type GameState = {
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  currentThrow: number;
  lockedNumbers: number[];
};

const VALID_NUMBERS = [15, 16, 17, 18, 19, 20, 25, 0]; // 0 representa "fuera"
const HITS_TO_CLOSE = 3;

export const initializePlayer = (name: string): Player => {
  const numbers: { [key: number]: { hits: number; points: number; isLocked: boolean } } = {};
  
  VALID_NUMBERS.forEach(num => {
    numbers[num] = { hits: 0, points: 0, isLocked: false };
  });

  return {
    name,
    score: 0,
    numbers,
  };
};

export const isNumberLocked = (number: number, players: Player[]): boolean => {
  if (!VALID_NUMBERS.includes(number)) return true;
  if (number === 0) return false; // El número 0 (fuera) nunca se bloquea
  return players.every(player => player.numbers[number]?.isLocked);
};

export const isNumberLockedForPlayer = (player: Player, number: number): boolean => {
  if (!VALID_NUMBERS.includes(number)) return true;
  if (number === 0) return false; // El número 0 (fuera) nunca se bloquea
  return player.numbers[number]?.isLocked || false;
};

const calculateHitsForThrow = (type: 'singles' | 'doubles' | 'triples'): number => {
  switch (type) {
    case 'singles': return 1;
    case 'doubles': return 2;
    case 'triples': return 3;
    default: return 0;
  }
};

export const updatePlayerScore = (
  player: Player,
  number: number,
  type: 'singles' | 'doubles' | 'triples',
  players: Player[]
): Player => {
  // Si el número no es válido, se retorna el jugador sin cambios
  if (!VALID_NUMBERS.includes(number)) return player;

  // Hacemos una copia para evitar mutaciones directas
  const newPlayer = { ...player };

  // Inicializamos el objeto si aún no existe para este número
  if (!newPlayer.numbers[number]) {
    newPlayer.numbers[number] = { hits: 0, points: 0, isLocked: false };
  }

  // Calculamos los hits a añadir según el tipo de tiro
  const hitsToAdd = calculateHitsForThrow(type);
  const currentHits = newPlayer.numbers[number].hits;
  const newHits = currentHits + hitsToAdd;

  // Determinamos cuántos hits son "extra"
  let extraHits = 0;
  if (currentHits >= HITS_TO_CLOSE) {
    // Si ya estaba cerrado, todos los hits cuentan como extra
    extraHits = hitsToAdd;
  } else if (newHits > HITS_TO_CLOSE) {
    // Si este tiro cierra el número y genera "exceso"
    extraHits = newHits - HITS_TO_CLOSE;
  }

  // Actualizamos el contador de hits
  newPlayer.numbers[number].hits = newHits;

  // Si se alcanza o supera el umbral de cierre (excepto para el número 0, "fuera"),
  // marcamos el número como cerrado para el jugador.
  if (number !== 0 && newHits >= HITS_TO_CLOSE) {
    newPlayer.numbers[number].isLocked = true;
  }

  // Solo se suman puntos si:
  // - El número no es "fuera" (0)
  // - Hay hits extra
  // - Y, además, el número NO está bloqueado globalmente (es decir, no han cerrado todos los jugadores)
  if (number !== 0 && extraHits > 0 && !isNumberLocked(number, players)) {
    const points = number * extraHits;
    newPlayer.score += points;
    newPlayer.numbers[number].points += points;
  }

  return newPlayer;
};
