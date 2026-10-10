import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../constants/theme';
export function Screen({ children, scroll = true, style }) { const content = <View style={[styles.inner, style]}>{children}</View>; return <SafeAreaView style={styles.safe} edges={['top','left','right']}>{scroll ? <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>{content}</ScrollView> : content}</SafeAreaView>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.bg }, scroll: { flexGrow: 1 }, inner: { flex: 1, paddingHorizontal: spacing.md, paddingBottom: spacing.xl } });
