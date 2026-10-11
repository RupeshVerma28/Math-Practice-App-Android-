import { router } from 'expo-router';
import { BookOpen, Calculator, Play, Settings, Sparkles } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { TopicCard } from '../components/TopicCard';
import { AppButton } from '../components/AppButton';
import { colors, radius, spacing } from '../constants/theme';

export default function Home() {
  return (
    <Screen>
      {/* Top Header */}
      <View style={styles.top}>
        <View style={styles.logo}>
          <Calculator size={26} color={colors.cyan} />
        </View>
        <View style={styles.brand}>
          <Text style={styles.name}>MathSprint</Text>
          <Text style={styles.tagline}>Learn Math · Calculate Faster</Text>
        </View>
        <AppButton
          title=""
          icon={Settings}
          variant="ghost"
          small
          onPress={() => router.push('/settings')}
          accessibilityLabel="Settings"
        />
      </View>

      {/* Hero Welcome Card */}
      <View style={styles.hero}>
        <View style={styles.spark}>
          <Sparkles size={18} color={colors.cyan} />
        </View>
        <Text style={styles.heroEyebrow}>MENTAL MATH PRACTICE</Text>
        <Text style={styles.heroTitle}>A sharper way to{'\n'}practice every day.</Text>
        <Text style={styles.heroCopy}>
          Build recall and arithmetic speed with dedicated learning lessons and focused practice sessions.
        </Text>
      </View>

      {/* Two Primary Destinations: Learn and Practice */}
      <Text style={styles.sectionHeader}>Choose an activity</Text>

      <TopicCard
        title="Learn"
        description="Multiplication tables 1–100, squares 1²–100², cubes 1³–100³, and mental math methods."
        icon={BookOpen}
        color={colors.violet}
        onPress={() => router.push('/learn')}
      />

      <TopicCard
        title="Practice"
        description="Custom difficulty arithmetic, streaks, 60-second challenge, and instant feedback."
        icon={Play}
        color={colors.cyan}
        onPress={() => router.push('/practice')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
    marginBottom: spacing.lg,
  },
  logo: {
    height: 48,
    width: 48,
    borderRadius: 16,
    backgroundColor: '#102A3E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1D5273',
  },
  brand: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  tagline: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  hero: {
    backgroundColor: '#0F1A33',
    borderWidth: 1,
    borderColor: '#243B66',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  spark: {
    position: 'absolute',
    right: 18,
    top: 18,
    backgroundColor: '#123D54',
    height: 38,
    width: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    color: colors.cyan,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  heroCopy: {
    color: '#B6C6EA',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    maxWidth: '92%',
  },
  sectionHeader: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 2,
  },
});
