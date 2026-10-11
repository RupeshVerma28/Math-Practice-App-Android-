import { router } from 'expo-router';
import { ArrowLeft, Box, Brain, Grid3X3, Hash } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { TopicCard } from '../../components/TopicCard';
import { AppButton } from '../../components/AppButton';
import { colors, spacing } from '../../constants/theme';

export default function LearnHome() {
  return (
    <Screen>
      <AppButton
        title="Home"
        icon={ArrowLeft}
        variant="ghost"
        small
        onPress={() => router.replace('/')}
      />
      <Text style={styles.kicker}>LEARN</Text>
      <Text style={styles.title}>Understand the patterns.</Text>
      <Text style={styles.subtitle}>
        Explore tables, squares, cubes, and mental arithmetic patterns offline at your own pace.
      </Text>
      <View style={styles.list}>
        <TopicCard
          title="Multiplication tables"
          description="Tables 1 through 100 with quick facts and quiz options."
          icon={Grid3X3}
          color={colors.cyan}
          onPress={() => router.push('/learn/tables')}
        />
        <TopicCard
          title="Squares"
          description="Explore squares from 1² through 100²."
          icon={Hash}
          color={colors.violet}
          onPress={() => router.push('/learn/squares')}
        />
        <TopicCard
          title="Cubes"
          description="Master cubes from 1³ through 100³."
          icon={Box}
          color={colors.green}
          onPress={() => router.push('/learn/cubes')}
        />
        <TopicCard
          title="Mental math tricks"
          description="Practical shortcuts, rules, worked examples, and interactive try-outs."
          icon={Brain}
          color={colors.amber}
          onPress={() => router.push('/learn/mental-math')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.cyan,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1.4,
    marginTop: spacing.md,
    marginBottom: 6,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    lineHeight: 20,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  list: {
    marginTop: 2,
  },
});
