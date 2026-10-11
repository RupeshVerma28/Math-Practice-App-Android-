import { router } from 'expo-router';
import { ArrowLeft, Info } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AppButton } from '../components/AppButton';
import { SoundToggle } from '../components/SoundToggle';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../constants/theme';

export default function Settings() {
  const { soundEnabled, setSoundEnabled } = useApp();

  return (
    <Screen>
      <AppButton
        title="Back"
        icon={ArrowLeft}
        variant="ghost"
        small
        onPress={() => router.back()}
      />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>
        Preferences apply while MathSprint is running. Everything is stored locally in temporary memory.
      </Text>

      <SoundToggle value={soundEnabled} onChange={setSoundEnabled} />

      <View style={styles.note}>
        <Info size={20} color={colors.cyan} />
        <Text style={styles.noteText}>
          MathSprint works 100% offline. No accounts, analytics, tracking, advertisements, cloud sync, or personal data collection.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 20,
  },
  note: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#0F2338',
    borderWidth: 1,
    borderColor: '#1C4A6E',
    borderRadius: radius.md,
    marginTop: 20,
    alignItems: 'center',
  },
  noteText: {
    flex: 1,
    color: '#CAE4F7',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },
});
