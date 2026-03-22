import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { useLanguageStore } from '../stores/languageStore';
import { Zap, LogOut, Trophy, LayoutDashboard, BookOpen, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { dailyStreak } = useProgressStore();
  const { language, setLanguage } = useLanguageStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      className="glass"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
      }}
      initial={{ y: -56 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Logo */}
      <Link
        to={isAuthenticated ? '/dashboard' : '/'}
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}
      >
        <img
          src="/logo.png"
          alt="Tonalli"
          style={{ width: 28, height: 28, objectFit: 'contain' }}
        />
        <span style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.02em',
          color: '#F5A623',
          textTransform: 'uppercase',
        }}>
          TONALLI
        </span>
      </Link>

      {/* Right */}
      {isAuthenticated && user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Streak */}
          {dailyStreak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(233,30,140,0.1)',
              padding: '5px 10px', borderRadius: 6,
              border: '1px solid rgba(233,30,140,0.25)',
            }}>
              <span className="streak-fire" style={{ fontSize: '0.95rem' }}>🔥</span>
              <span style={{ fontWeight: 600, color: '#FF6AC1', fontSize: '0.85rem' }}>{dailyStreak}</span>
            </div>
          )}

          {/* XP */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(245,166,35,0.1)',
            padding: '5px 10px', borderRadius: 6,
            border: '1px solid rgba(245,166,35,0.22)',
          }}>
            <Zap size={13} color="#F5A623" />
            <span style={{ fontWeight: 600, color: '#F5A623', fontSize: '0.85rem' }}>
              {user.xp.toLocaleString()}
            </span>
          </div>

          {/* Nav links */}
          <Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }} title="Dashboard">
            <LayoutDashboard size={17} />
          </Link>

          <Link to="/chapters" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }} title="Capítulos">
            <BookOpen size={17} />
          </Link>

          {user?.plan !== 'free' && (
            <Link to="/leaderboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }} title="Ranking">
              <Trophy size={17} />
            </Link>
          )}

          <Link to="/premium" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: user?.plan === 'max'
              ? 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,212,170,0.08))'
              : 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(233,30,140,0.15))',
            border: `1px solid ${user?.plan === 'max' ? 'rgba(0,212,170,0.3)' : 'rgba(245,166,35,0.3)'}`,
            borderRadius: 6, padding: '4px 10px',
            textDecoration: 'none', fontSize: '0.78rem', fontWeight: 700,
            color: user?.plan === 'max' ? '#00D4AA' : '#F5A623',
          }}>
            {user?.plan === 'free' ? 'Pro' : user?.plan === 'pro' ? 'Pro' : 'Max'}
          </Link>

          {user?.role === 'admin' && (
            <Link to="/admin" style={{ color: 'var(--gold)', textDecoration: 'none', padding: '6px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }} title="Panel Admin">
              <Shield size={17} />
            </Link>
          )}

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '4px 12px', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
            title="Cambiar idioma / Switch language"
          >
            🌐 {language === 'es' ? 'ES' : 'EN'}
          </button>

          {/* Avatar */}
          <Link to="/profile" style={{ textDecoration: 'none', marginLeft: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5A623, #E91E8C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 700, color: '#fff',
              border: '1.5px solid var(--border-active)',
              cursor: 'pointer',
            }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px 8px', marginLeft: 2 }}
            title="Cerrar sesión"
          >
            <LogOut size={15} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '4px 12px', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
            title="Cambiar idioma / Switch language"
          >
            🌐 {language === 'es' ? 'ES' : 'EN'}
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm">Iniciar sesión</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
        </div>
      )}
    </motion.nav>
  );
}
