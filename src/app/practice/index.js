import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock3, Infinity, Play } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../constants/theme';

const topics = [['tables', 'Tables'], ['squares', 'Squares'], ['cubes', 'Cubes'], ['addition', 'Addition'], ['subtraction', 'Subtraction'], ['multiplication', 'Multiplication'], ['division', 'Division'], ['mixed', 'Mixed calculations']];
const levels = [['easy', 'Easy', 'Small, familiar numbers'], ['medium', 'Medium', 'Larger values and powers'], ['hard', 'Hard', 'A real mental workout']];

export default function PracticeSetup() {
  const { topic: requestedTopic } = useLocalSearchParams();
  const { beginSession } = useApp();
  const [topic, setTopic] = useState(requestedTopic || 'mixed');
  const [difficulty, setDifficulty] = useState('easy');
  const [count, setCount] = useState('10');
  const [timed, setTimed] = useState(false);
  const start = () => { beginSession({ topic, difficulty, count, timed, timeLimit: 60 }); router.push('/practice/session'); };
  return <Screen>
    <AppButton title="Home" icon={ArrowLeft} variant="ghost" small onPress={() => router.replace('/')} />
    <Text style={styles.title}>Set up practice</Text><Text style={styles.subtitle}>Pick one focus, then work at your own pace — or turn on a short optional challenge.</Text>
    <Text style={styles.label}>WHAT DO YOU WANT TO PRACTICE?</Text><View style={styles.topicGrid}>{topics.map(([id, name]) => <Choice key={id} title={name} active={topic === id} onPress={() => setTopic(id)} style={styles.topic} />)}</View>
    <Text style={styles.label}>DIFFICULTY</Text><View style={styles.levels}>{levels.map(([id, name, copy]) => <TouchableOpacity accessibilityRole="radio" accessibilityState={{ checked: difficulty === id }} key={id} onPress={() => setDifficulty(id)} style={[styles.level, difficulty === id && styles.active]}><Text style={[styles.levelTitle, difficulty === id && styles.activeText]}>{name}</Text><Text style={styles.copy}>{copy}</Text></TouchableOpacity>)}</View>
    <Text style={styles.label}>QUESTIONS</Text><View style={styles.counts}>{['10', '20', 'unlimited'].map((item) => <TouchableOpacity accessibilityRole="radio" accessibilityState={{ checked: count === item }} key={item} onPress={() => setCount(item)} style={[styles.count, count === item && styles.active]}>{item === 'unlimited' ? <Infinity size={20} color={count === item ? colors.white : colors.muted} /> : <Text style={[styles.countText, count === item && styles.activeText]}>{item}</Text>}</TouchableOpacity>)}</View>
    <TouchableOpacity accessibilityRole="switch" accessibilityState={{ checked: timed }} onPress={() => setTimed(!timed)} style={styles.timer}><Clock3 size={20} color={timed ? colors.cyan : colors.muted} /><View style={{ flex: 1 }}><Text style={styles.timerTitle}>60-second challenge</Text><Text style={styles.copy}>Optional countdown. Off means no time pressure.</Text></View><Text style={timed ? styles.on : styles.off}>{timed ? 'ON' : 'OFF'}</Text></TouchableOpacity>
    <AppButton title="Start practice" icon={Play} onPress={start} />
  </Screen>;
}
function Choice({ title, active, onPress, style }) { return <TouchableOpacity accessibilityRole="radio" accessibilityState={{ checked: active }} onPress={onPress} style={[style, styles.choice, active && styles.active]}><Text style={[styles.choiceText, active && styles.activeText]}>{title}</Text></TouchableOpacity>; }
const styles = StyleSheet.create({ title: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: spacing.lg }, subtitle: { color: colors.muted, lineHeight: 20, fontSize: 14, marginTop: 8, marginBottom: 22 }, label: { color: colors.cyan, fontWeight: '900', fontSize: 11, letterSpacing: 1, marginBottom: 10, marginTop: 16 }, topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, choice: { minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 11, justifyContent: 'center' }, topic: { width: '48.8%' }, choiceText: { color: colors.muted, fontSize: 13, fontWeight: '800' }, active: { backgroundColor: colors.blue, borderColor: '#8BB5FF' }, activeText: { color: colors.white }, levels: { gap: 8 }, level: { padding: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md }, levelTitle: { color: colors.text, fontWeight: '900', fontSize: 16 }, copy: { color: colors.muted, fontSize: 12, marginTop: 2 }, counts: { flexDirection: 'row', gap: 9 }, count: { height: 45, flex: 1, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }, countText: { color: colors.muted, fontSize: 15, fontWeight: '900' }, timer: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginVertical: 19 }, timerTitle: { color: colors.text, fontWeight: '800', fontSize: 15 }, on: { color: colors.cyan, fontWeight: '900', fontSize: 12 }, off: { color: colors.muted, fontWeight: '900', fontSize: 12 } });
