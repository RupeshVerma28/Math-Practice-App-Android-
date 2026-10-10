import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Delete, RotateCcw } from 'lucide-react-native';
import { colors, radius } from '../constants/theme';
const keys = ['1','2','3','4','5','6','7','8','9','clear','0','back'];
export function NumericKeypad({ onKey }) { return <View style={styles.grid}>{keys.map((key) => <TouchableOpacity accessibilityRole="button" accessibilityLabel={key === 'back' ? 'Backspace' : key === 'clear' ? 'Clear answer' : key} key={key} onPress={() => onKey(key)} style={[styles.key, (key === 'back' || key === 'clear') && styles.utility]}>{key === 'back' ? <Delete color={colors.text} size={22} /> : key === 'clear' ? <RotateCcw color={colors.muted} size={21} /> : <Text style={styles.text}>{key}</Text>}</TouchableOpacity>)}</View>; }
const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, key: { width: '23%', aspectRatio: 1.15, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border }, utility: { backgroundColor: colors.surface }, text: { color: colors.text, fontSize: 23, fontWeight: '800' } });
