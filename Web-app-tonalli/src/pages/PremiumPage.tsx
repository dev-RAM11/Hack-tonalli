import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { apiService } from '../services/api';
import { useT } from '../hooks/useT';

type PlanType = 'free' | 'pro' | 'max';

const PLANS: { key: PlanType; price: string; priceNum: number; color: string; accent: string; icon: string }[] = [
  { key: 'free', price: '$0', priceNum: 0, color: 'rgba(148,163,184,0.4)', accent: '#94A3B8', icon: '📖' },
  { key: 'pro', price: '$3', priceNum: 3, color: 'rgba(233,30,140,0.4)', accent: '#E91E8C', icon: '🚀' },
  { key: 'max', price: '$8', priceNum: 8, color: 'rgba(245,166,35,0.4)', accent: '#F5A623', icon: '👑' },
];

export function PremiumPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPlan = user?.plan || 'free';

  const handleUpgrade = async (plan: PlanType) => {
    if (!user || plan === currentPlan) return;
    setLoading(true);
    setError(null);
    try {
      await apiService.upgradePlan(plan);
      setUser({ ...user, plan });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('errorProcessing'));
    } finally {
      setLoading(false);
    }
  };

  const planBenefits: Record<PlanType, string[]> = {
    free: [
      'Acceso a los primeros 3 capitulos',
      '2 intentos por quiz',
      'Sin certificaciones',
    ],
    pro: [
      'Todos los capitulos desbloqueados',
      'Intentos ilimitados en quizzes',
      'Certificacion por $2 USD cada una',
      'Podio semanal (gana XLM real)',
    ],
    max: [
      'Todos los capitulos desbloqueados',
      'Intentos ilimitados en quizzes',
      'Certificados NFT gratuitos',
      'Podio semanal (gana XLM real)',
      'Acceso prioritario a contenido nuevo',
    ],
  };

  const planLabels: Record<PlanType, string> = {
    free: 'Free',
    pro: 'Pro',
    max: 'Max',
  };

  const planDescs: Record<PlanType, string> = {
    free: 'Ideal para explorar los primeros pasos en Web3 y blockchain.',
    pro: 'Acceso completo a todo el contenido. Certificaciones disponibles por $2 USD cada una.',
    max: 'La experiencia completa: todos los capitulos, certificados gratis y podio.',
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(233,30,140,0.10))',
          borderBottom: '1px solid var(--border)',
          padding: '48px 24px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
          style={{
            display: 'inline-block',
            marginBottom: 16,
            filter: 'drop-shadow(0 0 18px rgba(245,166,35,0.7))',
          }}
        >
          <img
            src="/characters/xollo.png"
            alt="Xollo"
            style={{ width: 80, height: 80, objectFit: 'contain' }}
          />
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Elige tu Plan</h1>
          <span style={{
            background: currentPlan === 'max'
              ? 'linear-gradient(135deg, #F5A623, #FFD60A)'
              : currentPlan === 'pro'
                ? 'linear-gradient(135deg, #E91E8C, #C2185B)'
                : 'rgba(148,163,184,0.2)',
            color: currentPlan === 'free' ? '#94A3B8' : '#0A0E17',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: 20,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Plan {planLabels[currentPlan]}
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
          Aprende Web3 a tu ritmo. Elige el plan que mejor se adapte a ti.
        </p>
      </motion.div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>

        {/* Success banner */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(0,212,170,0.12)',
              border: '1px solid rgba(0,212,170,0.4)',
              borderRadius: 12,
              padding: '14px 20px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#00D4AA',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            <span>✓</span>
            <span>Tu plan ha sido actualizado exitosamente.</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(233,30,140,0.10)',
              border: '1px solid rgba(233,30,140,0.35)',
              borderRadius: 12,
              padding: '14px 20px',
              marginBottom: 24,
              color: '#E91E8C',
              fontWeight: 600,
              fontSize: '0.92rem',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>
          {PLANS.map((plan, idx) => {
            const isCurrentPlan = currentPlan === plan.key;
            const isBest = plan.key === 'max';
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card"
                style={{
                  padding: 28,
                  border: isCurrentPlan
                    ? `1.5px solid rgba(0,212,170,0.5)`
                    : `1.5px solid ${plan.color}`,
                  background: isCurrentPlan
                    ? 'linear-gradient(145deg, rgba(0,212,170,0.08), rgba(26,31,46,1))'
                    : `linear-gradient(145deg, ${plan.accent}0D, rgba(26,31,46,1))`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Badge */}
                {(isCurrentPlan || isBest) && (
                  <div style={{
                    position: 'absolute', top: 14, right: 14,
                    background: isCurrentPlan ? 'rgba(0,212,170,0.15)' : 'rgba(245,166,35,0.2)',
                    border: `1px solid ${isCurrentPlan ? 'rgba(0,212,170,0.4)' : 'rgba(245,166,35,0.4)'}`,
                    borderRadius: 12, padding: '2px 8px',
                    fontSize: '0.68rem', fontWeight: 700,
                    color: isCurrentPlan ? '#00D4AA' : '#F5A623',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {isCurrentPlan ? 'Actual' : 'Mejor valor'}
                  </div>
                )}

                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{plan.icon}</div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4, color: plan.accent }}>
                  {planLabels[plan.key]}
                </h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F0F4F8' }}>{plan.price}</span>
                  {plan.priceNum > 0 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>USD/mes</span>
                  )}
                  {plan.priceNum === 0 && plan.key !== 'free' && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gratis</span>
                  )}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.5 }}>
                  {planDescs[plan.key]}
                </p>

                {/* Benefits */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {planBenefits[plan.key].map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
                      <span style={{ color: '#00D4AA', fontWeight: 700, fontSize: '0.7rem' }}>✓</span>
                      <span style={{ color: 'var(--text)' }}>{b}</span>
                    </div>
                  ))}
                </div>

                {isCurrentPlan ? (
                  <div style={{
                    width: '100%',
                    padding: '10px 0',
                    textAlign: 'center',
                    background: 'rgba(0,212,170,0.10)',
                    border: '1px solid rgba(0,212,170,0.35)',
                    borderRadius: 8,
                    color: '#00D4AA',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                  }}>
                    Plan actual
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.key)}
                    disabled={loading}
                    className="btn"
                    style={{
                      width: '100%',
                      background: loading
                        ? `${plan.accent}4D`
                        : `linear-gradient(135deg, ${plan.accent}, ${plan.accent}CC)`,
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      padding: '10px 0',
                      borderRadius: 8,
                      cursor: loading ? 'wait' : 'pointer',
                      opacity: loading ? 0.8 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    {loading ? t('processing') : plan.key === 'free' ? 'Cambiar a Free' : `Obtener ${planLabels[plan.key]}`}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm"
          >
            {t('goBack')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
