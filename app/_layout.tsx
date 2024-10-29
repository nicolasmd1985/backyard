import React from 'react';
import { Stack } from 'expo-router';
import { AppProvider } from './AppContext'; // Adjust path if necessary

export default function Layout() {
  return (
    <AppProvider>
      <Stack initialRouteName="index" />
    </AppProvider>
  );
}