import { useRef } from 'react';
import { router } from 'expo-router';
import { Home, RefreshCw, SlidersHorizontal, Trophy } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { useApp } from '../../context/AppContext';
import { formatSeconds, sessionStats } from '../../utils/calculations';
import { topicLabel } from '../../utils/questionGenerator';
import { colors, radius, spacing } from '../../constants/theme';

export default function Results() {
  const { session, beginSession, clearSession } = useApp();
  const navigatingRef = useRef(false);

  if (!session) {
    router.replace('/practice');
    return null;
  }

  const stats = sessionStats(session.answers, session.elapsedSeconds);
  const encouragement =
    stats.accuracy >= 90
      ? 'Outstanding focus. You are building real speed.'
      : stats.accuracy >= 65
      ? 'Solid effort. A few more rounds will make those patterns stick.'
      : 'Every mistake shows what to practice next. Keep the pace comfortable.';

  const retry = () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    const { topic, difficulty, count, timed, timeLimit } = session;
    beginSession({ topic, difficulty, count, timed, timeLimit });
    router.replace('/practice/session');
  };

  const changeSetup = () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    router.replace('/practice');
  };

  const home = () => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    clearSession();
    router.replace('/');
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.trophy}>
          <Trophy size={32} color={colors.amber} />
        </View>
        <Text style={styles.eyebrow}>SESSION COMPLETE</Text>
        <Text style={styles.title}>{stats.accuracy}% accuracy</Text>
        <Text style={styles.copy}>{encouragement}</Text>
      </View>

      <View style={styles.scoreCard}>
        <View style={styles.score}>
          <Text style={styles.value}>{stats.correct}</Text>
          <Text style={styles.label}>Correct</Text>
        </View>
        <View style={styles.rule} />
        <View style={styles.score}>
          <Text style={[styles.value, styles.red]}>{stats.incorrect}</Text>
          <Text style={styles.label}>Incorrect</Text>
        </View>
        <View style={styles.rule} />
        <View style={styles.score}>
          <Text style={styles.value}>{stats.total}</Text>
          <Text style={styles.label}>Answered</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Detail label="Focus" value={topicLabel(session.topic)} />
        <Detail
          label="Difficulty"
          value={session.difficulty[0].toUpperCase() + session.difficulty.slice(1)}
        />
        <Detail label="Session time" value={formatSeconds(session.elapsedSeconds)} />
        <Detail
          label="Average per answer"
          value={stats.total ? `${stats.averageSeconds}s` : '—'}
        />
      </View>

      <View style={styles.actions}>
        <AppButton title="Try again" icon={RefreshCw} onPress={retry} />
        <AppButton
          title="Change difficulty"
          icon={SlidersHorizontal}
          variant="secondary"
          onPress={changeSetup}
        />
        <AppButton title="Return home" icon={Home} variant="ghost" onPress={home} />
      </View>
    </Screen>
  );
}

function Detail({ label, value }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
  },
  trophy: {
    height: 64,
    width: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#382B17',
    borderWidth: 1,
    borderColor: '#735728',
  },
  eyebrow: {
    color: colors.cyan,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontSize: 11,
    marginTop: 14,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  copy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
    marginTop: 8,
  },
  scoreCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  score: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    color: colors.green,
    fontSize: 28,
    fontWeight: '900',
  },
  red: {
    color: colors.red,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '700',
  },
  rule: {
    height: 38,
    width: 1,
    backgroundColor: colors.border,
  },
  details: {
    marginTop: 14,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  actions: {
    gap: 10,
    marginTop: 20,
    marginBottom: spacing.md,
  },
});
