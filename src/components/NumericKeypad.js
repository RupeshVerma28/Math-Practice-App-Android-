import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Delete, RotateCcw } from 'lucide-react-native';
import { colors, radius } from '../constants/theme';

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];

export function NumericKeypad({ onKey, disabled = false }) {
  return (
    <View style={styles.grid}>
      {keys.map((key) => {
        const isUtility = key === 'back' || key === 'clear';
        const label = key === 'back' ? 'Backspace' : key === 'clear' ? 'Clear answer' : `Number ${key}`;
        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            disabled={disabled}
            key={key}
            onPress={() => onKey(key)}
            activeOpacity={0.7}
            style={[
              styles.key,
              isUtility && styles.utility,
              disabled && styles.disabledKey,
            ]}
          >
            {key === 'back' ? (
              <Delete color={disabled ? colors.muted : colors.text} size={22} />
            ) : key === 'clear' ? (
              <RotateCcw color={disabled ? colors.muted : colors.muted} size={20} />
            ) : (
              <Text style={[styles.text, disabled && styles.disabledText]}>{key}</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    width: '100%',
  },
  key: {
    width: '31.5%',
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  utility: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  disabledKey: {
    opacity: 0.5,
  },
  text: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  disabledText: {
    color: colors.muted,
  },
});
