import { useState, useEffect, useCallback } from 'react';

// Freighter API types (from @stellar/freighter-api)
interface FreighterApi {
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
  signTransaction: (xdr: string, opts?: { networkPassphrase?: string }) => Promise<string>;
  getNetwork: () => Promise<string>;
  isAllowed: () => Promise<boolean>;
  setAllowed: () => Promise<void>;
  requestAccess: () => Promise<string>;
}

declare global {
  interface Window {
    freighterApi?: FreighterApi;
  }
}

export interface FreighterState {
  isInstalled: boolean;
  isConnected: boolean;
  publicKey: string | null;
  network: string | null;
  loading: boolean;
  error: string | null;
}

export function useFreighter() {
  const [state, setState] = useState<FreighterState>({
    isInstalled: false,
    isConnected: false,
    publicKey: null,
    network: null,
    loading: true,
    error: null,
  });

  // Check if Freighter is installed
  useEffect(() => {
    const check = async () => {
      try {
        // Freighter injects window.freighterApi
        const api = window.freighterApi;
        if (!api) {
          setState(s => ({ ...s, isInstalled: false, loading: false }));
          return;
        }

        const connected = await api.isConnected();
        if (connected) {
          const publicKey = await api.getPublicKey();
          const network = await api.getNetwork();
          setState({
            isInstalled: true,
            isConnected: true,
            publicKey,
            network,
            loading: false,
            error: null,
          });
        } else {
          setState(s => ({ ...s, isInstalled: true, loading: false }));
        }
      } catch {
        setState(s => ({ ...s, loading: false }));
      }
    };

    // Freighter can take a moment to inject
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, []);

  const connect = useCallback(async () => {
    const api = window.freighterApi;
    if (!api) {
      setState(s => ({ ...s, error: 'Freighter no está instalado. Descárgalo en freighter.app' }));
      return null;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const publicKey = await api.requestAccess();
      const network = await api.getNetwork();

      setState({
        isInstalled: true,
        isConnected: true,
        publicKey,
        network,
        loading: false,
        error: null,
      });

      return publicKey;
    } catch (err: any) {
      const msg = err?.message || 'Error al conectar con Freighter';
      setState(s => ({ ...s, loading: false, error: msg }));
      return null;
    }
  }, []);

  const disconnect = useCallback(() => {
    setState(s => ({
      ...s,
      isConnected: false,
      publicKey: null,
      network: null,
    }));
  }, []);

  const signTransaction = useCallback(async (xdr: string, networkPassphrase?: string) => {
    const api = window.freighterApi;
    if (!api) throw new Error('Freighter not available');
    return api.signTransaction(xdr, { networkPassphrase });
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    signTransaction,
  };
}
