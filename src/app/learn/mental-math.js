import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { mentalMath } from '../../data/learning';
import { isCorrectAnswer } from '../../utils/answerValidator';
import { useApp } from '../../context/AppContext';
import { useSound } from '../../hooks/useSound';
import { colors, radius, spacing } from '../../constants/theme';

export default function MentalMath() {
  const { soundEnabled } = useApp();
  const { playCorrect, playIncorrect } = useSound(soundEnabled);

  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const lesson = mentalMath[selected];

  const check = () => {
    const clean = answer.trim();
    if (!clean) {
      setFeedback({ ok: false, text: 'Type an answer first.' });
      return;
    }

    const isCorrect = isCorrectAnswer(clean, lesson.quiz.answer);
    if (isCorrect) {
      playCorrect();
      setFeedback({ ok: true, text: 'Exactly right — nice work!' });
    } else {
      playIncorrect();
      setFeedback({
        ok: false,
        text: `Not quite (${lesson.quiz.expression} = ${lesson.quiz.answer}). Check the worked example and try again.`,
      });
    }
  };

  return (
    <Screen>
      <AppButton
        title="Back"
        icon={ArrowLeft}
        variant="ghost"
        small
        onPress={() => router.back()}
      />
      <Text style={styles.title}>Mental math tricks</Text>
      <Text style={styles.subtitle}>
        Short, practical methods for quick calculation. Select a rule to see its steps and worked example.
      </Text>

      {/* Lesson Selector Tabs */}
      <View style={styles.tabs}>
        {mentalMath.map((item, index) => (
          <AppButton
            key={item.title}
            title={item.icon}
            small
            variant={index === selected ? 'primary' : 'secondary'}
            accessibilityLabel={item.title}
            onPress={() => {
              setSelected(index);
              setAnswer('');
              setFeedback(null);
            }}
          />
        ))}
      </View>

      {/* Lesson Details Card */}
      <View style={styles.lesson}>
        <Text style={styles.icon}>{lesson.icon}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.label}>THE IDEA</Text>
        <Text style={styles.body}>{lesson.rule}</Text>
        <Text style={styles.label}>WORKED EXAMPLE</Text>
        <Text style={styles.example}>{lesson.example}</Text>
      </View>

      {/* Try It Out Card */}
      <View style={styles.quiz}>
        <Text style={styles.quizLabel}>TRY IT YOURSELF</Text>
        <Text style={styles.question}>{lesson.quiz.expression} = ?</Text>
        <TextInput
          accessibilityLabel="Your answer"
          keyboardType="number-pad"
          value={answer}
          onChangeText={(text) => {
            setAnswer(text.replace(/[^0-9-]/g, ''));
            setFeedback(null);
          }}
          placeholder="Answer"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        <AppButton title="Check answer" icon={CheckCircle2} onPress={check} small />
        {feedback && (
          <Text style={[styles.feedback, feedback.ok ? styles.good : styles.bad]}>
            {feedback.text}
          </Text>
        )}
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
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  lesson: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  icon: {
    fontSize: 28,
  },
  lessonTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 14,
  },
  label: {
    color: colors.cyan,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 4,
  },
  body: {
    color: '#D3DCF3',
    fontSize: 14,
    lineHeight: 21,
  },
  example: {
    color: colors.amber,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  quiz: {
    marginTop: 14,
    backgroundColor: '#0F1A33',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#243B66',
    padding: 16,
    marginBottom: spacing.lg,
  },
  quizLabel: {
    color: colors.violet,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  question: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 6,
    marginBottom: 10,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 10,
  },
  feedback: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    lineHeight: 18,
  },
  good: {
    color: colors.green,
  },
  bad: {
    color: colors.amber,
  },
});
