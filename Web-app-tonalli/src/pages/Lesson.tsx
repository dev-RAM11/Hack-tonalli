import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { apiService } from '../services/api';
import { CharacterReaction } from '../components/CharacterReaction';
import { useProgressStore } from '../stores/progressStore';

interface Section {
  title: string;
  text: string;
  icon?: string;
}

interface KeyTerm {
  term: string;
  definition: string;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  moduleName: string;
  character: string;
  characterDialogue: string;
  xpReward: number;
  xlmReward: string;
  content: {
    sections: Section[];
    keyTerms: KeyTerm[];
  } | null;
}

export function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { markLessonComplete } = useProgressStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [characterMood, setCharacterMood] = useState<'idle' | 'happy' | 'excited' | 'thinking'>('idle');
  const [characterMessage, setCharacterMessage] = useState('');

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    apiService.getLesson(lessonId).then((data) => {
      // Parse content if it's a string
      let content = data.content;
      if (typeof content === 'string') {
        try { content = JSON.parse(content); } catch { content = null; }
      }
      setLesson({ ...data, content });
      setCharacterMessage(data.characterDialogue || 'Vamos a aprender algo increible hoy!');
      setLoading(false);
    }).catch(() => {
      setLesson(null);
      setLoading(false);
    });
  }, [lessonId]);

  useEffect(() => {
    if (!lesson?.content?.sections) return;
    const messages = [
      lesson.characterDialogue || 'Vamos a aprender!',
      'Muy bien! Sigue leyendo con atencion.',
      'Esto es importante! No lo olvides.',
      'Ya casi terminas! Tu puedes!',
      'Excelente! Has aprendido mucho hoy.',
    ];
    const idx = Math.min(currentStep, messages.length - 1);
    setCharacterMessage(messages[idx]);
    setCharacterMood(currentStep === 0 ? 'idle' : 'happy');
  }, [currentStep, lesson]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/characters/chima.png" alt="Chima" className="float-animation" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 16 }} />
          <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Cargando leccion...</div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>?</div>
          <h2>Leccion no encontrada</h2>
          <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 16 }}>Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const sections = lesson.content?.sections || [];
  const keyTerms = lesson.content?.keyTerms || [];
  // Total steps = sections + keyTerms (as 1 step) + final
  const totalSteps = sections.length + (keyTerms.length > 0 ? 1 : 0);
  const progress = totalSteps > 0 ? ((currentStep) / totalSteps) * 100 : 0;
  const isLast = currentStep >= totalSteps - 1;
  const character = (lesson.character || 'chima') as 'chima' | 'alli' | 'xollo';

  const handleContinue = () => {
    if (!isLast) {
      setCurrentStep((i) => i + 1);
    } else {
      markLessonComplete(lesson.id);
      setCharacterMood('excited');
      // Go to quiz
      setTimeout(() => {
        navigate(`/quiz/${lesson.id}`);
      }, 500);
    }
  };

  return (
    <div style={{ minHeight: '100vh', maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}>
          <X size={24} />
        </Link>
        <div style={{ flex: 1 }}>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {currentStep + 1}/{totalSteps}
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 32 }}>
        {/* Character */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <CharacterReaction
            character={character}
            mood={characterMood}
            message={characterMessage}
            size="md"
          />
        </div>

        {/* Lesson title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: 32, textAlign: 'center' }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>
            {lesson.moduleName}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>{lesson.title}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{lesson.description}</p>
        </motion.div>

        {/* Content blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {sections.slice(0, currentStep + 1).map((section, i) => (
            <AnimatePresence key={i}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card"
                style={{ padding: '24px 28px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  {section.icon && <span style={{ fontSize: '1.8rem' }}>{section.icon}</span>}
                  <h3 style={{ fontWeight: 900, fontSize: '1.15rem' }}>{section.title}</h3>
                </div>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
                  {section.text}
                </p>
              </motion.div>
            </AnimatePresence>
          ))}

          {/* Key terms step */}
          {keyTerms.length > 0 && currentStep >= sections.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(245,197,24,0.1)',
                border: '2px solid rgba(245,197,24,0.3)',
                borderRadius: 16,
                padding: '24px 28px',
              }}
            >
              <h3 style={{ fontWeight: 900, marginBottom: 16, color: 'var(--accent)' }}>Terminos clave</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {keyTerms.map((kt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontWeight: 900, color: 'var(--accent)', minWidth: 120 }}>{kt.term}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{kt.definition}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Rewards preview */}
        {isLast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(46,139,63,0.1)',
              border: '2px solid rgba(46,139,63,0.3)',
              borderRadius: 16,
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <img src="/characters/chima.png" alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 900, color: 'var(--success)' }}>Leccion completada!</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Ahora toma el quiz para ganar <strong style={{ color: 'var(--accent)' }}>+{lesson.xpReward} XP</strong>
                {' '}y <strong style={{ color: 'var(--success)' }}>+{lesson.xlmReward} XLM</strong>
              </div>
            </div>
          </motion.div>
        )}

        {/* Continue button */}
        <motion.button
          onClick={handleContinue}
          className="btn btn-primary btn-full btn-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ marginBottom: 40 }}
        >
          {isLast ? 'Tomar el Quiz!' : 'Continuar'}
        </motion.button>
      </div>
    </div>
  );
}
