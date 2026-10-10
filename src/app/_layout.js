import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../context/AppContext';
import { colors } from '../constants/theme';
export default function Layout() { return <AppProvider><StatusBar style="light" backgroundColor={colors.bg} /><Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: colors.bg } }} /></AppProvider>; }
