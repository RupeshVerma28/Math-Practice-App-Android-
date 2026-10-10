import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Pause, Send, X } from 'lucide-react-native';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { NumericKeypad } from '../../components/NumericKeypad';
import { useApp } from '../../context/AppContext';
import { useSound } from '../../hooks/useSound';
import { formatSeconds } from '../../utils/calculations';
import { parseAnswer } from '../../utils/answerValidator';
import { topicLabel } from '../../utils/questionGenerator';
import { colors, radius } from '../../constants/theme';

export default function Session() {
  const { session, submitAnswer, updateElapsed, clearSession, soundEnabled } = useApp();
  const { play } = useSound(soundEnabled);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [paused, setPaused] = useState(false);
  const lock = useRef(false);
  const [bump] = useState(() => new Animated.Value(0));

  useEffect(() => { if (!session) router.replace('/practice'); }, [session]);
  useEffect(() => {
    if (!session || paused) return undefined;
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      updateElapsed(elapsed);
      if (session.timed && elapsed >= session.timeLimit) router.replace('/practice/results');
    }, 1000);
    return () => clearInterval(timer);
  }, [session, paused, updateElapsed]);
  if (!session) return null;

  const handleKey = (key) => {
    if (feedback) return;
    if (key === 'back') setValue((old) => old.slice(0, -1));
    else if (key === 'clear') setValue('');
    else setValue((old) => old.length < 9 ? old + key : old);
  };
  const submit = () => {
    if (lock.current || feedback) return;
    const answer = parseAnswer(value);
    if (answer === null) return setFeedback({ correct: false, text: 'Enter a whole-number answer.' });
    lock.current = true;
    const outcome = submitAnswer(answer);
    play();
    setFeedback({ correct: outcome.correct, text: outcome.correct ? (session.streak + 1 >= 3 ? `Great streak — ${session.streak + 1} in a row!` : 'Correct — keep going!') : `The answer is ${outcome.question.answer}.` });
    Animated.sequence([Animated.timing(bump, { toValue: 1, duration: 150, useNativeDriver: true }), Animated.timing(bump, { toValue: 0, duration: 280, useNativeDriver: true })]).start();
    setTimeout(() => { setFeedback(null); setValue(''); lock.current = false; if (outcome.completed) router.replace('/practice/results'); }, outcome.completed ? 850 : 650);
  };
  const remaining = session.timed ? Math.max(0, session.timeLimit - session.elapsedSeconds) : null;
  const progress = session.count === 'unlimited' ? 0 : session.answers.length / Number(session.count) * 100;
  return <Screen scroll={false} style={styles.container}>
    <View style={styles.header}><AppButton title="" icon={X} small variant="ghost" accessibilityLabel="Exit practice" onPress={() => { clearSession(); router.replace('/practice'); }} /><View style={styles.headCopy}><Text style={styles.topic}>{topicLabel(session.topic)} · {session.difficulty}</Text><Text style={styles.counter}>Question {session.answers.length + 1} of {session.count === 'unlimited' ? '∞' : session.count}</Text></View><AppButton title="" icon={Pause} small variant="ghost" accessibilityLabel={paused ? 'Resume practice' : 'Pause practice'} onPress={() => setPaused(!paused)} /></View>
    <View style={styles.track}><View style={[styles.progress, { width: `${progress}%` }]} /></View><View style={styles.stats}><Text style={styles.stat}>✓ {session.answers.filter((item) => item.correct).length} correct</Text><Text style={styles.stat}>Streak {session.streak}</Text>{remaining !== null && <Text style={[styles.stat, remaining <= 10 && styles.urgent]}>{formatSeconds(remaining)}</Text>}</View>
    <View style={styles.questionArea}><Text style={styles.question}>{session.question.expression}</Text><Text style={styles.prompt}>What is the answer?</Text><Animated.View style={[styles.answerBox, feedback?.correct ? styles.correct : feedback ? styles.incorrect : null, { transform: [{ scale: bump.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] }) }] }]}><Text style={value ? styles.answer : styles.placeholder}>{value || '—'}</Text></Animated.View>{feedback && <Text style={[styles.feedback, feedback.correct ? styles.good : styles.bad]}>{feedback.text}</Text>}</View>
    <View style={paused && styles.dimmed} pointerEvents={paused ? 'none' : 'auto'}><NumericKeypad onKey={handleKey} /><View style={{ marginTop: 11 }}><AppButton title="Submit answer" icon={Send} disabled={paused} onPress={submit} /></View></View>
    {paused && <View style={styles.pause}><Text style={styles.pauseTitle}>Paused</Text><Text style={styles.pauseText}>Take your time. Your session is waiting.</Text><AppButton title="Resume" onPress={() => setPaused(false)} /></View>}
  </Screen>;
}

const styles = StyleSheet.create({ container: { paddingTop: 8 }, header: { flexDirection: 'row', alignItems: 'center', gap: 10 }, headCopy: { flex: 1, alignItems: 'center' }, topic: { color: colors.cyan, fontSize: 12, fontWeight: '900', textTransform: 'capitalize' }, counter: { color: colors.text, fontSize: 14, fontWeight: '800', marginTop: 2 }, track: { height: 7, borderRadius: 8, backgroundColor: colors.surfaceRaised, overflow: 'hidden', marginTop: 14 }, progress: { height: '100%', backgroundColor: colors.cyan }, stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }, stat: { color: colors.muted, fontSize: 12, fontWeight: '700' }, urgent: { color: colors.red }, questionArea: { flex: 1, minHeight: 238, justifyContent: 'center', alignItems: 'center' }, question: { color: colors.text, fontSize: 42, fontWeight: '900', textAlign: 'center' }, prompt: { color: colors.muted, fontSize: 14, marginTop: 8 }, answerBox: { width: '75%', minHeight: 65, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center', marginTop: 23 }, correct: { borderColor: colors.green, backgroundColor: '#15382F' }, incorrect: { borderColor: colors.red, backgroundColor: '#3A1E2B' }, answer: { color: colors.text, fontSize: 29, fontWeight: '900' }, placeholder: { color: '#52607C', fontSize: 29 }, feedback: { fontSize: 14, fontWeight: '800', textAlign: 'center', marginTop: 12 }, good: { color: colors.green }, bad: { color: colors.amber }, dimmed: { opacity: .4 }, pause: { position: 'absolute', left: 16, right: 16, top: '35%', padding: 22, backgroundColor: colors.overlay, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }, pauseTitle: { color: colors.text, fontSize: 25, fontWeight: '900' }, pauseText: { color: colors.muted, fontSize: 14, marginTop: 5, marginBottom: 16 } });
