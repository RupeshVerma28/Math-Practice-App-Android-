import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { cube } from '../../utils/calculations';
import { cubeTip } from '../../data/learning';
import { colors, radius, spacing } from '../../constants/theme';

const RANGES = [
  { label: '1–25', start: 1, end: 25 },
  { label: '26–50', start: 26, end: 50 },
  { label: '51–75', start: 51, end: 75 },
  { label: '76–100', start: 76, end: 100 },
];

export default function Cubes() {
  const [selected, setSelected] = useState(5);

  // Derive active range tab index directly from the selected number
  const activeRangeIndex = Math.max(
    0,
    RANGES.findIndex((r) => selected >= r.start && selected <= r.end)
  );

  const currentRange = RANGES[activeRangeIndex];
  const value = cube(selected);

  const handlePrev = () => {
    if (selected > 1) {
      setSelected(selected - 1);
    }
  };

  const handleNext = () => {
    if (selected < 100) {
      setSelected(selected + 1);
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
      <Text style={styles.title}>Cubes 1³–100³</Text>
      <Text style={styles.subtitle}>
        A cube is a number multiplied by itself twice: n³ = n × n × n.
      </Text>

      {/* Hero Display Card */}
      <View style={styles.feature}>
        <View style={styles.featureNav}>
          <AppButton
            title=""
            icon={ChevronLeft}
            small
            variant="ghost"
            accessibilityLabel="Previous cube"
            disabled={selected <= 1}
            onPress={handlePrev}
          />
          <Text style={styles.expression}>{selected}³</Text>
          <AppButton
            title=""
            icon={ChevronRight}
            small
            variant="ghost"
            accessibilityLabel="Next cube"
            disabled={selected >= 100}
            onPress={handleNext}
          />
        </View>
        <Text style={styles.equals}>
          = {selected} × {selected} × {selected}
        </Text>
        <Text style={styles.answer}>{value.toLocaleString()}</Text>
      </View>

      {/* Pattern Notice */}
      <View style={styles.tip}>
        <Text style={styles.tipLabel}>PATTERN TO NOTICE</Text>
        <Text style={styles.tipText}>{cubeTip}</Text>
      </View>

      {/* Range Selection Tabs */}
      <Text style={styles.choose}>Choose a number (1–100)</Text>
      <View style={styles.rangeTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {RANGES.map((r, idx) => {
            const isActive = idx === activeRangeIndex;
            return (
              <TouchableOpacity
                key={r.label}
                accessibilityRole="button"
                accessibilityLabel={`Cubes range ${r.label}`}
                accessibilityState={{ selected: isActive }}
                onPress={() => {
                  setSelected(r.start);
                }}
                style={[styles.rangeTab, isActive && styles.rangeTabActive]}
              >
                <Text style={[styles.rangeTabText, isActive && styles.rangeTabTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Number Cells Grid */}
      <View style={styles.grid}>
        {Array.from({ length: currentRange.end - currentRange.start + 1 }, (_, i) => currentRange.start + i).map((n) => {
          const isActive = n === selected;
          return (
            <TouchableOpacity
              key={n}
              accessibilityRole="button"
              accessibilityLabel={`Cube ${n}`}
              accessibilityState={{ selected: isActive }}
              onPress={() => setSelected(n)}
              style={[styles.cell, isActive && styles.activeCell]}
            >
              <Text style={[styles.cellText, isActive && styles.activeCellText]}>{n}</Text>
            </TouchableOpacity>
          );
        })}
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
  feature: {
    alignItems: 'center',
    backgroundColor: '#0F2C27',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#225B50',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  featureNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  expression: {
    color: colors.green,
    fontSize: 36,
    fontWeight: '900',
  },
  equals: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
  },
  answer: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  tip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 15,
    marginBottom: 16,
  },
  tipLabel: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  tipText: {
    color: '#D3DCF3',
    fontSize: 13,
    lineHeight: 19,
  },
  choose: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 10,
  },
  rangeTabs: {
    marginBottom: 10,
  },
  tabsScroll: {
    gap: 8,
  },
  rangeTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rangeTabActive: {
    backgroundColor: colors.green,
    borderColor: '#76E5B8',
  },
  rangeTabText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  rangeTabTextActive: {
    color: colors.bg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 16,
  },
  cell: {
    width: '18%',
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCell: {
    backgroundColor: colors.green,
    borderColor: '#7BE7BA',
  },
  cellText: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 14,
  },
  activeCellText: {
    color: colors.bg,
  },
});
