import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

export function AppButton({
  title,
  onPress,
  icon: Icon,
  variant = 'primary',
  small = false,
  disabled = false,
  accessibilityLabel,
  style,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        small && styles.small,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {Icon ? (
          <Icon
            size={small ? 17 : 20}
            color={variant === 'ghost' ? colors.muted : colors.white}
            strokeWidth={2.3}
          />
        ) : null}
        {title ? (
          <Text
            style={[
              styles.text,
              styles[`${variant}Text`],
              small && styles.smallText,
            ]}
          >
            {title}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.blue,
    borderColor: '#70A4FF',
  },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: '#452033',
    borderColor: '#86425B',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.88,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  ghostText: {
    color: colors.muted,
  },
  dangerText: {
    color: colors.red,
  },
  secondaryText: {
    color: colors.text,
  },
  small: {
    minHeight: 40,
    paddingHorizontal: 12,
  },
  smallText: {
    fontSize: 14,
  },
});
