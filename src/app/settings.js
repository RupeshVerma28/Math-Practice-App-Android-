import { router } from 'expo-router';
import { ArrowLeft, Info } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { AppButton } from '../components/AppButton';
import { SoundToggle } from '../components/SoundToggle';
import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../constants/theme';
export default function Settings() { const { soundEnabled, setSoundEnabled } = useApp(); return <Screen><AppButton title="Back" icon={ArrowLeft} variant="ghost" small onPress={() => router.back()} /><Text style={styles.title}>Settings</Text><Text style={styles.subtitle}>These options are only used while MathSprint is open. Nothing is saved or sent anywhere.</Text><SoundToggle value={soundEnabled} onChange={setSoundEnabled} /><View style={styles.note}><Info size={19} color={colors.cyan} /><Text style={styles.noteText}>MathSprint works offline. It has no accounts, tracking, ads, cloud sync, or saved personal progress.</Text></View></Screen>; }
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: spacing.lg }, subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 22 }, note: { flexDirection: 'row', gap: 10, padding: 15, backgroundColor: '#102D42', borderWidth: 1, borderColor: '#245C78', borderRadius: radius.md, marginTop: 17 }, noteText: { flex: 1, color: '#CBE7F8', fontSize: 13, lineHeight: 19 } });
