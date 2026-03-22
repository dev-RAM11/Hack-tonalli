import { useState, useEffect } from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';
import { CertificateCard } from '../components/CertificateCard';
import { useFreighter } from '../hooks/useFreighter';
import { useT } from '../hooks/useT';
import type { ActaCertificateData } from '../types';

export function CertificatesPage() {
  const t = useT();
  const freighter = useFreighter();
  const [certs, setCerts] = useState<ActaCertificateData[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  // When Freighter connects, unlock vault and load certs
  useEffect(() => {
    if (freighter.isConnected && freighter.publicKey) {
      setVaultUnlocked(true);
      loadCerts();
    }
  }, [freighter.isConnected, freighter.publicKey]);

  const loadCerts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCertificates();
      setCerts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUnlockVault = async () => {
    const publicKey = await freighter.connect();
    if (publicKey) {
      // Also sync wallet with backend
      try {
        await apiService.connectWallet(publicKey);
      } catch { /* custodial wallet might already be set */ }
      setVaultUnlocked(true);
      loadCerts();
    }
  };

  const handleVerify = async () => {
    if (!verifyId.trim()) return;
    try {
      const result = await apiService.verifyCertificate(verifyId);
      setVerifyResult(result);
    } catch {
      setVerifyResult({ valid: false });
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(155,89,182,0.15), rgba(245,197,24,0.1))',
        borderBottom: '1px solid var(--border)',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>
          {vaultUnlocked ? '\uD83C\uDFC6' : '\uD83D\uDD10'}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
          {vaultUnlocked ? t('myCertificatesPage') : 'Vault de Credenciales'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {vaultUnlocked
            ? t('acta_certified')
            : 'Conecta tu wallet Freighter para acceder a tus certificados verificables'}
        </p>
      </div>

      <div className="container" style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>

        {/* ── Vault Gate: Freighter required ─────────────────────────────── */}
        {!vaultUnlocked && (
          <div style={{
            textAlign: 'center',
            padding: '60px 24px',
          }}>
            {/* Vault illustration */}
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(245,197,24,0.1))',
              border: '2px solid rgba(155,89,182,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <Lock size={48} color="#9B59B6" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 12 }}>
              Vault Protegido por Wallet
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 8, maxWidth: 500, margin: '0 auto 8px' }}>
              Tus credenciales verificables (ACTA) estan almacenadas en blockchain y protegidas por tu wallet.
              Solo tu puedes acceder a ellas firmando con Freighter.
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.85rem' }}>
              <Shield size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Nadie mas puede ver o descargar tus certificados sin tu firma.
            </p>

            <button
              onClick={handleUnlockVault}
              disabled={freighter.loading}
              style={{
                padding: '14px 32px', borderRadius: 12,
                background: 'linear-gradient(135deg, #4A1A7A, #7B2FBE)',
                border: '2px solid rgba(155,89,182,0.5)',
                color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 10,
                boxShadow: '0 4px 20px rgba(155,89,182,0.3)',
                opacity: freighter.loading ? 0.7 : 1,
              }}
            >
              <Shield size={20} />
              {freighter.loading ? 'Conectando...' : 'Desbloquear con Freighter'}
            </button>

            {!freighter.isInstalled && !freighter.loading && (
              <div style={{ marginTop: 20 }}>
                <a
                  href="https://www.freighter.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#9B59B6', textDecoration: 'none', fontSize: '0.85rem',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8,
                    background: 'rgba(155,89,182,0.1)', border: '1px solid rgba(155,89,182,0.3)',
                  }}
                >
                  <ExternalLink size={14} />
                  Descarga Freighter (extension Chrome gratuita)
                </a>
              </div>
            )}

            {freighter.error && (
              <div style={{ marginTop: 16, color: '#e74c3c', fontSize: '0.85rem' }}>
                {freighter.error}
              </div>
            )}

            {/* How it works */}
            <div style={{
              marginTop: 48, display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16, textAlign: 'center',
            }}>
              {[
                { step: '1', title: 'Instala Freighter', desc: 'Extension de Chrome para Stellar. Crea tu wallet en 30 segundos.' },
                { step: '2', title: 'Conecta tu wallet', desc: 'Firma con Freighter para desbloquear tu vault de credenciales.' },
                { step: '3', title: 'Accede y descarga', desc: 'Ve, verifica y descarga tus certificados en PDF verificables.' },
              ].map((item) => (
                <div key={item.step} className="card" style={{ padding: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, color: '#fff', margin: '0 auto 12px',
                  }}>
                    {item.step}
                  </div>
                  <h4 style={{ fontWeight: 800, marginBottom: 6 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Vault Unlocked Content ─────────────────────────────────────── */}
        {vaultUnlocked && (
          <>
            {/* Connected wallet badge */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, marginBottom: 24,
              padding: '8px 16px', borderRadius: 20,
              background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)',
              width: 'fit-content', margin: '0 auto 24px',
            }}>
              <Shield size={14} color="#00C896" />
              <span style={{ fontSize: '0.8rem', color: '#00C896', fontWeight: 700 }}>
                Vault desbloqueado
              </span>
              {freighter.publicKey && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {freighter.publicKey.slice(0, 6)}...{freighter.publicKey.slice(-6)}
                </span>
              )}
            </div>

            {/* Verify section */}
            <div className="card" style={{ padding: 20, marginBottom: 32 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 12 }}>{t('verifyCertificate')}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder={t('verifyPlaceholder')}
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button onClick={handleVerify} className="btn btn-primary">
                  {t('verify')}
                </button>
              </div>
              {verifyResult && (
                <div style={{
                  marginTop: 12, padding: 12, borderRadius: 8,
                  background: verifyResult.valid ? 'rgba(0,200,150,0.1)' : 'rgba(255,71,87,0.1)',
                  border: `1px solid ${verifyResult.valid ? 'rgba(0,200,150,0.3)' : 'rgba(255,71,87,0.3)'}`,
                }}>
                  {verifyResult.valid ? (
                    <div>
                      <p style={{ color: '#00C896', fontWeight: 700 }}>{t('certValid')}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {verifyResult.certificate?.chapterTitle} — {verifyResult.certificate?.username} — {verifyResult.certificate?.examScore}%
                      </p>
                    </div>
                  ) : (
                    <p style={{ color: '#FF4757', fontWeight: 700 }}>{t('certNotFound')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Certificates grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto' }} />
              </div>
            ) : certs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>{'\uD83D\uDCDC'}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{t('noCertificatesYet')}</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  {t('completeChaptersForCerts')}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {certs.map((cert) => (
                  <CertificateCard key={cert.id} cert={cert} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
