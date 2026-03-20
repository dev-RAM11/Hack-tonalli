import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Lesson, LessonType } from '../lessons/entities/lesson.entity';
import { Quiz } from '../lessons/entities/quiz.entity';
import { Progress } from '../progress/entities/progress.entity';
import { NFTCertificate } from '../progress/entities/nft-certificate.entity';
import { Streak } from '../users/entities/streak.entity';
import { Chapter } from '../chapters/entities/chapter.entity';
import { ChapterModule } from '../chapters/entities/chapter-module.entity';
import { ChapterProgress } from '../chapters/entities/chapter-progress.entity';
import { WeeklyScore } from '../podium/entities/weekly-score.entity';
import { PodiumReward } from '../podium/entities/podium-reward.entity';
import { ActaCertificate } from '../certificates/entities/acta-certificate.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'tonalli',
  entities: [User, Lesson, Quiz, Progress, NFTCertificate, Streak, Chapter, ChapterModule, ChapterProgress, WeeklyScore, PodiumReward, ActaCertificate],
  synchronize: true,
  logging: false,
  charset: 'utf8mb4',
});

const MODULE_ID = 'mod-intro-blockchain';
const MODULE_NAME = 'Intro a Blockchain';

// ── Question pools ─────────────────────────────────────────────────────────────

const BLOCKCHAIN_QUESTIONS = [
  { id: 'bq1', question: '¿Qué es una blockchain o cadena de bloques?', options: ['Un tipo de red social', 'Un registro distribuido e inmutable de transacciones', 'Un banco digital centralizado', 'Un lenguaje de programación'], correctIndex: 1, explanation: 'Una blockchain es un registro distribuido donde los datos se almacenan en bloques enlazados de forma criptográfica.' },
  { id: 'bq2', question: '¿Cuál es una característica principal de la blockchain?', options: ['Es controlada por un solo banco', 'Puede ser modificada fácilmente por cualquiera', 'Es descentralizada e inmutable', 'Solo funciona con internet de alta velocidad'], correctIndex: 2, explanation: 'La descentralización e inmutabilidad son pilares fundamentales.' },
  { id: 'bq3', question: '¿Qué significa que la blockchain sea "distribuida"?', options: ['Que está en un solo servidor muy grande', 'Que múltiples nodos almacenan copias del registro', 'Que se distribuye dinero automáticamente', 'Que funciona sin conexión a internet'], correctIndex: 1, explanation: 'Distribuida significa que muchos computadores (nodos) guardan copias del mismo registro.' },
  { id: 'bq4', question: '¿Quién inventó Bitcoin, la primera blockchain pública?', options: ['Elon Musk', 'Mark Zuckerberg', 'Satoshi Nakamoto', 'Bill Gates'], correctIndex: 2, explanation: 'Satoshi Nakamoto publicó el whitepaper de Bitcoin en 2008.' },
  { id: 'bq5', question: '¿Qué hace que los bloques estén "encadenados"?', options: ['Un cable físico entre servidores', 'Cada bloque contiene el hash del bloque anterior', 'Un administrador que los enlaza manualmente', 'Un contrato legal entre nodos'], correctIndex: 1, explanation: 'Cada bloque incluye el hash criptográfico del bloque anterior.' },
  { id: 'bq6', question: '¿Qué es un "hash" en el contexto de blockchain?', options: ['Una contraseña de usuario', 'Una función matemática que genera una huella digital única', 'El nombre del dueño de un bloque', 'Un tipo de criptomoneda'], correctIndex: 1, explanation: 'Un hash es el resultado de una función criptográfica que produce una cadena única.' },
  { id: 'bq7', question: '¿Cuál de estas NO es una blockchain conocida?', options: ['Ethereum', 'Stellar', 'Solana', 'MySQL'], correctIndex: 3, explanation: 'MySQL es un sistema de base de datos relacional, no una blockchain.' },
  { id: 'bq8', question: '¿Qué son los "smart contracts"?', options: ['Contratos físicos digitalizados', 'Abogados con computadoras', 'Código que se ejecuta automáticamente en la blockchain', 'Emails con firma electrónica'], correctIndex: 2, explanation: 'Los smart contracts son programas que se ejecutan solos cuando se cumplen condiciones predefinidas.' },
  { id: 'bq9', question: '¿Para qué sirve el "consenso" en blockchain?', options: ['Para que todos los nodos estén de acuerdo sobre el estado del registro', 'Para elegir al presidente de la red', 'Para conectar múltiples blockchains', 'Para calcular el precio de las criptomonedas'], correctIndex: 0, explanation: 'El mecanismo de consenso asegura que todos los nodos acuerden cuál es la versión correcta.' },
  { id: 'bq10', question: '¿Qué es la "descentralización" en blockchain?', options: ['Que no hay ningún servidor', 'Que ninguna entidad única tiene control total', 'Que los datos están en la nube de Amazon', 'Que solo los gobiernos pueden acceder'], correctIndex: 1, explanation: 'Descentralización significa que el poder se distribuye entre muchos participantes.' },
  { id: 'bq11', question: '¿Qué es una "wallet" o billetera crypto?', options: ['Una app para guardar fotos', 'Un software que almacena claves para acceder a activos digitales', 'Una tarjeta de crédito virtual', 'Un banco en línea'], correctIndex: 1, explanation: 'Una wallet guarda tus claves criptográficas privadas.' },
  { id: 'bq12', question: '¿Qué ventaja tiene blockchain vs bases de datos tradicionales?', options: ['Es más rápida para consultas', 'Es más barata de mantener', 'Ofrece transparencia e inmutabilidad sin autoridad central', 'Puede almacenar más datos'], correctIndex: 2, explanation: 'La transparencia y la imposibilidad de alterar datos sin consenso son ventajas únicas.' },
  { id: 'bq13', question: '¿Qué es "Proof of Work" (PoW)?', options: ['Un contrato de trabajo para mineros', 'Un mecanismo de consenso que requiere resolver puzzles matemáticos', 'Una forma de pago por trabajo freelance', 'Un protocolo de seguridad'], correctIndex: 1, explanation: 'PoW es el mecanismo de consenso de Bitcoin.' },
  { id: 'bq14', question: '¿En qué año se lanzó Bitcoin?', options: ['2004', '2009', '2013', '2017'], correctIndex: 1, explanation: 'Bitcoin fue lanzado en enero de 2009.' },
  { id: 'bq15', question: '¿Qué son los "tokens" en blockchain?', options: ['Monedas físicas digitalizadas', 'Activos digitales creados sobre una blockchain existente', 'Contraseñas de un solo uso', 'Servidores de validación'], correctIndex: 1, explanation: 'Los tokens son activos digitales creados usando protocolos de blockchain existentes.' },
];

