



import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Sound from 'react-native-sound';
import PauseScreen from './PauseScreen';

const JINX_IMAGE = require('../assets/images/jinx.png');
const BINGUS_IMAGE = require('../assets/images/bingus.png');

const MUSIC_PLAYLIST = [
  { title: 'Dream Thing', file: 'dream_thing' },
  { title: 'Deluge-ional - Stavros Markonis', file: 'deluge_ional' },
  { title: 'specialist - アトラスサウンドチーム', file: 'specialist' },
  { title: 'Through The Glades_ Pt. 1 - Karl Flodin', file: 'through_the_glades' },
];


const EMPTY_BOARD = Array(9).fill(null);

const Game = () => {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [mode, setMode] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const [musicVolume, setMusicVolume] = useState(1.0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const musicReference = useRef(null);

 
  useEffect(() => {
    Sound.setCategory('Playback', true); 
    return () => {
      if (musicReference.current) {
        musicReference.current.stop();
        musicReference.current.release();
      }
    };
  }, []);


 useEffect(() => {
    let isCancelled = false;

    const cleanupOldMusic = () => {
      if (musicReference.current) {
        try {
          musicReference.current.stop();
          musicReference.current.release();
        } catch (error) {
          
        }
        musicReference.current = null;
      }
    };

    // clean up previous track 
    cleanupOldMusic();

    const currentTrack = MUSIC_PLAYLIST[currentTrackIndex];
    
    
    const music = new Sound(currentTrack.file, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load music', error);
        return;
      }


      if (isCancelled) {
        return;
      }

      music.setNumberOfLoops(-1);
      music.setVolume(musicVolume);

      const playMusic = () => {
        // double check cancelation before playing
        if (isCancelled) return;

        music.play((success) => {
          if (success) {
            if (!isCancelled) {
              playMusic();
            }
          } else {
            console.log('Playback failed');
          }
        });
      };

      playMusic();
    });

    musicReference.current = music;

    return () => {
      isCancelled = true;
      cleanupOldMusic();
    };

  }, [currentTrackIndex]);

 
  
  useEffect(() => {
    if (musicReference.current) {
      musicReference.current.setVolume(musicVolume);
    }
  }, [musicVolume]);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_PLAYLIST.length);
  };

  const previousTrack = () => {
    setCurrentTrackIndex((prev) => 
      (prev - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length
    );
  };


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
    if (isPaused) return;

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
  }, [board, currentPlayer, mode, winner, isPaused]);

  const resetGame = () => {
    setBoard(EMPTY_BOARD);
    setCurrentPlayer('X');
    setWinner(null);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsPaused(false);
    resetGame();
  };

  const handleQuit = () => {
    setIsPaused(false);
    setMode(null);
    resetGame();
  };

  const renderCell = (index) => {
    const value = board[index];

    let imageSource = null;
    if (value === 'X') imageSource = JINX_IMAGE;
    if (value === 'O') imageSource = BINGUS_IMAGE;
    return (
      <TouchableOpacity
        key={index}
        style={styles.cell}
        onPress={() => handlePress(index)}
        activeOpacity={0.8}
      >
      
        {imageSource && (
          <Image source={imageSource} style={styles.cellImage} />
        )}
      </TouchableOpacity>
    );
  }

  const getPlayer = (playerSymbol) => {
    if (playerSymbol === 'X') return 'Jinx';
    if (playerSymbol === 'O') return 'Bingus';
    return playerSymbol;
  };

  const statusText = winner
    ? winner === 'draw'
      ? 'Draw!'
      : `${getPlayer(winner)} wins`
    : `${getPlayer(currentPlayer)}'s turn`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tic Tac Toe</Text>
          
          {mode && !winner && (
            <TouchableOpacity 
              style={styles.pauseButton} 
              onPress={() => setIsPaused(true)}
            >
              <Text style={styles.pauseIcon}>⏸</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.boardWrapper}>
          <View style={styles.board}>
            {Array.from({ length: 9 }, (_, i) => renderCell(i))}
          </View>

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

      <PauseScreen
        visible={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onQuit={handleQuit}
        volume={musicVolume}
        onVolumeChange={setMusicVolume}
        currentTrackName={MUSIC_PLAYLIST[currentTrackIndex].title}
        onNextTrack={nextTrack}
        onPrevTrack={previousTrack}
      />
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
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  pauseButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 10,
  },
  pauseIcon: {
    fontSize: 20,
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
    padding: 10,
  },
  cellImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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

