import './app.css';
import App from './App.svelte';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

// Initialize Capacitor plugins
async function initCapacitor() {
  try {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setBackgroundColor({ color: '#000000' });
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.hide();
    
    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
        StatusBar.setBackgroundColor({ color: '#000000' }).catch(() => {});
        StatusBar.setStyle({ style: Style.Light }).catch(() => {});
        StatusBar.hide().catch(() => {});
      }
    });
    
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapacitorApp.exitApp();
      } else {
        window.history.back();
      }
    });
  } catch (error) {
    console.log('Capacitor not available (running in browser)', error);
  }
}

initCapacitor();

const app = new App({
  target: document.getElementById('app'),
});

export default app;