const STELLAR_QUESTIONS = [
  { id: 'sq1', question: '¿En qué año fue fundada la red Stellar?', options: ['2009', '2012', '2014', '2018'], correctIndex: 2, explanation: 'Stellar fue fundada en 2014 por Jed McCaleb y Joyce Kim.' },
  { id: 'sq2', question: '¿Cuál es la criptomoneda nativa de Stellar?', options: ['ETH', 'BTC', 'XLM', 'SOL'], correctIndex: 2, explanation: 'XLM (Lumen) es la criptomoneda nativa de Stellar.' },
  { id: 'sq3', question: '¿Cuál es el mecanismo de consenso de Stellar?', options: ['Proof of Work', 'Proof of Stake', 'Stellar Consensus Protocol (SCP)', 'Delegated PoS'], correctIndex: 2, explanation: 'Stellar usa el SCP, basado en Federated Byzantine Agreement.' },
  { id: 'sq4', question: '¿Cuánto tarda una transacción en Stellar?', options: ['10 minutos', '1 hora', '3-5 segundos', '1 día'], correctIndex: 2, explanation: 'Stellar confirma transacciones en 3-5 segundos.' },
  { id: 'sq5', question: '¿Cuál es el costo de una transacción en Stellar?', options: ['$10 USD', '$1 USD', '$0.01 USD', 'Fracciones de centavo'], correctIndex: 3, explanation: 'Las comisiones en Stellar son extremadamente bajas.' },
  { id: 'sq6', question: '¿Para qué está diseñada Stellar?', options: ['NFTs de arte', 'Pagos internacionales y remesas de bajo costo', 'Videojuegos blockchain', 'Almacenamiento descentralizado'], correctIndex: 1, explanation: 'Stellar facilita transferencias de valor entre fronteras.' },
  { id: 'sq7', question: '¿Qué es la Stellar Development Foundation?', options: ['Un banco central cripto', 'Organización sin fines de lucro que desarrolla Stellar', 'Un fondo de inversión', 'El gobierno de la blockchain'], correctIndex: 1, explanation: 'La SDF es una organización sin fines de lucro dedicada a Stellar.' },
  { id: 'sq8', question: '¿Qué permite Stellar además de enviar XLM?', options: ['Solo enviar XLM', 'Crear y negociar activos personalizados (tokens)', 'Minería de datos', 'Hosting de sitios web'], correctIndex: 1, explanation: 'Stellar permite crear tokens que representan cualquier activo.' },
  { id: 'sq9', question: '¿Qué es una "anchor" en Stellar?', options: ['Un nodo validador', 'Una entidad que conecta activos reales con la blockchain', 'El elemento más pesado', 'Un tipo de wallet fría'], correctIndex: 1, explanation: 'Las anchors emiten tokens respaldados por activos reales.' },
  { id: 'sq10', question: '¿Qué es Stellar Horizon?', options: ['El nombre del consenso', 'La API para interactuar con Stellar', 'El explorador de transacciones', 'La wallet oficial'], correctIndex: 1, explanation: 'Horizon es la API HTTP de Stellar.' },
  { id: 'sq11', question: '¿Cuántos XLM se necesitan para activar una cuenta?', options: ['0 XLM', '1 XLM', '10 XLM', '100 XLM'], correctIndex: 1, explanation: 'Se necesita un balance mínimo de 1 XLM.' },
  { id: 'sq12', question: '¿Qué es el "Friendbot" de Stellar?', options: ['Un bot de redes sociales', 'Un servicio que fondea cuentas en testnet', 'Asistente de atención al cliente', 'Un validador automático'], correctIndex: 1, explanation: 'Friendbot fondea cuentas en el testnet con 10,000 XLM de prueba.' },
  { id: 'sq13', question: '¿Qué son los "Soroban smart contracts"?', options: ['Contratos del gobierno', 'La plataforma de smart contracts de Stellar', 'Tokens NFT', 'Wallet multi-firma'], correctIndex: 1, explanation: 'Soroban es la plataforma de smart contracts de Stellar, escrita en Rust.' },
  { id: 'sq14', question: '¿Qué empresa usa Stellar para pagos internacionales?', options: ['PayPal', 'MoneyGram', 'Visa', 'Western Union'], correctIndex: 1, explanation: 'MoneyGram se asoció con Stellar para pagos usando USDC.' },
  { id: 'sq15', question: '¿Qué es una "keypair" en Stellar?', options: ['Un par de wallets', 'Un par de llaves: pública y privada', 'Dos transacciones relacionadas', 'Un tipo de token'], correctIndex: 1, explanation: 'Un keypair es la clave pública (dirección) y la clave privada (secreto).' },
];

const WALLET_QUESTIONS = [
  { id: 'wq1', question: '¿Qué es una clave pública en una wallet?', options: ['Tu contraseña secreta', 'Tu dirección para recibir fondos', 'El PIN de tu tarjeta', 'Tu nombre de usuario'], correctIndex: 1, explanation: 'La clave pública es como tu número de cuenta bancaria.' },
  { id: 'wq2', question: '¿Qué NUNCA debes compartir?', options: ['Tu dirección pública', 'Tu nombre de usuario', 'Tu clave privada o frase semilla', 'Tu blockchain favorita'], correctIndex: 2, explanation: 'Tu clave privada es el acceso total a tus fondos.' },
  { id: 'wq3', question: '¿Qué es una "seed phrase"?', options: ['Contraseña del exchange', '12-24 palabras para recuperar tu wallet', 'Código para cripto gratis', 'Nombre de tu primer NFT'], correctIndex: 1, explanation: 'La seed phrase es un respaldo mnemónico de tu clave privada.' },
  { id: 'wq4', question: '¿Qué wallet es más segura para grandes cantidades?', options: ['Wallet en exchange', 'App del celular', 'Hardware wallet (Ledger, Trezor)', 'Extensión de navegador'], correctIndex: 2, explanation: 'Las hardware wallets guardan claves offline.' },
  { id: 'wq5', question: '¿Qué es una wallet "custodial"?', options: ['Tú controlas tus claves', 'Un tercero guarda tus claves', 'Una wallet para guardar custodios', 'Sin contraseña'], correctIndex: 1, explanation: 'En una wallet custodial, el exchange guarda tus claves.' },
  { id: 'wq6', question: '¿Qué hace Tonalli con la wallet de sus usuarios?', options: ['No crea wallets', 'Crea automáticamente una wallet Stellar', 'Pide comprar XLM primero', 'Usa la misma wallet para todos'], correctIndex: 1, explanation: 'Tonalli crea una wallet Stellar automáticamente al registrarte.' },
  { id: 'wq7', question: '¿Cómo se llama la red de pruebas de Stellar?', options: ['Mainnet', 'Devnet', 'Testnet', 'Sandbox'], correctIndex: 2, explanation: 'El Testnet es la red de pruebas de Stellar.' },
  { id: 'wq8', question: '¿Qué recibes al completar una lección en Tonalli?', options: ['Solo puntos', 'XP, XLM y un NFT certificado', 'Dinero en tu banco', 'Un diploma en papel'], correctIndex: 1, explanation: 'Tonalli recompensa con XP, XLM real y un NFT certificado.' },
  { id: 'wq9', question: '¿Qué es un NFT?', options: ['Una criptomoneda como Bitcoin', 'Un token único e irrepetible en blockchain', 'Un contrato inteligente', 'Una wallet multi-firma'], correctIndex: 1, explanation: 'Un NFT es un token único que prueba propiedad digital.' },
  { id: 'wq10', question: '¿Qué datos tiene una transacción en Stellar?', options: ['Solo el monto', 'Origen, destino, monto, comisión y firma digital', 'Email y contraseña', 'Solo la firma del banco'], correctIndex: 1, explanation: 'Una transacción Stellar incluye cuenta origen, destino, monto, fee y firma.' },
  { id: 'wq11', question: '¿Qué es "manage_data" en Stellar?', options: ['App de datos personales', 'Operación que guarda datos en una cuenta', 'Panel de control', 'Forma de eliminar transacciones'], correctIndex: 1, explanation: 'manage_data permite almacenar hasta 64 bytes de datos en una cuenta.' },
  { id: 'wq12', question: '¿Qué significa "GABC..." al inicio de una dirección Stellar?', options: ['Cuenta de gobierno', 'Formato Base32 de claves públicas Stellar', 'Cuenta verificada', 'Cuenta de empresa'], correctIndex: 1, explanation: 'Las claves públicas Stellar comienzan con "G" y están en Base32.' },
  { id: 'wq13', question: '¿Qué es el "Stellar Expert"?', options: ['Un certificado', 'Un explorador de bloques para Stellar', 'Un asesor financiero', 'La wallet oficial'], correctIndex: 1, explanation: 'Stellar Expert es un explorador de bloques.' },
  { id: 'wq14', question: '¿Qué es el "balance mínimo" en Stellar?', options: ['Mínimo para una transacción', 'Reserva de XLM que siempre debe existir', 'Costo de crear wallet', 'Máximo que puedes guardar'], correctIndex: 1, explanation: 'Stellar requiere una reserva base de ~1 XLM.' },
  { id: 'wq15', question: '¿Qué personaje de Tonalli es un xoloescuincle?', options: ['Chima', 'Alli', 'Xollo', 'Stella'], correctIndex: 2, explanation: 'Xollo es el xoloescuincle mascota de Tonalli.' },
];

