import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Play } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { AppButton } from '../../components/AppButton';
import { tableFacts } from '../../utils/calculations';
import { colors, radius, spacing } from '../../constants/theme';

const RANGES = [
  { label: '1–20', start: 1, end: 20 },
  { label: '21–40', start: 21, end: 40 },
  { label: '41–60', start: 41, end: 60 },
  { label: '61–80', start: 61, end: 80 },
  { label: '81–100', start: 81, end: 100 },
];

export default function Tables() {
  const [table, setTable] = useState(7);

  // Derive active range tab index directly from the selected table
  const activeRangeIndex = Math.max(
    0,
    RANGES.findIndex((r) => table >= r.start && table <= r.end)
  );

  const currentRange = RANGES[activeRangeIndex];
  const facts = tableFacts(table);

  const handlePrev = () => {
    if (table > 1) {
      setTable(table - 1);
    }
  };

  const handleNext = () => {
    if (table < 100) {
      setTable(table + 1);
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
      <Text style={styles.title}>Multiplication tables</Text>
      <Text style={styles.subtitle}>
        Select tables 1 through 100. Choose a range or tap previous/next to switch facts.
      </Text>

      {/* Range Tabs */}
      <View style={styles.rangeTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {RANGES.map((r, idx) => {
            const isActive = idx === activeRangeIndex;
            return (
              <TouchableOpacity
                key={r.label}
                accessibilityRole="button"
                accessibilityLabel={`Tables range ${r.label}`}
                accessibilityState={{ selected: isActive }}
                onPress={() => {
                  setTable(r.start);
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

      {/* 20-number grid for current range */}
      <View style={styles.grid}>
        {Array.from({ length: currentRange.end - currentRange.start + 1 }, (_, i) => currentRange.start + i).map((n) => {
          const isSelected = n === table;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Table ${n}`}
              accessibilityState={{ selected: isSelected }}
              key={n}
              onPress={() => setTable(n)}
              style={[styles.numberCell, isSelected && styles.numberCellActive]}
            >
              <Text style={[styles.numberText, isSelected && styles.numberTextActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Table Facts Card with Prev/Next Stepper */}
      <View style={styles.tableCard}>
        <View style={styles.switcher}>
          <AppButton
            title=""
            icon={ChevronLeft}
            small
            variant="ghost"
            accessibilityLabel="Previous table"
            disabled={table <= 1}
            onPress={handlePrev}
          />
          <Text style={styles.tableTitle}>{table} times table</Text>
          <AppButton
            title=""
            icon={ChevronRight}
            small
            variant="ghost"
            accessibilityLabel="Next table"
            disabled={table >= 100}
            onPress={handleNext}
          />
        </View>

        {facts.map((fact, i) => (
          <View key={fact.multiplier} style={[styles.fact, i === 0 && styles.firstFact]}>
            <Text style={styles.factText}>
              {table} × {fact.multiplier}
            </Text>
            <Text style={styles.result}>{(fact.result).toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <AppButton
        title={`Quiz table ${table}`}
        icon={Play}
        onPress={() => router.push({ pathname: '/practice', params: { topic: 'tables' } })}
      />
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
  rangeTabs: {
    marginBottom: 12,
  },
  tabsScroll: {
    gap: 8,
  },
  rangeTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rangeTabActive: {
    backgroundColor: colors.blue,
    borderColor: '#7AA7FF',
  },
  rangeTabText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  rangeTabTextActive: {
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 18,
    justifyContent: 'flex-start',
  },
  numberCell: {
    width: '18%',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  numberCellActive: {
    backgroundColor: colors.blue,
    borderColor: '#83AEFF',
  },
  numberText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  numberTextActive: {
    color: colors.white,
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 18,
  },
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#1D2A45',
  },
  tableTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#1C2740',
  },
  firstFact: {
    backgroundColor: '#122547',
    borderRadius: 8,
  },
  factText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  result: {
    color: colors.cyan,
    fontSize: 16,
    fontWeight: '900',
  },
});
