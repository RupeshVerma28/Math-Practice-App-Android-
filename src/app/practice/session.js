import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Pause, Play, Send, X } from 'lucide-react-native';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { NumericKeypad } from '../../components/NumericKeypad';
import { useApp } from '../../context/AppContext';
import { useSound } from '../../hooks/useSound';
import { formatSeconds } from '../../utils/calculations';
import { parseAnswer } from '../../utils/answerValidator';
import { topicLabel } from '../../utils/questionGenerator';
import { colors, radius, spacing } from '../../constants/theme';

export default function Session() {
  const { session, submitAnswer, updateElapsed, clearSession, soundEnabled } = useApp();
  const { playCorrect, playIncorrect, playComplete } = useSound(soundEnabled);
  const { height } = useWindowDimensions();
  const isCompact = height < 680;

  const [value, setValue] = useState('');
  const [hint, setHint] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [paused, setPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittingRef = useRef(false);
  const hintTimeoutRef = useRef(null);
  const advanceTimeoutRef = useRef(null);
  const sessionCompletedRef = useRef(false);
  const activeSessionIdRef = useRef(session?.id);
  const [bump] = useState(() => new Animated.Value(0));

  useEffect(() => {
    activeSessionIdRef.current = session?.id;
  }, [session?.id]);

  useEffect(() => {
    if (!session) {
      router.replace('/practice');
    }
  }, [session]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    };
  }, []);

  // Practice session timer
  useEffect(() => {
    if (!session || paused || sessionCompletedRef.current) return undefined;

    const timer = setInterval(() => {
      const currentId = activeSessionIdRef.current;
      if (!currentId) return;

      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      updateElapsed(elapsed, currentId);

      if (session.timed && elapsed >= session.timeLimit) {
        clearInterval(timer);
        if (!sessionCompletedRef.current) {
          sessionCompletedRef.current = true;
          if (session.answers.length > 0) {
            playComplete();
          }
          router.replace('/practice/results');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session, paused, updateElapsed, playComplete]);

  if (!session) return null;

  const showHint = (msg) => {
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    setHint(msg);
    hintTimeoutRef.current = setTimeout(() => {
      setHint('');
    }, 2200);
  };

  const handleKey = (key) => {
    if (submittingRef.current || paused) return;

    if (hint) {
      setHint('');
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    }

    if (key === 'back') {
      setValue((old) => (old.length > 0 ? old.slice(0, -1) : ''));
    } else if (key === 'clear') {
      setValue('');
    } else {
      setValue((old) => {
        if (old.length >= 9) return old;
        if (old === '0' && key !== '0') return key;
        return old + key;
      });
    }
  };

  const submit = () => {
    if (submittingRef.current || paused) return;

    const cleanInput = value.trim();
    if (!cleanInput) {
      showHint('Enter an answer first.');
      return;
    }

    const answer = parseAnswer(cleanInput);
    if (answer === null) {
      showHint('Enter a whole-number answer.');
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    setHint('');

    const outcome = submitAnswer(answer, session.id);
    if (!outcome) {
      submittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    if (outcome.correct) {
      playCorrect();
    } else {
      playIncorrect();
    }

    if (outcome.completed) {
      sessionCompletedRef.current = true;
      playComplete();
    }

    setFeedback({
      correct: outcome.correct,
      text: outcome.correct
        ? outcome.newStreak >= 3
          ? `Streak of ${outcome.newStreak}! Keep it up!`
          : 'Correct — keep going!'
        : `The answer is ${outcome.question.answer}.`,
    });

    Animated.sequence([
      Animated.timing(bump, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(bump, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();

    const delay = outcome.completed ? 850 : 650;
    advanceTimeoutRef.current = setTimeout(() => {
      if (outcome.completed) {
        router.replace('/practice/results');
      } else {
        setFeedback(null);
        setValue('');
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    }, delay);
  };

  const handleExit = () => {
    if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    clearSession();
    router.replace('/practice');
  };

  const remaining = session.timed
    ? Math.max(0, session.timeLimit - session.elapsedSeconds)
    : null;

  const totalCount = session.count === 'unlimited' ? null : Number(session.count);
  const progress = totalCount ? (session.answers.length / totalCount) * 100 : 0;
  const currentQuestionNumber = session.answers.length + 1;

  return (
    <Screen scroll={false} style={styles.container}>
      {/* Session Top Header */}
      <View style={styles.header}>
        <AppButton
          title=""
          icon={X}
          small
          variant="ghost"
          accessibilityLabel="Exit practice session"
          onPress={handleExit}
        />
        <View style={styles.headCopy}>
          <Text style={styles.topic}>
            {topicLabel(session.topic)} · {session.difficulty}
          </Text>
          <Text style={styles.counter}>
            Question {currentQuestionNumber} of {totalCount ?? '∞'}
          </Text>
        </View>
        <AppButton
          title=""
          icon={paused ? Play : Pause}
          small
          variant="ghost"
          accessibilityLabel={paused ? 'Resume practice' : 'Pause practice'}
          onPress={() => setPaused(!paused)}
        />
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>

      {/* Quick Stats Bar */}
      <View style={styles.stats}>
        <Text style={styles.stat}>
          ✓ {session.answers.filter((item) => item.correct).length} correct
        </Text>
        <Text style={styles.stat}>Streak {session.streak}</Text>
        {remaining !== null && (
          <Text style={[styles.stat, remaining <= 10 && styles.urgent]}>
            ⏱ {formatSeconds(remaining)}
          </Text>
        )}
      </View>

      {/* Center Question & Answer Card */}
      <View style={[styles.questionArea, isCompact && styles.questionAreaCompact]}>
        <Text style={[styles.question, isCompact && styles.questionCompact]}>
          {session.question.expression}
        </Text>
        <Text style={styles.prompt}>What is the answer?</Text>

        <Animated.View
          style={[
            styles.answerBox,
            isCompact && styles.answerBoxCompact,
            feedback?.correct ? styles.correctBox : feedback ? styles.incorrectBox : null,
            {
              transform: [
                {
                  scale: bump.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.04],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={value ? styles.answerText : styles.placeholderText}>
            {value || '—'}
          </Text>
        </Animated.View>

        {/* Feedback or Validation Hint */}
        <View style={styles.feedbackContainer}>
          {feedback ? (
            <Text style={[styles.feedbackText, feedback.correct ? styles.goodText : styles.badText]}>
              {feedback.text}
            </Text>
          ) : hint ? (
            <Text style={styles.hintText}>{hint}</Text>
          ) : null}
        </View>
      </View>

      {/* Bottom Keypad and Submit Section */}
      <View
        style={[styles.bottomSection, paused && styles.dimmed]}
        pointerEvents={paused ? 'none' : 'auto'}
      >
        <NumericKeypad onKey={handleKey} disabled={isSubmitting || paused} />
        <View style={styles.submitRow}>
          <AppButton
            title="Submit answer"
            icon={Send}
            disabled={paused || isSubmitting}
            onPress={submit}
          />
        </View>
      </View>

      {/* Pause Modal Overlay */}
      {paused && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseTitle}>Paused</Text>
          <Text style={styles.pauseText}>Take your time. Your session is waiting.</Text>
          <AppButton title="Resume" icon={Play} onPress={() => setPaused(false)} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headCopy: {
    flex: 1,
    alignItems: 'center',
  },
  topic: {
    color: colors.cyan,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
  counter: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  track: {
    height: 6,
    borderRadius: 8,
    backgroundColor: colors.surfaceRaised,
    overflow: 'hidden',
    marginTop: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.cyan,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  stat: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  urgent: {
    color: colors.red,
    fontWeight: '800',
  },
  questionArea: {
    flex: 1,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  questionAreaCompact: {
    minHeight: 110,
    paddingVertical: 4,
  },
  question: {
    color: colors.text,
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
  },
  questionCompact: {
    fontSize: 32,
  },
  prompt: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  answerBox: {
    width: '72%',
    maxWidth: 280,
    minHeight: 56,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: spacing.sm,
  },
  answerBoxCompact: {
    minHeight: 48,
    marginTop: 8,
  },
  correctBox: {
    borderColor: colors.green,
    backgroundColor: '#15382F',
  },
  incorrectBox: {
    borderColor: colors.red,
    backgroundColor: '#3A1E2B',
  },
  answerText: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  placeholderText: {
    color: '#52607C',
    fontSize: 26,
    fontWeight: '700',
  },
  feedbackContainer: {
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  goodText: {
    color: colors.green,
  },
  badText: {
    color: colors.amber,
  },
  hintText: {
    color: colors.amber,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  bottomSection: {
    paddingBottom: 4,
  },
  submitRow: {
    marginTop: 8,
  },
  dimmed: {
    opacity: 0.35,
  },
  pauseOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '32%',
    padding: 24,
    backgroundColor: colors.overlay,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pauseTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  pauseText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 18,
    textAlign: 'center',
  },
});
