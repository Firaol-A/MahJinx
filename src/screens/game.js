import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const EMPTY_BOARD = Array(9).fill(null);

const Game = () => {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState('X'); // X always user
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null); // 'solo' | 'duo'

  const lines = useMemo(
    () => [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
    [],
  );

  const checkWinner = useMemo(
    () => (state) => {
      for (const [a, b, c] of lines) {
        if (state[a] && state[a] === state[b] && state[a] === state[c]) {
          return state[a];
        }
      }
      return state.every(Boolean) ? 'draw' : null;
    },
    [lines],
  );

  const handlePress = (index) => {
    if (winner || board[index] || !mode) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    const nextWinner = checkWinner(nextBoard);

    setBoard(nextBoard);
    setWinner(nextWinner);
    setCurrentPlayer((prev) => (prev === 'X' ? 'O' : 'X'));
  };

  useEffect(() => {
    if (mode !== 'solo') return;
    if (winner) return;
    if (currentPlayer !== 'O') return;

    const emptyIndexes = board
      .map((cell, idx) => (cell ? null : idx))
      .filter((idx) => idx !== null);

    if (!emptyIndexes.length) return;

    const timeout = setTimeout(() => {
      const randomIndex =
        emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      handlePress(randomIndex);
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, currentPlayer, mode, winner]);

  const resetGame = () => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer('X');
    setWinner(null);
  };

  const renderCell = (index) => (
    <TouchableOpacity
      key={index}
      style={styles.cell}
      activeOpacity={0.8}
      onPress={() => handlePress(index)}
    >
      <Text style={styles.cellText}>{board[index] ?? ''}</Text>
    </TouchableOpacity>
  );

  const statusText = winner
    ? winner === 'draw'
      ? 'Draw!'
      : `${winner} wins`
    : `${currentPlayer}'s turn`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>

        <View style={styles.boardWrapper}>
          <View style={styles.board}>{Array.from({ length: 9 }, (_, i) => renderCell(i))}</View>

          {!mode && (
            <View style={styles.modeOverlay}>
              <Text style={styles.modePrompt}>Choose a mode</Text>
              <View style={styles.modeButtons}>
                <TouchableOpacity
                  style={styles.modeButton}
                  onPress={() => setMode('solo')}
                >
                  <Text style={styles.modeText}>1 Player</Text>
                  <Text style={styles.modeHint}>You vs Bot</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modeButton}
                  onPress={() => setMode('duo')}
                >
                  <Text style={styles.modeText}>2 Players</Text>
                  <Text style={styles.modeHint}>Pass & Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.status}>{statusText}</Text>

        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  boardWrapper: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 360,
    position: 'relative',
  },
  board: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#334155',
  },
  cell: {
    width: '33.3333%',
    height: '33.3333%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#334155',
    borderWidth: 1,
  },
  cellText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#38bdf8',
  },
  modeOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  modePrompt: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  modeButtons: {
    width: '100%',
    gap: 12,
  },
  modeButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0b1120',
  },
  modeHint: {
    fontSize: 12,
    color: '#0b1120',
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  resetButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  resetText: {
    color: '#0b1120',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Game;

