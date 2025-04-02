// components/ui/gluestack-ui-provider.js
import React from 'react';
import { View } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';
import { config } from '@/src/gluestack-ui.config';

export function GluestackUIProvider({
  mode = 'light',
  children,
  style
}) {
  return (
    <View
      style={[
        config[mode],
        { flex: 1, height: '100%', width: '100%' },
        style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}