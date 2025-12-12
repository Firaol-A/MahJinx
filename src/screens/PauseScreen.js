import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const PauseScreen = ({ 
  visible, 
  onResume, 
  onRestart, 
  onQuit, 
  volume, 
  onVolumeChange,
  currentTrackName,
  onNextTrack,
  onPrevTrack,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.5);

  useEffect(() => {
    if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume]);

  const onSliderChange = (value) => {
    onVolumeChange(value);
    if (value > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(previousVolume > 0 ? previousVolume : 0.5);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return '🔇';
    if (volume < 0.3) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>PAUSED</Text>

        
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Music</Text>
            <View style={styles.playerControls}>
              <TouchableOpacity onPress={onPrevTrack} style={styles.controlButton}>
                <Text style={styles.controlIcon}>⏮</Text>
              </TouchableOpacity>
              
              <View style={styles.trackInfo}>
                <Text style={styles.trackIcon}>🎵</Text>
                <Text style={styles.trackName} numberOfLines={1}>
                  {currentTrackName}
                </Text>
              </View>

              <TouchableOpacity onPress={onNextTrack} style={styles.controlButton}>
                <Text style={styles.controlIcon}>⏭</Text>
              </TouchableOpacity>
            </View>
          </View>

          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Volume</Text>
            
            <View style={styles.volumeControl}>
              <TouchableOpacity 
                onPress={toggleMute} 
                style={styles.muteButton}
              >
                <Text style={styles.volumeIcon}>{getVolumeIcon()}</Text>
              </TouchableOpacity>

              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={isMuted ? 0 : volume}
                onValueChange={onSliderChange}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#555555"
                thumbTintColor="#4CAF50"
                disabled={isMuted}
              />

              <Text style={styles.volumePercentage}>
                {isMuted ? '0' : Math.round(volume * 100)}%
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resumeButton]} 
              onPress={onResume}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>▶  Resume</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.restartButton]} 
              onPress={onRestart}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>↻  Restart</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.quitButton]} 
              onPress={onQuit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>✕  Quit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 400,
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#3D5166',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: 4,
  },
  
  sectionContainer: {
    width: '100%',
    backgroundColor: '#34495E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#BDC3C7',
    marginBottom: 12,
    fontWeight: '600',
  },
  
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  
  },
  controlButton: {
    padding: 10,
  },
  controlIcon: {
    fontSize: 24,
    color: '#ECF0F1',
  },
  trackInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  trackIcon: {
    fontSize: 24, 
    marginBottom: 4,
  },
  trackName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  muteButton: {
    padding: 8,
    paddingLeft: 0,
  },
  volumeIcon: {
    fontSize: 24,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  volumePercentage: {
    color: '#FFFFFF',
    fontSize: 14,
    minWidth: 45,
    textAlign: 'right',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  restartButton: {
    backgroundColor: '#FF9800',
  },
  quitButton: {
    backgroundColor: '#E74C3C',
    marginBottom: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PauseScreen;