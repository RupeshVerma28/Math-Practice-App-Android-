import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock3, Infinity, Play } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { useApp } from '../../context/AppContext';
import { colors, radius, spacing } from '../../constants/theme';

const topics = [
  ['tables', 'Tables'],
  ['squares', 'Squares'],
  ['cubes', 'Cubes'],
  ['addition', 'Addition'],
  ['subtraction', 'Subtraction'],
  ['multiplication', 'Multiplication'],
  ['division', 'Division'],
  ['mixed', 'Mixed calculations'],
];

const levels = [
  ['easy', 'Easy', 'Small, familiar numbers'],
  ['medium', 'Medium', 'Larger values and powers'],
  ['hard', 'Hard', 'A real mental workout'],
];

export default function PracticeSetup() {
  const { topic: requestedTopic } = useLocalSearchParams();
  const { beginSession } = useApp();
  const startingRef = useRef(false);

  const [topic, setTopic] = useState(
    typeof requestedTopic === 'string' && topics.some(([id]) => id === requestedTopic)
      ? requestedTopic
      : 'mixed'
  );
  const [difficulty, setDifficulty] = useState('easy');
  const [count, setCount] = useState('10');
  const [timed, setTimed] = useState(false);

  const start = () => {
    if (startingRef.current) return;
    startingRef.current = true;
    beginSession({ topic, difficulty, count, timed, timeLimit: 60 });
    router.push('/practice/session');
  };

  return (
    <Screen>
      <AppButton
        title="Home"
        icon={ArrowLeft}
        variant="ghost"
        small
        onPress={() => router.replace('/')}
      />
      <Text style={styles.title}>Set up practice</Text>
      <Text style={styles.subtitle}>
        Choose your focus topic, difficulty, and question count — or turn on the 60-second speed challenge.
      </Text>

      {/* Focus Topic Selection */}
      <Text style={styles.label}>WHAT DO YOU WANT TO PRACTICE?</Text>
      <View style={styles.topicGrid}>
        {topics.map(([id, name]) => (
          <TouchableOpacity
            key={id}
            accessibilityRole="radio"
            accessibilityLabel={`Topic ${name}`}
            accessibilityState={{ checked: topic === id }}
            onPress={() => setTopic(id)}
            style={[styles.topicChoice, topic === id && styles.activeChoice]}
          >
            <Text style={[styles.choiceText, topic === id && styles.activeChoiceText]}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Difficulty Selection */}
      <Text style={styles.label}>DIFFICULTY</Text>
      <View style={styles.levels}>
        {levels.map(([id, name, copy]) => (
          <TouchableOpacity
            key={id}
            accessibilityRole="radio"
            accessibilityLabel={`Difficulty ${name}`}
            accessibilityState={{ checked: difficulty === id }}
            onPress={() => setDifficulty(id)}
            style={[styles.level, difficulty === id && styles.activeLevel]}
          >
            <Text style={[styles.levelTitle, difficulty === id && styles.activeLevelTitle]}>
              {name}
            </Text>
            <Text style={styles.levelCopy}>{copy}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question Count Selection */}
      <Text style={styles.label}>QUESTIONS</Text>
      <View style={styles.counts}>
        {['10', '20', 'unlimited'].map((item) => (
          <TouchableOpacity
            key={item}
            accessibilityRole="radio"
            accessibilityLabel={`${item} questions`}
            accessibilityState={{ checked: count === item }}
            onPress={() => setCount(item)}
            style={[styles.count, count === item && styles.activeCount]}
          >
            {item === 'unlimited' ? (
              <Infinity size={22} color={count === item ? colors.white : colors.muted} />
            ) : (
              <Text style={[styles.countText, count === item && styles.activeCountText]}>
                {item}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* 60-Second Challenge Switch */}
      <TouchableOpacity
        accessibilityRole="switch"
        accessibilityLabel="60-second challenge timer"
        accessibilityState={{ checked: timed }}
        onPress={() => setTimed((curr) => !curr)}
        style={styles.timer}
      >
        <Clock3 size={20} color={timed ? colors.cyan : colors.muted} />
        <View style={styles.timerCopy}>
          <Text style={styles.timerTitle}>60-second challenge</Text>
          <Text style={styles.timerDesc}>Optional countdown timer. Off means no time pressure.</Text>
        </View>
        <Text style={timed ? styles.onBadge : styles.offBadge}>{timed ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>

      {/* Start Button */}
      <View style={styles.actionRow}>
        <AppButton title="Start practice" icon={Play} onPress={start} />
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
    lineHeight: 20,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 18,
  },
  label: {
    color: colors.cyan,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 14,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChoice: {
    width: '48.5%',
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  activeChoice: {
    backgroundColor: colors.blue,
    borderColor: '#8BB5FF',
  },
  choiceText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  activeChoiceText: {
    color: colors.white,
  },
  levels: {
    gap: 8,
  },
  level: {
    padding: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  activeLevel: {
    borderColor: '#73A5FF',
    backgroundColor: '#13264D',
  },
  levelTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 15,
  },
  activeLevelTitle: {
    color: colors.cyan,
  },
  levelCopy: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  counts: {
    flexDirection: 'row',
    gap: 8,
  },
  count: {
    height: 46,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCount: {
    backgroundColor: colors.blue,
    borderColor: '#8BB5FF',
  },
  countText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '900',
  },
  activeCountText: {
    color: colors.white,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 18,
  },
  timerCopy: {
    flex: 1,
  },
  timerTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  timerDesc: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  onBadge: {
    color: colors.cyan,
    fontWeight: '900',
    fontSize: 12,
    backgroundColor: '#0F2C3D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  offBadge: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionRow: {
    marginTop: 6,
    marginBottom: spacing.lg,
  },
});
