import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from './contexts/AppContext'; // Adjust path if necessary

export default function Layout() {
  return (
    <AppProvider>
      {/* <Stack screenOptions={{ headerShown: false }} /> */}
      <Stack initialRouteName='index' />
    </AppProvider>

  );
}