// ── Seed function ──────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting Tonalli seed...');

  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const lessonRepo = AppDataSource.getRepository(Lesson);
  const quizRepo = AppDataSource.getRepository(Quiz);
  const chapterRepo = AppDataSource.getRepository(Chapter);
  const chapterModuleRepo = AppDataSource.getRepository(ChapterModule);

  // ── Users ────────────────────────────────────────────────────────────────────
  const adminEmail = 'admin@tonalli.mx';
  const userEmail = 'demo@tonalli.mx';

  const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await userRepo.save(userRepo.create({
      email: adminEmail, username: 'TonalliAdmin', displayName: 'Administrador',
      password: await bcrypt.hash('Admin2024!', 10), city: 'Ciudad de México',
      role: 'admin', xp: 0, totalXp: 0, currentStreak: 0, isPremium: true,
    }));
    console.log('✅ Admin user created: admin@tonalli.mx / Admin2024!');
  }

  const existingUser = await userRepo.findOne({ where: { email: userEmail } });
  if (!existingUser) {
    await userRepo.save(userRepo.create({
      email: userEmail, username: 'CryptoAzteca', displayName: 'Crypto Azteca',
      password: await bcrypt.hash('Demo2024!', 10), city: 'Guadalajara',
      role: 'user', xp: 0, totalXp: 0, currentStreak: 0, isPremium: false,
      dateOfBirth: '2000-05-15',
    }));
    console.log('✅ Demo user created: demo@tonalli.mx / Demo2024!');
  }

  // Create a premium demo user
  const premiumEmail = 'premium@tonalli.mx';
  const existingPremium = await userRepo.findOne({ where: { email: premiumEmail } });
  if (!existingPremium) {
    await userRepo.save(userRepo.create({
      email: premiumEmail, username: 'PremiumUser', displayName: 'Usuario Premium',
      password: await bcrypt.hash('Premium2024!', 10), city: 'Monterrey',
      role: 'user', xp: 500, totalXp: 500, currentStreak: 5, isPremium: true,
      dateOfBirth: '1995-03-20',
    }));
    console.log('✅ Premium user created: premium@tonalli.mx / Premium2024!');
  }

  // ── Chapters: each has 4 modules ──────────────────────────────────────────
  // Modules 1-3: each has info + video + quiz (5 questions)
  // Module 4: final exam (10 questions from ALL 3 modules combined)

  const existingChapters = await chapterRepo.count();
  if (existingChapters === 0) {
    // Split questions into 3 groups of 5 per module
    const bq1 = BLOCKCHAIN_QUESTIONS.slice(0, 5);
    const bq2 = BLOCKCHAIN_QUESTIONS.slice(5, 10);
    const bq3 = BLOCKCHAIN_QUESTIONS.slice(10, 15);

    const sq1 = STELLAR_QUESTIONS.slice(0, 5);
    const sq2 = STELLAR_QUESTIONS.slice(5, 10);
    const sq3 = STELLAR_QUESTIONS.slice(10, 15);

    const wq1 = WALLET_QUESTIONS.slice(0, 5);
    const wq2 = WALLET_QUESTIONS.slice(5, 10);
    const wq3 = WALLET_QUESTIONS.slice(10, 15);

    // ── CHAPTER 1: Blockchain ──────────────────────────────────────────────
    const ch1 = await chapterRepo.save(chapterRepo.create({
      title: 'Introducción al Blockchain',
      description: 'Aprende los conceptos fundamentales de la tecnología blockchain.',
      moduleTag: 'blockchain', order: 1, published: true, estimatedMinutes: 20, xpReward: 140,
      releaseWeek: '2026-W12',
    }));

    // Module 1: ¿Qué es Blockchain?
    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch1.id, type: 'lesson', order: 1, title: '¿Qué es Blockchain?',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: '¿Qué es una Blockchain?', text: 'Una blockchain (cadena de bloques) es una base de datos distribuida que registra transacciones de forma permanente y transparente. A diferencia de una base de datos tradicional controlada por una sola empresa (como un banco), la blockchain es mantenida simultáneamente por miles de computadoras alrededor del mundo llamadas "nodos".\n\nImagina un libro de contabilidad público donde todos pueden escribir, pero nadie puede borrar ni modificar lo que ya se escribió. Cada página nueva hace referencia a la anterior, creando una cadena imposible de romper.\n\nFuente: ethereum.org/es/learn — documentación oficial de Ethereum en español.', icon: '🔗' },
        { title: '¿Cómo funciona?', text: 'Los datos se organizan en "bloques". Cada bloque contiene:\n\n• Un conjunto de transacciones verificadas\n• Una marca de tiempo (timestamp) exacta\n• Un hash criptográfico del bloque anterior\n• Un hash propio (su "huella digital" única)\n\nUn hash es como una huella digital matemática: cualquier cambio en los datos produce un hash completamente diferente. Si alguien modifica un bloque antiguo, su hash cambia, rompiendo la cadena y alertando a toda la red.\n\nEste diseño hace que la blockchain sea prácticamente imposible de hackear: tendrías que modificar TODOS los bloques en MÁS del 50% de los nodos simultáneamente.', icon: '⛓️' },
        { title: 'Las 4 características fundamentales', text: '1. DESCENTRALIZADA: No hay un servidor central. Miles de nodos mantienen copias idénticas del registro. Si uno falla, los demás continúan.\n\n2. INMUTABLE: Una vez que una transacción se registra en un bloque y se confirma, no se puede modificar ni eliminar. Es permanente.\n\n3. TRANSPARENTE: Cualquier persona puede verificar cualquier transacción usando un explorador de bloques. Todo es público y auditable.\n\n4. SEGURA: La criptografía de clave pública-privada y los mecanismos de consenso protegen la red contra fraudes y ataques.', icon: '🔒' },
        { title: '¿Por qué importa en tu vida?', text: 'Blockchain no es solo Bitcoin. Esta tecnología permite:\n\n• Enviar dinero a tu familia en otro país en segundos y por centavos (vs días y comisiones altas con bancos)\n• Tener certificados académicos o profesionales que nadie puede falsificar\n• Ser dueño real de tus activos digitales sin intermediarios\n• Votar de forma transparente e incorruptible\n• Acceder a servicios financieros sin necesidad de cuenta bancaria\n\nEn Latinoamérica, donde 45% de la población no tiene cuenta bancaria (según el Banco Mundial), blockchain es una herramienta de inclusión financiera real.', icon: '💡' },
      ], keyTerms: [
        { term: 'Blockchain', definition: 'Base de datos distribuida e inmutable organizada en bloques enlazados criptográficamente' },
        { term: 'Bloque', definition: 'Unidad de datos que contiene transacciones, un timestamp y el hash del bloque anterior' },
        { term: 'Hash', definition: 'Función matemática que genera una huella digital única e irreversible de cualquier dato' },
        { term: 'Nodo', definition: 'Computador que mantiene una copia completa de la blockchain y valida transacciones' },
        { term: 'Descentralización', definition: 'Distribución del control entre muchos participantes sin autoridad central' },
      ] }),
      videoUrl: '',
      questionsPool: JSON.stringify(bq1),
    }));

    // Module 2: Conceptos avanzados
    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch1.id, type: 'lesson', order: 2, title: 'Conceptos avanzados de Blockchain',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: 'Smart Contracts (Contratos Inteligentes)', text: 'Un smart contract es un programa almacenado en la blockchain que se ejecuta automáticamente cuando se cumplen condiciones predefinidas. Funciona como una máquina expendedora digital: metes dinero, seleccionas lo que quieres, y la máquina entrega el producto sin necesidad de un empleado.\n\nEjemplo real: Un seguro de vuelo basado en smart contract puede pagarte automáticamente si tu vuelo se retrasa más de 2 horas, sin que tengas que hacer ningún reclamo.\n\nEthereum popularizó los smart contracts en 2015. Stellar los incorporó con su plataforma Soroban (escrita en Rust) en 2024. Tonalli usa smart contracts para emitir tus certificados NFT automáticamente.\n\nFuente: developers.stellar.org — documentación oficial de Stellar.', icon: '📜' },
        { title: 'Mecanismos de consenso', text: '¿Cómo se ponen de acuerdo miles de nodos sobre qué transacciones son válidas? Usando mecanismos de consenso:\n\nPROOF OF WORK (PoW) — Bitcoin\nMineros compiten resolviendo puzzles matemáticos complejos. El primero en resolverlo gana el derecho de agregar el siguiente bloque. Consume mucha energía (comparable al consumo eléctrico de Argentina).\n\nPROOF OF STAKE (PoS) — Ethereum (desde 2022)\nValidadores "apuestan" sus monedas como garantía. Si validan mal, pierden su apuesta. Consume 99.95% menos energía que PoW.\n\nSTELLAR CONSENSUS PROTOCOL (SCP) — Stellar\nNodos votan entre sí para llegar a acuerdo en segundos. No requiere minería ni apuestas. Es el más eficiente y ecológico de los tres.\n\nFuente: stellar.org/learn', icon: '🤝' },
        { title: 'Tokens vs Criptomonedas', text: 'No son lo mismo:\n\nCRIPTOMONEDAS: Son nativas de su blockchain. Son como la moneda oficial de un país.\n• BTC es nativo de Bitcoin\n• ETH es nativo de Ethereum\n• XLM es nativo de Stellar\n\nTOKENS: Se crean sobre blockchains existentes. Son como fichas de casino: valen algo, pero funcionan dentro de un sistema ya existente.\n• USDC (dólar digital) corre sobre Ethereum y Stellar\n• Los NFTs son tokens únicos que representan propiedad digital\n• Los tokens ERC-20 de Ethereum, los activos Stellar\n\nTonalli te recompensa con XLM (criptomoneda nativa de Stellar) y emite NFTs (tokens) como certificados de tus logros.\n\nFuente: coinmarketcap.com/alexandria — enciclopedia cripto verificada.', icon: '🪙' },
      ], keyTerms: [
        { term: 'Smart Contract', definition: 'Programa auto-ejecutable en la blockchain que se activa cuando se cumplen condiciones predefinidas' },
        { term: 'Proof of Work', definition: 'Mecanismo de consenso donde mineros resuelven puzzles matemáticos. Usado por Bitcoin.' },
        { term: 'Proof of Stake', definition: 'Mecanismo de consenso donde validadores apuestan sus monedas como garantía. Usado por Ethereum.' },
        { term: 'Token', definition: 'Activo digital creado sobre una blockchain existente, diferente a la criptomoneda nativa' },
        { term: 'Soroban', definition: 'Plataforma de smart contracts de Stellar, escrita en Rust' },
      ] }),
      videoUrl: '',
      questionsPool: JSON.stringify(bq2),
    }));

    // Module 3: Blockchain en el mundo real
    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch1.id, type: 'lesson', order: 3, title: 'Blockchain en el mundo real',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: 'Blockchain en Latinoamérica', text: 'América Latina lidera la adopción crypto en el mundo en desarrollo:\n\n• MÉXICO: Bitso (exchange más grande de LATAM) procesa más de $1 billón USD en remesas. La Ley Fintech de 2018 regula activos virtuales. Stellar tiene alianzas activas en el país.\n\n• ARGENTINA: Con inflación superior al 100% anual, millones usan stablecoins (USDC, DAI) para proteger sus ahorros. Mercado Libre acepta crypto.\n\n• EL SALVADOR: Primer país en adoptar Bitcoin como moneda legal en 2021.\n\n• BRASIL: Banco Central desarrolla el Real Digital (DREX) sobre tecnología blockchain.\n\nSegún Chainalysis, LATAM representa el 7.3% de las transacciones crypto globales, con crecimiento anual del 40%.', icon: '🇲🇽' },
        { title: 'Wallets y activos digitales', text: 'Una wallet (billetera digital) es el software que te permite interactuar con la blockchain:\n\nCLAVE PÚBLICA (tu dirección): Como tu número de cuenta bancaria. La compartes para recibir pagos. En Stellar empieza con "G...".\n\nCLAVE PRIVADA (tu secreto): Como la contraseña de tu banco, pero MÁS importante. Si alguien la tiene, controla todos tus fondos. NUNCA la compartas. En Stellar empieza con "S...".\n\nSEED PHRASE (frase semilla): 12-24 palabras que son el respaldo maestro de tu wallet. Guárdala en papel, NUNCA en tu celular o computadora.\n\nRegla de oro: "Not your keys, not your coins" — si no controlas tus claves, no controlas tu dinero.', icon: '👛' },
        { title: 'El futuro: Web3 y más allá', text: 'Web3 es la evolución del internet:\n\nWEB1 (1990s): Solo leer. Páginas estáticas.\nWEB2 (2000s): Leer y escribir. Redes sociales, pero las empresas son dueñas de tus datos.\nWEB3 (ahora): Leer, escribir y POSEER. Tú eres dueño de tus datos, identidad y activos digitales.\n\nAplicaciones de Web3:\n• DeFi (Finanzas Descentralizadas): Préstamos, ahorros y seguros sin bancos\n• NFTs: Propiedad verificable de arte, música, certificados y más\n• DAOs: Organizaciones gobernadas por votación en blockchain\n• Identidad descentralizada: Control total sobre tu identidad digital\n\nTonalli te prepara para este futuro certificando tus conocimientos con NFTs reales en Stellar.', icon: '🌐' },
      ], keyTerms: [
        { term: 'Wallet', definition: 'Software que almacena claves criptográficas para interactuar con la blockchain' },
        { term: 'NFT', definition: 'Non-Fungible Token — token único e irrepetible que prueba propiedad digital' },
        { term: 'DeFi', definition: 'Finanzas Descentralizadas — servicios financieros sin intermediarios, usando smart contracts' },
        { term: 'Stablecoin', definition: 'Criptomoneda con valor estable, generalmente vinculada al dólar (ej. USDC, USDT)' },
        { term: 'Web3', definition: 'La evolución del internet donde los usuarios poseen sus datos y activos digitales' },
      ] }),
      videoUrl: '',
      questionsPool: JSON.stringify(bq3),
    }));

    // Module 4: Examen final (mezcla preguntas de los 3 módulos)
    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch1.id, type: 'final_exam', order: 4, title: 'Examen Final: Blockchain',
      xpReward: 50, passingScore: 80, questionsPerAttempt: 10,
      // The final exam pulls from all 3 lesson modules' question pools automatically
      // but we can also add extra questions here
      questionsPool: undefined,
    }));

    console.log('✅ Cap 1: Intro Blockchain (3 módulos x [info+video+quiz] + examen final)');

    // ── CHAPTER 2: Stellar ─────────────────────────────────────────────────
    const ch2 = await chapterRepo.save(chapterRepo.create({
      title: 'Stellar Network',
      description: 'Descubre por qué Stellar es la blockchain perfecta para pagos en Latinoamérica.',
      moduleTag: 'stellar', order: 2, published: true, estimatedMinutes: 20, xpReward: 140,
      releaseWeek: '2026-W13',
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch2.id, type: 'lesson', order: 1, title: '¿Qué es Stellar?',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: '¿Qué es Stellar?', text: 'Stellar es una red blockchain de código abierto fundada en 2014 por Jed McCaleb (cofundador de Ripple) y Joyce Kim. Su misión es facilitar pagos internacionales rápidos, baratos y accesibles para todos.\n\nSu criptomoneda nativa se llama XLM (Lumen). Un Lumen es la unidad básica de la red y se usa para pagar comisiones de transacción y prevenir spam en la red.\n\nA diferencia de Bitcoin (diseñado como "oro digital") o Ethereum (diseñado para smart contracts), Stellar fue diseñada específicamente para PAGOS y REMESAS entre fronteras.\n\nFuente: stellar.org/learn — documentación oficial de la Stellar Development Foundation.', icon: '⭐' },
        { title: 'Velocidad, costo y eficiencia', text: 'Comparativa de transacciones:\n\n• BITCOIN: 10-60 minutos, comisión $1-50 USD\n• ETHEREUM: 15 segundos-5 minutos, comisión $0.50-50 USD\n• STELLAR: 3-5 SEGUNDOS, comisión $0.0000001 USD\n• TRANSFERENCIA BANCARIA INTERNACIONAL: 3-5 DÍAS, comisión $25-50 USD\n\nStellar puede procesar hasta 1,000 transacciones por segundo. Con Soroban (smart contracts), esta capacidad se expande aún más.\n\nPara enviar $200 USD a tu familia en otro país, un banco cobra ~$25 de comisión. Con Stellar, cuesta menos de un centavo y llega en 5 segundos.', icon: '⚡' },
        { title: 'Stellar Consensus Protocol (SCP)', text: 'Stellar NO usa minería (a diferencia de Bitcoin). Usa el SCP, un protocolo inventado por el Dr. David Mazières de Stanford.\n\n¿Cómo funciona?\n1. Cada nodo tiene una lista de nodos en los que confía (quorum slice)\n2. Los nodos votan sobre qué transacciones son válidas\n3. Cuando suficientes nodos están de acuerdo, se alcanza consenso\n4. El bloque se confirma en 3-5 segundos\n\nVentajas del SCP:\n• No consume energía como PoW (ecológico)\n• No requiere apostar monedas como PoS\n• Resistente a fallas parciales de la red\n• Nodos nuevos se pueden unir libremente\n\nFuente: developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol', icon: '🤝' },
      ], keyTerms: [
        { term: 'XLM (Lumen)', definition: 'Criptomoneda nativa de Stellar, usada para comisiones y operaciones en la red' },
        { term: 'SCP', definition: 'Stellar Consensus Protocol — mecanismo de votación entre nodos sin minería' },
        { term: 'Quorum Slice', definition: 'Conjunto de nodos en los que un nodo confía para alcanzar consenso' },
      ] }),
      videoUrl: '', questionsPool: JSON.stringify(sq1),
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch2.id, type: 'lesson', order: 2, title: 'El ecosistema Stellar',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: 'Anchors: el puente con el mundo real', text: 'Un anchor (ancla) es una entidad de confianza que conecta activos del mundo real con la red Stellar.\n\nEjemplo: Si un banco en México emite "pesos digitales" en Stellar, ese banco es un anchor. Los pesos digitales están respaldados 1:1 por pesos reales en el banco.\n\nAnchors populares:\n• Circle — emite USDC (dólar digital) en Stellar\n• Anclap — emite ARS (peso argentino digital) en Stellar\n• ClickPesa — servicios financieros en África sobre Stellar\n\nEsto permite que envíes dólares digitales desde EE.UU. y tu familia en México reciba pesos mexicanos reales, todo en segundos y por centavos.\n\nFuente: stellar.org/learn/anchor-basics', icon: '⚓' },
        { title: 'Horizon API y herramientas para desarrolladores', text: 'Horizon es la API HTTP de Stellar — la puerta de entrada para que las aplicaciones interactúen con la red.\n\nURL de testnet: https://horizon-testnet.stellar.org\nURL de mainnet: https://horizon.stellar.org\n\nCon Horizon puedes:\n• Consultar saldos de cualquier cuenta\n• Enviar pagos y crear transacciones\n• Buscar historial de operaciones\n• Monitorear la red en tiempo real\n\nSDKs disponibles: JavaScript, Python, Go, Java, .NET\n\nTonalli usa Horizon para crear tu wallet, fondearte con XLM y emitir tus certificados NFT. Toda la tecnología detrás de tus recompensas funciona a través de esta API.\n\nFuente: developers.stellar.org/docs/data/horizon', icon: '🔌' },
        { title: 'Stellar Development Foundation (SDF)', text: 'La SDF es la organización sin fines de lucro que desarrolla y promueve Stellar. Fue fundada en 2014 con la misión de crear acceso financiero equitativo.\n\nLa SDF:\n• Desarrolla el software core de Stellar (stellar-core, Horizon, Soroban)\n• Otorga grants a proyectos que construyen sobre Stellar\n• Organiza eventos como Meridian (conferencia anual)\n• Mantiene el Friendbot para testnet\n• Promueve la adopción en mercados emergentes\n\nDatos clave:\n• +8 millones de cuentas activas en Stellar\n• +2 mil millones de operaciones procesadas\n• Presente en más de 30 países\n\nTonalli participa en el ecosistema Stellar a través del Hackathon Código Alebrije de la SDF.', icon: '🏛️' },
      ], keyTerms: [
        { term: 'Anchor', definition: 'Entidad que emite activos respaldados por valor real en la red Stellar' },
        { term: 'Horizon', definition: 'API HTTP de Stellar para interactuar con la red desde aplicaciones' },
        { term: 'SDF', definition: 'Stellar Development Foundation — organización sin fines de lucro detrás de Stellar' },
        { term: 'USDC', definition: 'USD Coin — stablecoin del dólar emitido por Circle, disponible en Stellar' },
      ] }),
      videoUrl: '', questionsPool: JSON.stringify(sq2),
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch2.id, type: 'lesson', order: 3, title: 'Soroban, Keypairs y el futuro',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: 'Soroban: Smart Contracts en Stellar', text: 'Soroban es la plataforma de smart contracts de Stellar, lanzada oficialmente en 2024. Está escrita en Rust, uno de los lenguajes más seguros.\n\n¿Por qué Soroban es especial?\n• Costos predecibles: sabes cuánto costará tu transacción ANTES de ejecutarla\n• Modelo de almacenamiento eficiente: los datos tienen "fecha de expiración"\n• Seguridad de Rust: previene errores comunes como buffer overflows\n• Compatible con el ecosistema Stellar existente\n\nCasos de uso de Soroban:\n• DeFi: préstamos, exchanges descentralizados\n• NFTs: certificados, arte digital, coleccionables\n• DAOs: gobernanza descentralizada\n• Identidad: verificación sin intermediarios\n\nTonalli usa Soroban para crear los certificados NFT que recibes al completar capítulos.\n\nFuente: soroban.stellar.org', icon: '🚀' },
        { title: 'Keypairs, cuentas y Friendbot', text: 'Para usar Stellar necesitas un KEYPAIR (par de claves):\n\nCLAVE PÚBLICA (empieza con G): Tu dirección en Stellar. Es como tu correo electrónico — la compartes para que te envíen XLM.\nEjemplo: GCDWF5QNGDW5MQ5OBNWPC3LB5ODVYL73...\n\nCLAVE PRIVADA (empieza con S): Tu contraseña maestra. NUNCA la compartas. Quien la tenga controla tus fondos.\nEjemplo: SCZANGBA5YHTNYVVV2C3CQKQX...\n\nPara activar una cuenta Stellar necesitas un BALANCE MÍNIMO de 1 XLM (la "reserva base"). Cada sub-entrada (trustlines, ofertas, datos) requiere 0.5 XLM adicional.\n\nFRIENDBOT: En testnet, puedes fondear cualquier cuenta gratis con https://friendbot.stellar.org?addr=TU_CLAVE_PUBLICA. Tonalli usa Friendbot para fondear tu wallet automáticamente al registrarte.', icon: '🔑' },
        { title: 'Empresas que usan Stellar', text: 'Stellar no es solo teoría. Empresas reales mueven millones de dólares sobre la red:\n\n• MONEYGRAM: Alianza con Stellar para remesas internacionales usando USDC. Presente en 200 países.\n• CIRCLE: Emite USDC (dólar digital) en Stellar. +$25 mil millones en circulación.\n• BITSO: Exchange mexicano que usa Stellar para pagos transfronterizos.\n• FLUTTERWAVE: Pagos en África sobre Stellar.\n• FRANKLIN TEMPLETON: Fondo de inversión de $1.4 trillones que tokenizó un fondo del mercado monetario en Stellar.\n\nStellar Expert (stellar.expert) es el explorador de bloques donde puedes verificar cualquier transacción en la red.\n\nFuente: stellar.org/case-studies', icon: '🏦' },
      ], keyTerms: [
        { term: 'Soroban', definition: 'Plataforma de smart contracts de Stellar, escrita en Rust' },
        { term: 'Keypair', definition: 'Par de clave pública (dirección) y clave privada (secreto) en Stellar' },
        { term: 'Friendbot', definition: 'Servicio gratuito que fondea cuentas en el testnet de Stellar con 10,000 XLM de prueba' },
        { term: 'Reserva base', definition: 'Balance mínimo de 1 XLM necesario para mantener activa una cuenta Stellar' },
      ] }),
      videoUrl: '', questionsPool: JSON.stringify(sq3),
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch2.id, type: 'final_exam', order: 4, title: 'Examen Final: Stellar',
      xpReward: 50, passingScore: 80, questionsPerAttempt: 10, questionsPool: undefined,
    }));

    console.log('✅ Cap 2: Stellar Network (3 módulos x [info+video+quiz] + examen final)');

    // ── CHAPTER 3: Wallets ─────────────────────────────────────────────────
    const ch3 = await chapterRepo.save(chapterRepo.create({
      title: 'Wallets y Seguridad',
      description: 'Aprende cómo funciona tu wallet Stellar y cómo proteger tus activos digitales.',
      moduleTag: 'wallets', order: 3, published: true, estimatedMinutes: 18, xpReward: 140,
      releaseWeek: '2026-W14',
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch3.id, type: 'lesson', order: 1, title: 'Tu primera wallet',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: 'Tu wallet ya existe', text: 'Cuando te registraste en Tonalli, creamos automáticamente una wallet Stellar para ti. No necesitaste descargar nada extra ni saber de criptomonedas.\n\n¿Qué pasó cuando te registraste?\n1. Generamos un KEYPAIR (par de claves) único para ti\n2. Fondeamos tu cuenta con XLM de testnet usando Friendbot\n3. Tu wallet quedó lista para recibir recompensas y certificados NFT\n\nPuedes ver tu dirección de wallet en tu perfil de Tonalli. Cada vez que completes un capítulo, recibirás XLM directamente en esta wallet.\n\nEn el futuro, cuando Tonalli migre a mainnet, tus recompensas serán XLM con valor real que podrás intercambiar o enviar a otros.', icon: '👛' },
        { title: 'Clave pública vs clave privada', text: 'Tu wallet tiene dos partes esenciales:\n\nCLAVE PUBLICA (empieza con G...):\n• Es tu "dirección" en la blockchain\n• La puedes compartir libremente\n• Cualquiera puede usarla para ENVIARTE fondos\n• Es como el número de tu cuenta bancaria\n\nCLAVE PRIVADA (empieza con S...):\n• Es tu "contraseña maestra"\n• NUNCA JAMAS la compartas con nadie\n• Quien la tenga controla TODOS tus fondos\n• Es como la contraseña de tu banca en línea + tu token + tu huella dactilar, TODO JUNTO\n\nRegla de oro en crypto: "Not your keys, not your coins" — Si no controlas tu clave privada, no eres realmente dueño de tu dinero.', icon: '🔑' },
        { title: 'Seed phrase (frase semilla)', text: 'La seed phrase (frase semilla) es un respaldo maestro de tu wallet compuesto por 12 o 24 palabras en inglés, generadas aleatoriamente.\n\nEjemplo: "apple banana cherry dog elephant fish guitar house ice jam kite lemon"\n\nSi pierdes acceso a tu dispositivo, puedes recuperar tu wallet COMPLETA usando estas palabras.\n\nREGLAS PARA TU SEED PHRASE:\n• Escríbela en PAPEL, nunca en tu celular o computadora\n• Guárdala en un lugar seguro (caja fuerte, etc.)\n• Nunca la fotografíes ni la envíes por WhatsApp\n• Nadie legítimo te la pedirá jamás\n• Si alguien te la pide, es una ESTAFA\n\nTonalli guarda tu clave privada de forma segura, pero en wallets personales, la seed phrase es tu responsabilidad total.\n\nFuente: bitcoin.org/es — documentación oficial sobre seguridad de wallets.', icon: '📝' },
      ], keyTerms: [
        { term: 'Clave pública', definition: 'Tu dirección en la blockchain. Se comparte para recibir fondos. Empieza con G en Stellar.' },
        { term: 'Clave privada', definition: 'Tu secreto para autorizar transacciones. NUNCA se comparte. Empieza con S en Stellar.' },
        { term: 'Seed phrase', definition: '12-24 palabras que son el respaldo maestro de tu wallet. Permite recuperar acceso total.' },
        { term: 'Keypair', definition: 'Par de clave pública y privada que forma tu identidad en la blockchain' },
      ] }),
      videoUrl: '', questionsPool: JSON.stringify(wq1),
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch3.id, type: 'lesson', order: 2, title: 'Tipos de wallets',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: 'Wallets Custodial vs Non-Custodial', text: 'CUSTODIAL (Un tercero guarda tus claves):\n• Ejemplos: Binance, Bitso, Coinbase\n• Ventaja: Si pierdes tu contraseña, puedes recuperarla\n• Desventaja: El exchange puede congelarte la cuenta, ser hackeado, o cerrar\n• Es como tener tu dinero en un banco: ellos lo "cuidan"\n\nNON-CUSTODIAL (Tú controlas tus claves):\n• Ejemplos: MetaMask, Freighter (Stellar), Ledger\n• Ventaja: Control total, nadie puede censurarte ni congelarte\n• Desventaja: Si pierdes tu seed phrase, pierdes todo PARA SIEMPRE\n• Es como guardar efectivo en tu casa: tú eres responsable\n\n¿Cuál elegir?\n• Para empezar y aprender: custodial (exchange)\n• Para guardar grandes cantidades: non-custodial\n• Nunca pongas TODO en un solo lugar\n\nFuente: academy.binance.com/es — Binance Academy en español.', icon: '🏦' },
        { title: 'Hot Wallets vs Cold Wallets', text: 'HOT WALLETS (conectadas a internet):\n• Apps móviles: Freighter, Trust Wallet, MetaMask\n• Extensiones de navegador: Freighter (Stellar), MetaMask (Ethereum)\n• Ventaja: Cómodas para uso diario\n• Riesgo: Vulnerables a malware, phishing, hackeos\n\nCOLD WALLETS (desconectadas de internet):\n• Hardware wallets: Ledger Nano, Trezor ($50-150 USD)\n• Paper wallets: claves impresas en papel\n• Ventaja: Máxima seguridad contra ataques digitales\n• Riesgo: Si pierdes el dispositivo sin backup, pierdes todo\n\nRECOMENDACION:\n• Guarda en hot wallet solo lo que usarías en tu "bolsillo" (gastos diarios)\n• Guarda en cold wallet tus ahorros importantes\n• Siempre ten respaldo de tu seed phrase', icon: '🧊' },
        { title: 'Freighter: la wallet de Stellar', text: 'Freighter es la wallet oficial recomendada para Stellar. Es una extensión de navegador (Chrome, Firefox, Brave).\n\nCaracterísticas:\n• Maneja XLM y cualquier token de Stellar\n• Firma transacciones y smart contracts (Soroban)\n• Conecta con dApps del ecosistema Stellar\n• Gratuita y de código abierto\n\nEn Tonalli, tu wallet se gestiona internamente, pero si quieres explorar el ecosistema Stellar por tu cuenta, Freighter es el primer paso.\n\nPara instalarla: busca "Freighter Wallet" en la tienda de extensiones de tu navegador.\n\nFuente: freighter.app — sitio oficial de Freighter wallet.', icon: '🌟' },
      ], keyTerms: [
        { term: 'Custodial wallet', definition: 'Wallet donde un tercero (exchange) guarda tus claves privadas' },
        { term: 'Non-custodial wallet', definition: 'Wallet donde TU controlas tus claves privadas directamente' },
        { term: 'Hot wallet', definition: 'Wallet conectada a internet. Cómoda pero vulnerable a ataques.' },
        { term: 'Cold wallet', definition: 'Wallet offline (hardware). Máxima seguridad para grandes cantidades.' },
        { term: 'Freighter', definition: 'Wallet oficial de Stellar como extensión de navegador' },
      ] }),
      videoUrl: '', questionsPool: JSON.stringify(wq2),
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch3.id, type: 'lesson', order: 3, title: 'Seguridad y transacciones',
      xpReward: 30, passingScore: 80, questionsPerAttempt: 5,
      content: JSON.stringify({ sections: [
        { title: 'Anatomía de una transacción Stellar', text: 'Cada transacción en Stellar contiene:\n\n• CUENTA ORIGEN: Quién envía (tu clave pública)\n• OPERACIONES: Qué quieres hacer (pagar, crear oferta, guardar datos)\n• COMISION (FEE): ~0.00001 XLM (fracciones de centavo)\n• NUMERO DE SECUENCIA: Previene transacciones duplicadas\n• FIRMA DIGITAL: Tu clave privada autoriza la operación\n• MEMO (opcional): Un mensaje adjunto\n\nTipos de operaciones comunes:\n• payment: Enviar XLM o tokens a otra cuenta\n• manage_data: Guardar datos en la cuenta (usado para NFTs/certificados)\n• create_account: Crear una cuenta nueva\n• change_trust: Aceptar un nuevo tipo de token\n\nPuedes ver cualquier transacción en stellar.expert (explorador de bloques de Stellar).', icon: '📊' },
        { title: 'NFTs y certificados en Stellar', text: 'Un NFT (Non-Fungible Token) es un token UNICO en la blockchain que prueba que algo te pertenece o que lograste algo.\n\nEn Tonalli, cuando completas un capítulo al 100%:\n1. Se ejecuta una transacción en Stellar\n2. Se usa la operación manage_data para guardar los datos del certificado\n3. Los datos incluyen: tu ID, el capítulo, tu calificación y la fecha\n4. La transacción queda registrada PERMANENTEMENTE en la blockchain\n5. Cualquiera puede verificar tu certificado con el hash de transacción\n\nEste certificado es:\n• INMUTABLE: Nadie puede modificarlo ni eliminarlo\n• VERIFICABLE: Cualquier persona o empresa puede confirmar su autenticidad\n• TUYO: Está en tu wallet, no depende de que Tonalli exista\n\nAdemás, con la alianza con ACTA, tus certificados cumplen el estándar W3C Verifiable Credentials 2.0, aceptado internacionalmente.\n\nFuente: docs.acta.build — documentación oficial de ACTA.', icon: '🏆' },
        { title: '10 reglas de seguridad en crypto', text: '1. NUNCA compartas tu clave privada o seed phrase con nadie\n2. NUNCA hagas clic en links de "airdrops gratis" o "duplica tu crypto"\n3. SIEMPRE verifica la dirección de destino antes de enviar fondos\n4. USA autenticación de 2 factores (2FA) en todos tus exchanges\n5. NO guardes grandes cantidades en hot wallets o exchanges\n6. DESCONFIA de cualquiera que te pida tu seed phrase (es SIEMPRE estafa)\n7. USA contraseñas únicas para cada servicio crypto\n8. VERIFICA las URLs antes de conectar tu wallet (phishing)\n9. ACTUALIZA siempre el software de tu wallet\n10. EMPIEZA con cantidades pequeñas hasta entender bien el sistema\n\nRecuerda: En crypto no hay servicio al cliente que te devuelva fondos perdidos. La seguridad es 100% tu responsabilidad.\n\nFuente: bitcoin.org/es/seguridad', icon: '✅' },
      ], keyTerms: [
        { term: 'NFT', definition: 'Non-Fungible Token — token único que prueba propiedad o logro en blockchain' },
        { term: 'manage_data', definition: 'Operación de Stellar que guarda hasta 64 bytes de datos en una cuenta' },
        { term: 'Stellar Expert', definition: 'Explorador de bloques de Stellar donde verificar transacciones: stellar.expert' },
        { term: '2FA', definition: 'Autenticación de 2 factores — capa extra de seguridad con código temporal' },
        { term: 'Phishing', definition: 'Estafa que imita sitios legítimos para robar tus credenciales' },
      ] }),
      videoUrl: '', questionsPool: JSON.stringify(wq3),
    }));

    await chapterModuleRepo.save(chapterModuleRepo.create({
      chapterId: ch3.id, type: 'final_exam', order: 4, title: 'Examen Final: Wallets',
      xpReward: 50, passingScore: 80, questionsPerAttempt: 10, questionsPool: undefined,
    }));

    console.log('✅ Cap 3: Wallets y Seguridad (3 módulos x [info+video+quiz] + examen final)');
  } else {
    console.log(`✅ Chapters already exist (${existingChapters} found). Skipping.`);
  }

  // ── Legacy lessons (backward compat) ─────────────────────────────────────────
  const existingLessons = await lessonRepo.count();
  if (existingLessons === 0) {
    const lesson1 = await lessonRepo.save(lessonRepo.create({
      title: '¿Qué es Blockchain?', description: 'Fundamentos de blockchain.',
      moduleId: MODULE_ID, moduleName: MODULE_NAME, order: 1, type: LessonType.READING,
      xpReward: 50, xlmReward: '0.5', character: 'chima',
      characterDialogue: '¡Hola! Soy Chima. ¡Bienvenido a tu primera lección!',
      content: JSON.stringify({ sections: [{ title: 'Blockchain', text: 'Ver capítulo completo para más info.', icon: '🔗' }] }),
    }));
    await quizRepo.save(quizRepo.create({ lessonId: lesson1.id, questionsPool: JSON.stringify(BLOCKCHAIN_QUESTIONS), questionsPerAttempt: 10, passingScore: 70 }));

    const lesson2 = await lessonRepo.save(lessonRepo.create({
      title: '¿Cómo funciona Stellar?', description: 'Stellar y sus ventajas.',
      moduleId: MODULE_ID, moduleName: MODULE_NAME, order: 2, type: LessonType.READING,
      xpReward: 50, xlmReward: '0.5', character: 'alli',
      characterDialogue: '¡Qué onda! Soy Alli. Stellar es mi favorita.',
      content: JSON.stringify({ sections: [{ title: 'Stellar', text: 'Ver capítulo completo para más info.', icon: '⭐' }] }),
    }));
    await quizRepo.save(quizRepo.create({ lessonId: lesson2.id, questionsPool: JSON.stringify(STELLAR_QUESTIONS), questionsPerAttempt: 10, passingScore: 70 }));

    const lesson3 = await lessonRepo.save(lessonRepo.create({
      title: 'Tu primera wallet', description: 'Cómo funciona tu wallet Stellar.',
      moduleId: MODULE_ID, moduleName: MODULE_NAME, order: 3, type: LessonType.INTERACTIVE,
      xpReward: 50, xlmReward: '0.5', character: 'xollo',
      characterDialogue: '¡Guau! Soy Xollo 🐕 ¡Ya tienes una wallet Stellar!',
      content: JSON.stringify({ sections: [{ title: 'Wallet', text: 'Ver capítulo completo para más info.', icon: '👛' }] }),
    }));
    await quizRepo.save(quizRepo.create({ lessonId: lesson3.id, questionsPool: JSON.stringify(WALLET_QUESTIONS), questionsPerAttempt: 10, passingScore: 70 }));

    console.log('✅ 3 legacy lessons created');
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log('');
  console.log('👤 USUARIOS:');
  console.log('   Admin   → admin@tonalli.mx   / Admin2024!   (role: admin, premium)');
  console.log('   Free    → demo@tonalli.mx    / Demo2024!    (role: user, free)');
  console.log('   Premium → premium@tonalli.mx / Premium2024! (role: user, premium)');
  console.log('');
  console.log('📚 3 Capítulos con 4 módulos cada uno:');
  console.log('   Cap 1: Introducción al Blockchain');
  console.log('   Cap 2: Stellar Network');
  console.log('   Cap 3: Wallets y Seguridad');
  console.log('');
  console.log('🎯 Cada capítulo: Info → Video → Quiz (5 preguntas) → Examen Final (10 preguntas)');
  console.log('❤️ Free: 3 vidas, 24h espera | Premium: ilimitadas');
  console.log('🔀 Preguntas y opciones se mezclan en cada intento');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
