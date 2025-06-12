import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

interface BlockButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

const BlockButton: React.FC<BlockButtonProps> = ({ 
  title, 
  onPress, 
  color = '#FF006E',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button, 
        { backgroundColor: color }, 
        disabled && styles.disabled
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default BlockButton;
