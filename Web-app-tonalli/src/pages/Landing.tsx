import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Users, BookOpen } from 'lucide-react';

const fadeUp = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export function Landing() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(46,139,63,0.18) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(245,197,24,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Characters Hero Trio */}
        <motion.div
          style={{ display: 'flex', gap: 16, marginBottom: 32, alignItems: 'flex-end' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.img
            src="/characters/alli.png"
            alt="Alli"
            className="float-delay"
            style={{ width: 130, height: 130, objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(245,197,24,0.5))' }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            draggable={false}
          />
          <motion.img
            src="/characters/xollo.png"
            alt="Xollo"
            className="float-slow"
            style={{ width: 170, height: 170, objectFit: 'contain', filter: 'drop-shadow(0 12px 28px rgba(155,89,182,0.5))' }}
            whileHover={{ scale: 1.1 }}
            draggable={false}
          />
          <motion.img
            src="/characters/chima.png"
            alt="Chima"
            className="float-delay2"
            style={{ width: 130, height: 130, objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(200,39,26,0.5))' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            draggable={false}
          />
        </motion.div>

        <motion.div {...fadeUp} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
          <div className="badge badge-primary" style={{ marginBottom: 16, fontSize: '0.85rem', padding: '6px 14px' }}>
            ⭐ Powered by Stellar Blockchain
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 24, maxWidth: 800 }}>
            Aprende Web3 en español
            <br />
            <span className="gradient-text">y gana recompensas reales</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            La primera plataforma educativa Web3 diseñada para México y Latinoamérica.
            Aprende, completa quizzes y gana XLM real.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Empieza gratis <ChevronRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Ya tengo cuenta
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          style={{ display: 'flex', gap: 48, marginTop: 60, justifyContent: 'center', flexWrap: 'wrap' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: <Users size={20} />, value: '12,000+', label: 'Estudiantes activos' },
            { icon: <BookOpen size={20} />, value: '40+', label: 'Lecciones gratuitas' },
            { icon: <Star size={20} />, value: '500+ XLM', label: 'Distribuidos' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', justifyContent: 'center', marginBottom: 4 }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>¿Cómo funciona? 🚀</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tres pasos para convertirte en experto Web3</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}
          >
            {[
              {
                step: '01',
                icon: '📚',
                title: 'Aprende',
                color: '#2E8B3F',
                description: 'Lecciones cortas y divertidas sobre blockchain, Stellar, DeFi, NFTs y más. En español, con ejemplos del contexto mexicano.',
                cta: 'Chima te guía en cada lección',
              },
              {
                step: '02',
                icon: '🏆',
                title: 'Completa quizzes',
                color: '#F5C518',
                description: 'Pon a prueba lo que aprendiste. Cada respuesta correcta te da XP y avanzas a lecciones más avanzadas.',
                cta: 'Alli te desafía a mejorar',
              },
              {
                step: '03',
                icon: '💰',
                title: 'Gana recompensas',
                color: '#C8271A',
                description: 'Completa módulos y recibe XLM real en tu wallet de Stellar. Además obtén NFTs certificados de logro.',
                cta: 'Xollo cuida tu racha diaria',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="card"
                style={{ padding: 32, position: 'relative', overflow: 'hidden', cursor: 'default' }}
                whileHover={{ y: -6, borderColor: feature.color + '60' }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                  background: feature.color,
                }} />
                <div style={{
                  fontSize: '0.75rem', fontWeight: 900, color: feature.color,
                  letterSpacing: 2, marginBottom: 16,
                }}>
                  PASO {feature.step}
                </div>
                <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 12 }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>{feature.description}</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  fontSize: '0.85rem', fontWeight: 700, color: feature.color,
                  background: feature.color + '20', padding: '6px 14px', borderRadius: 20,
                }}>
                  <img
                    src={`/characters/${i === 0 ? 'chima' : i === 1 ? 'alli' : 'xollo'}.png`}
                    alt=""
                    style={{ width: 24, height: 24, objectFit: 'contain' }}
                    draggable={false}
                  />
                  {feature.cta}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Characters showcase */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>Conoce a tu equipo 🎭</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tus compañeros en el viaje Web3</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              {
                image: '/characters/chima.png',
                name: 'Chima',
                role: 'Guia Maestra',
                color: '#C8271A',
                glowColor: 'rgba(200,39,26,0.4)',
                description: 'Mariachi de corazon, maestra de blockchain. Chima te explica cada concepto con paciencia y mucho ritmo. Ella nunca te deja atras!',
                animClass: 'float-animation',
              },
              {
                image: '/characters/alli.png',
                name: 'Alli',
                role: 'Desafiador Pro',
                color: '#F5C518',
                glowColor: 'rgba(245,197,24,0.4)',
                description: 'El mariachi mas competitivo del metaverso. Alli te retara constantemente a superar tus records y mejorar tu racha.',
                animClass: 'float-slow',
              },
              {
                image: '/characters/xollo.png',
                name: 'Xollo',
                role: 'Guardian de Racha',
                color: '#9B59B6',
                glowColor: 'rgba(155,89,182,0.4)',
                description: 'El xoloescuincle mas leal de la blockchain. Xollo cuida tu racha diaria y se pone triste si la pierdes. No lo decepciones!',
                animClass: 'float-delay',
              },
            ].map((char, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card"
                style={{ textAlign: 'center', padding: 32 }}
                whileHover={{ y: -8, borderColor: char.color + '60' }}
              >
                <motion.div
                  style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}
                  whileHover={{ scale: 1.08 }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${char.glowColor}, transparent 70%)`,
                    filter: 'blur(15px)',
                    pointerEvents: 'none',
                  }} />
                  <img
                    src={char.image}
                    alt={char.name}
                    className={char.animClass}
                    draggable={false}
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: 'contain',
                      position: 'relative',
                      filter: `drop-shadow(0 8px 20px ${char.glowColor})`,
                    }}
                  />
                </motion.div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 4 }}>{char.name}</h3>
                <div className="badge" style={{ background: char.color + '20', color: char.color, marginBottom: 12 }}>
                  {char.role}
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>{char.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 12 }}>¿Qué vas a aprender? 🧠</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: '⛓️', topic: 'Blockchain Básico', level: 'Principiante' },
              { icon: '⭐', topic: 'Stellar & XLM', level: 'Principiante' },
              { icon: '👛', topic: 'Wallets & Seguridad', level: 'Intermedio' },
              { icon: '🏦', topic: 'DeFi en México', level: 'Intermedio' },
              { icon: '🎨', topic: 'NFTs & Arte Digital', level: 'Avanzado' },
              { icon: '🔮', topic: 'Smart Contracts', level: 'Avanzado' },
              { icon: '📊', topic: 'Trading Responsable', level: 'Intermedio' },
              { icon: '🌎', topic: 'Web3 y Sociedad', level: 'Todos' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s',
                }}
                whileHover={{ borderColor: 'rgba(46,139,63,0.4)', y: -2 }}
              >
                <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.topic}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.level}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={{ marginBottom: 24, position: 'relative', display: 'inline-block' }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 120, height: 120, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(155,89,182,0.4), transparent 70%)',
              filter: 'blur(20px)', pointerEvents: 'none',
            }} />
            <img
              src="/characters/xollo.png"
              alt="Xollo"
              className="float-slow"
              style={{ width: 160, height: 160, objectFit: 'contain', position: 'relative', filter: 'drop-shadow(0 12px 28px rgba(155,89,182,0.6))' }}
              draggable={false}
            />
          </div>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: 16 }}>
            Xollo esta esperandote
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto 36px' }}>
            Únete a miles de mexicanos que ya están aprendiendo Web3 y ganando recompensas reales.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg pulse-glow">
            ¡Empieza gratis ahora! <ChevronRight size={20} />
          </Link>
          <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Sin costo. Sin tarjeta. Solo ganas.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <img src="/logo.png" alt="Tonalli" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <span style={{ fontWeight: 900 }}>Tonalli</span> — Plataforma Web3 educativa para México
        </div>
        <div>Built on Stellar Blockchain · Hackathon 2024</div>
      </footer>
    </div>
  );
}
