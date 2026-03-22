import { useEffect, useState } from 'react';
import { Wallet, Copy, ExternalLink, Check, Download, Shield } from 'lucide-react';
import { apiService } from '../services/api';
import { useFreighter } from '../hooks/useFreighter';

interface WalletPanelProps {
  walletAddress: string;
  externalWalletAddress?: string | null;
  walletType?: string;
  onWalletUpdate?: () => void;
}

export function WalletPanel({ walletAddress, externalWalletAddress, walletType, onWalletUpdate }: WalletPanelProps) {
  const [balance, setBalance] = useState<{ xlmBalance?: string; tnlBalance?: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const freighter = useFreighter();

  useEffect(() => {
    apiService.getWalletBalance().then(setBalance).catch(() => {});
  }, [walletAddress]);

  const shortAddr = (addr: string) =>
    addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : addr;

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFreighterConnect = async () => {
    setLoading(true);
    try {
      const publicKey = await freighter.connect();
      if (publicKey) {
        await apiService.connectWallet(publicKey);
        onWalletUpdate?.();
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await apiService.disconnectWallet();
      freighter.disconnect();
      onWalletUpdate?.();
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div className="card" style={{ border: '1px solid rgba(155,89,182,0.3)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Wallet size={18} color="#9B59B6" />
        <span style={{ fontWeight: 900 }}>Wallet Stellar</span>
        {walletType && (
          <span style={{
            fontSize: '0.65rem', background: 'rgba(155,89,182,0.15)',
            color: '#9B59B6', padding: '2px 8px', borderRadius: 20, fontWeight: 700,
          }}>
            {walletType}
          </span>
        )}
      </div>

      {/* Custodial Address */}
      <div style={{
        background: 'var(--bg)', borderRadius: 8, padding: '10px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, fontSize: '0.8rem', fontFamily: 'monospace',
      }}>
        <span>{shortAddr(walletAddress)}</span>
        <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
          {copied ? <Check size={14} color="var(--primary)" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Balances */}
      {balance && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div style={{
            flex: 1, background: 'rgba(46,139,63,0.1)', borderRadius: 8,
            padding: '10px 12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--primary)' }}>
              {balance.xlmBalance || '0'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>XLM</div>
          </div>
          <div style={{
            flex: 1, background: 'rgba(155,89,182,0.1)', borderRadius: 8,
            padding: '10px 12px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#9B59B6' }}>
              {balance.tnlBalance || 0}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TNL</div>
          </div>
        </div>
      )}

      {/* Freighter connected external wallet */}
      {externalWalletAddress && (
        <div style={{
          fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Shield size={12} color="#9B59B6" />
          Freighter: {shortAddr(externalWalletAddress)}
        </div>
      )}

      {/* Freighter Connect Button */}
      {!externalWalletAddress && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={handleFreighterConnect}
            disabled={loading || freighter.loading}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              background: 'linear-gradient(135deg, #4A1A7A, #7B2FBE)',
              border: '1px solid rgba(155,89,182,0.5)',
              color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Download size={14} />
            {loading ? 'Conectando...' : 'Conectar con Freighter'}
          </button>

          {!freighter.isInstalled && !freighter.loading && (
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textAlign: 'center', fontSize: '0.7rem', color: '#9B59B6',
                textDecoration: 'none', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 4,
              }}
            >
              <ExternalLink size={10} />
              Descarga Freighter (extensión Chrome)
            </a>
          )}

          {freighter.error && (
            <div style={{ fontSize: '0.7rem', color: '#e74c3c', textAlign: 'center' }}>
              {freighter.error}
            </div>
          )}
        </div>
      )}

      {/* Disconnect */}
      {externalWalletAddress && (
        <button
          onClick={handleDisconnect}
          disabled={loading}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
            color: '#e74c3c', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          {loading ? '...' : 'Desconectar Freighter'}
        </button>
      )}
    </div>
  );
}
