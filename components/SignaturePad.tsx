import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Modal,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface SignaturePadProps {
  visible: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  title?: string;
}

interface Point {
  x: number;
  y: number;
}

export default function SignaturePad({ visible, onClose, onSave, title = "Digital Signature" }: SignaturePadProps) {
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const pathRef = useRef<Point[]>([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = [{ x: locationX, y: locationY }];
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = [...pathRef.current, { x: locationX, y: locationY }];
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderRelease: () => {
      setPaths(prev => [...prev, pathRef.current]);
      setCurrentPath([]);
      pathRef.current = [];
    },
  });

  const clearSignature = () => {
    setPaths([]);
    setCurrentPath([]);
    pathRef.current = [];
  };

  const saveSignature = () => {
    if (paths.length === 0 && currentPath.length === 0) {
      return;
    }
    
    // In a real app, you would convert the paths to a signature image
    const signatureData = JSON.stringify({ paths, currentPath, timestamp: Date.now() });
    onSave(signatureData);
    clearSignature();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>{title}</Text>
          
          <TouchableOpacity onPress={saveSignature} style={styles.headerButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Ionicons name="pencil" size={16} color={Colors.text.secondary} />
          <Text style={styles.instructionText}>Sign in the box below</Text>
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox} {...panResponder.panHandlers}>
            {/* Canvas area for signature - in a real app, you'd use react-native-signature-canvas or similar */}
            <View style={styles.signatureArea}>
              {paths.map((path, pathIndex) => 
                path.map((point, pointIndex) => (
                  <View
                    key={`${pathIndex}-${pointIndex}`}
                    style={[
                      styles.signatureDot,
                      {
                        left: point.x - 1,
                        top: point.y - 1,
                      }
                    ]}
                  />
                ))
              )}
              {currentPath.map((point, pointIndex) => (
                <View
                  key={`current-${pointIndex}`}
                  style={[
                    styles.signatureDot,
                    {
                      left: point.x - 1,
                      top: point.y - 1,
                    }
                  ]}
                />
              ))}
            </View>
            
            {paths.length === 0 && currentPath.length === 0 && (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Sign here</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearSignature}>
            <Ionicons name="refresh" size={16} color={Colors.text.secondary} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary.teal,
    textAlign: 'right',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  signatureContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  signatureBox: {
    height: 200,
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    position: 'relative',
  },
  signatureArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  signatureDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: Colors.text.primary,
    borderRadius: 1,
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.text.light,
    fontStyle: 'italic',
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.background.lightGrey,
    borderRadius: 20,
  },
  clearText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});