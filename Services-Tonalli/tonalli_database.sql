-- =============================================
-- TONALLI - Script de creacion de Base de Datos
-- MySQL Workbench
-- =============================================

-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS tonalli
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tonalli;

-- =============================================
-- 2. Tabla: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  displayName VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  stellarPublicKey VARCHAR(255) NULL,
  stellarSecretKey VARCHAR(255) NULL,
  xp INT NOT NULL DEFAULT 0,
  totalXp INT NOT NULL DEFAULT 0,
  currentStreak INT NOT NULL DEFAULT 0,
  lastActivityDate VARCHAR(255) NULL,
  isFunded TINYINT(1) NOT NULL DEFAULT 0,
  `character` VARCHAR(255) NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE INDEX IDX_users_email (email),
  UNIQUE INDEX IDX_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. Tabla: streaks
-- =============================================
CREATE TABLE IF NOT EXISTS streaks (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  currentStreak INT NOT NULL DEFAULT 0,
  longestStreak INT NOT NULL DEFAULT 0,
  lastDate VARCHAR(255) NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX IDX_streaks_userId (userId),
  CONSTRAINT FK_streaks_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. Tabla: lessons
-- =============================================
CREATE TABLE IF NOT EXISTS lessons (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255) NULL,
  moduleId VARCHAR(255) NOT NULL,
  moduleName VARCHAR(255) NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  type VARCHAR(50) NOT NULL DEFAULT 'reading',
  content LONGTEXT NULL,
  xpReward INT NOT NULL DEFAULT 50,
  xlmReward VARCHAR(20) NOT NULL DEFAULT '0.5',
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  `character` VARCHAR(255) NULL,
  characterDialogue VARCHAR(255) NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX IDX_lessons_moduleId (moduleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 5. Tabla: quizzes
-- =============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  lessonId CHAR(36) NOT NULL,
  questionsPool TEXT NOT NULL,
  questionsPerAttempt INT NOT NULL DEFAULT 10,
  passingScore INT NOT NULL DEFAULT 70,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX IDX_quizzes_lessonId (lessonId),
  CONSTRAINT FK_quizzes_lesson
    FOREIGN KEY (lessonId) REFERENCES lessons(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 6. Tabla: progress
-- =============================================
CREATE TABLE IF NOT EXISTS progress (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  lessonId CHAR(36) NOT NULL,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  score INT NOT NULL DEFAULT 0,
  attempts INT NOT NULL DEFAULT 0,
  xpEarned INT NOT NULL DEFAULT 0,
  completedAt DATETIME NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX IDX_progress_userId (userId),
  INDEX IDX_progress_lessonId (lessonId),
  UNIQUE INDEX IDX_progress_user_lesson (userId, lessonId),
  CONSTRAINT FK_progress_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT FK_progress_lesson
    FOREIGN KEY (lessonId) REFERENCES lessons(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 7. Tabla: nft_certificates
-- =============================================
CREATE TABLE IF NOT EXISTS nft_certificates (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  userId CHAR(36) NOT NULL,
  lessonId CHAR(36) NOT NULL,
  txHash VARCHAR(255) NULL,
  ipfsHash VARCHAR(255) NULL,
  assetCode VARCHAR(255) NULL,
  issuerPublicKey VARCHAR(255) NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  issuedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  INDEX IDX_nft_userId (userId),
  INDEX IDX_nft_lessonId (lessonId),
  CONSTRAINT FK_nft_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT FK_nft_lesson
    FOREIGN KEY (lessonId) REFERENCES lessons(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 8. Datos iniciales: Modulos y Lecciones
-- =============================================

-- Modulo 1: Introduccion a Blockchain
INSERT INTO lessons (id, title, description, moduleId, moduleName, `order`, type, xpReward, xlmReward, `character`, characterDialogue, content) VALUES
(UUID(), 'Que es Blockchain?', 'Descubre la tecnologia que esta cambiando el mundo', 'mod-1', 'Introduccion a Blockchain', 1, 'reading', 50, '0.5', 'chima', 'Hola! Soy Chima y te voy a explicar que es blockchain de una forma muy sencilla.',
'[{"type":"text","content":"Imagina un cuaderno compartido donde todos pueden ver lo que se escribe, pero nadie puede borrar nada. Eso es blockchain: un registro digital distribuido, transparente e inmutable."},{"type":"highlight","content":"Blockchain = cadena de bloques. Cada bloque contiene transacciones verificadas que se enlazan al anterior."},{"type":"bullets","items":["Descentralizado: no hay un jefe o banco que lo controle","Transparente: cualquier persona puede verificar las transacciones","Inmutable: una vez escrito, no se puede modificar","Seguro: protegido por criptografia avanzada"]}]'),

(UUID(), 'Historia del dinero digital', 'Del trueque a Bitcoin y mas alla', 'mod-1', 'Introduccion a Blockchain', 2, 'reading', 50, '0.5', 'chima', 'Vamos a viajar en el tiempo para entender como llegamos hasta aqui.',
'[{"type":"text","content":"Antes de las criptomonedas, el dinero evoluciono del trueque a las monedas de oro, al papel moneda y finalmente al dinero digital. En 2008, Satoshi Nakamoto publico el whitepaper de Bitcoin, proponiendo un sistema de efectivo electronico peer-to-peer."},{"type":"highlight","content":"Bitcoin fue la primera criptomoneda, pero hoy existen miles de proyectos blockchain con diferentes propositos."},{"type":"bullets","items":["2008: Se publica el whitepaper de Bitcoin","2009: Se mina el primer bloque (Genesis Block)","2015: Nace Ethereum con smart contracts","2014: Stellar es fundada para pagos accesibles"]}]'),

(UUID(), 'Tipos de blockchain', 'Publica, privada y consorcio', 'mod-1', 'Introduccion a Blockchain', 3, 'reading', 75, '0.75', 'chima', 'No todas las blockchains son iguales. Vamos a ver las diferencias.',
'[{"type":"text","content":"Existen diferentes tipos de blockchain segun quien puede participar y quien valida las transacciones."},{"type":"bullets","items":["Publica: cualquiera puede participar (Bitcoin, Stellar, Ethereum)","Privada: solo miembros autorizados (Hyperledger)","Consorcio: un grupo de organizaciones la gestiona","Hibrida: combina elementos publicos y privados"]},{"type":"highlight","content":"Stellar es una blockchain publica disenada especificamente para facilitar pagos rapidos y de bajo costo en mercados emergentes."}]');

-- Modulo 2: Stellar Network
INSERT INTO lessons (id, title, description, moduleId, moduleName, `order`, type, xpReward, xlmReward, `character`, characterDialogue, content) VALUES
(UUID(), 'Que es Stellar?', 'La red disenada para la inclusion financiera', 'mod-2', 'Stellar Network', 1, 'reading', 50, '0.5', 'chima', 'Ahora vamos a conocer Stellar, la red donde vive Tonalli!',
'[{"type":"text","content":"Stellar es una red blockchain open-source fundada en 2014 por Jed McCaleb. Su mision es conectar a las personas con servicios financieros de bajo costo, especialmente en mercados emergentes como Mexico y America Latina."},{"type":"highlight","content":"Las transacciones en Stellar cuestan menos de $0.001 USD y se confirman en 3-5 segundos."},{"type":"bullets","items":["Fundada en 2014 por Jed McCaleb","Transacciones ultra baratas (< $0.001 USD)","Confirmacion en 3-5 segundos","Disenada para pagos y remesas","Soporte nativo para tokens y activos digitales"]}]'),

(UUID(), 'XLM: Lumens de Stellar', 'La criptomoneda nativa de la red', 'mod-2', 'Stellar Network', 2, 'reading', 50, '0.5', 'alli', 'Yo te explico todo sobre XLM. Es lo que vas a ganar aqui en Tonalli!',
'[{"type":"text","content":"XLM (Lumens) es la criptomoneda nativa de Stellar. Se usa para pagar las pequenas comisiones de transaccion y como moneda puente entre diferentes activos en la red."},{"type":"highlight","content":"En Tonalli ganas XLM real cada vez que completas una leccion y apruebas el quiz."},{"type":"bullets","items":["XLM es el token nativo de Stellar","Se usa para pagar fees de transaccion","Sirve como puente entre diferentes monedas","Precio accesible: ideal para microrecompensas","Disponible en exchanges como Bitso en Mexico"]}]'),

(UUID(), 'Soroban: Smart Contracts en Stellar', 'La nueva era de contratos inteligentes', 'mod-2', 'Stellar Network', 3, 'reading', 100, '1.0', 'alli', 'Soroban es lo mas nuevo de Stellar. Contratos inteligentes al alcance de todos!',
'[{"type":"text","content":"Soroban es la plataforma de smart contracts de Stellar, lanzada para permitir crear aplicaciones descentralizadas (dApps) sobre la red. Los contratos se escriben en Rust y se ejecutan en una maquina virtual segura."},{"type":"highlight","content":"Tonalli usa Soroban para distribuir recompensas XLM y emitir certificados NFT de forma transparente y verificable."},{"type":"bullets","items":["Contratos inteligentes escritos en Rust","Ejecucion segura y predecible","Costos de gas extremadamente bajos","Interoperabilidad con el ecosistema Stellar","Usado en Tonalli para learn-to-earn y NFTs"]}]');

-- Modulo 3: Wallets y Seguridad
INSERT INTO lessons (id, title, description, moduleId, moduleName, `order`, type, xpReward, xlmReward, `character`, characterDialogue, content) VALUES
(UUID(), 'Tu primera wallet', 'Como crear y proteger tu billetera digital', 'mod-3', 'Wallets y Seguridad', 1, 'reading', 50, '0.5', 'xollo', 'Yo cuido tu racha pero tu debes cuidar tu wallet. Te enseno como!',
'[{"type":"text","content":"Una wallet (billetera digital) es tu puerta de entrada al mundo blockchain. No guarda dinero fisicamente, sino las llaves criptograficas que te dan acceso a tus activos en la blockchain."},{"type":"highlight","content":"En Tonalli se crea automaticamente una wallet de Stellar cuando te registras. Tus XLM ganados se depositan ahi."},{"type":"bullets","items":["Llave publica: como tu numero de cuenta (puedes compartirla)","Llave privada: como tu contrasena (NUNCA la compartas)","Seed phrase: 12-24 palabras para recuperar tu wallet","Hot wallet: conectada a internet (conveniente)","Cold wallet: sin conexion (mas segura)"]}]'),

(UUID(), 'Seguridad en blockchain', 'Protege tus activos digitales', 'mod-3', 'Wallets y Seguridad', 2, 'reading', 75, '0.75', 'xollo', 'Este tema es muy importante. La seguridad es lo primero!',
'[{"type":"text","content":"En el mundo blockchain, tu eres tu propio banco. Eso significa que la seguridad de tus activos depende directamente de ti. No hay un numero 800 para llamar si pierdes tus llaves."},{"type":"highlight","content":"Regla de oro: NUNCA compartas tu llave privada o seed phrase con nadie. Ningun servicio legitimo te la pedira."},{"type":"bullets","items":["Usa contrasenas unicas y fuertes","Activa autenticacion de dos factores (2FA)","Guarda tu seed phrase en papel, no digital","Desconfia de mensajes que pidan tus llaves","Verifica siempre las URLs antes de conectar tu wallet","Empieza con cantidades pequenas para practicar"]}]');

-- =============================================
-- 9. Datos iniciales: Quizzes
-- =============================================

-- Quiz para "Que es Blockchain?"
INSERT INTO quizzes (id, lessonId, questionsPool, questionsPerAttempt, passingScore)
SELECT UUID(), l.id,
'[{"question":"Que es blockchain?","options":["Una base de datos centralizada","Un registro digital distribuido e inmutable","Un tipo de criptomoneda","Una aplicacion movil"],"correctIndex":1},{"question":"Cual de estas NO es una caracteristica de blockchain?","options":["Descentralizado","Transparente","Editable por cualquiera","Inmutable"],"correctIndex":2},{"question":"Que protege la seguridad de blockchain?","options":["Un banco central","Criptografia avanzada","El gobierno","Una empresa privada"],"correctIndex":1},{"question":"Que significa que blockchain sea inmutable?","options":["Que es muy rapido","Que no se puede modificar lo escrito","Que es gratis","Que solo funciona en internet"],"correctIndex":1},{"question":"Blockchain es como...","options":["Un cuaderno compartido que nadie puede borrar","Una cuenta bancaria normal","Un archivo de Excel","Una red social"],"correctIndex":0}]',
5, 70
FROM lessons l WHERE l.title = 'Que es Blockchain?' LIMIT 1;

-- Quiz para "Que es Stellar?"
INSERT INTO quizzes (id, lessonId, questionsPool, questionsPerAttempt, passingScore)
SELECT UUID(), l.id,
'[{"question":"Quien fundo Stellar?","options":["Vitalik Buterin","Satoshi Nakamoto","Jed McCaleb","Elon Musk"],"correctIndex":2},{"question":"Cuanto cuesta una transaccion en Stellar?","options":["$10 USD","$1 USD","$0.10 USD","Menos de $0.001 USD"],"correctIndex":3},{"question":"En cuanto tiempo se confirma una transaccion en Stellar?","options":["1 hora","30 minutos","3-5 segundos","1 dia"],"correctIndex":2},{"question":"Para que fue disenada Stellar?","options":["Mineria de criptomonedas","Pagos rapidos y de bajo costo","Videojuegos","Redes sociales"],"correctIndex":1},{"question":"En que anio se fundo Stellar?","options":["2008","2014","2020","2017"],"correctIndex":1}]',
5, 70
FROM lessons l WHERE l.title = 'Que es Stellar?' LIMIT 1;

-- Quiz para "XLM: Lumens de Stellar"
INSERT INTO quizzes (id, lessonId, questionsPool, questionsPerAttempt, passingScore)
SELECT UUID(), l.id,
'[{"question":"Que es XLM?","options":["Un exchange","La criptomoneda nativa de Stellar","Una wallet","Un smart contract"],"correctIndex":1},{"question":"Para que se usa XLM en la red Stellar?","options":["Solo para especular","Para pagar comisiones de transaccion","Para minar bloques","No tiene uso"],"correctIndex":1},{"question":"Donde puedes comprar XLM en Mexico?","options":["En la tienda de la esquina","En Bitso","En Amazon","En la CONDUSEF"],"correctIndex":1},{"question":"Que ganas en Tonalli al completar lecciones?","options":["Bitcoin","Ethereum","XLM real","Puntos sin valor"],"correctIndex":2},{"question":"XLM funciona como puente entre...","options":["Paises","Diferentes activos en la red","Computadoras","Personas"],"correctIndex":1}]',
5, 70
FROM lessons l WHERE l.title = 'XLM: Lumens de Stellar' LIMIT 1;

-- Quiz para "Tu primera wallet"
INSERT INTO quizzes (id, lessonId, questionsPool, questionsPerAttempt, passingScore)
SELECT UUID(), l.id,
'[{"question":"Que guarda realmente una wallet?","options":["Dinero fisico","Llaves criptograficas","Archivos PDF","Fotos"],"correctIndex":1},{"question":"Que es la llave publica?","options":["Tu contrasena secreta","Como tu numero de cuenta","Tu seed phrase","Un tipo de criptomoneda"],"correctIndex":1},{"question":"Que NUNCA debes compartir?","options":["Tu llave publica","Tu nombre de usuario","Tu llave privada","Tu email"],"correctIndex":2},{"question":"Que es una seed phrase?","options":["Una contrasena normal","12-24 palabras para recuperar tu wallet","Un tipo de criptomoneda","El nombre de tu wallet"],"correctIndex":1},{"question":"Que tipo de wallet esta conectada a internet?","options":["Cold wallet","Hot wallet","Paper wallet","Hardware wallet"],"correctIndex":1}]',
5, 70
FROM lessons l WHERE l.title = 'Tu primera wallet' LIMIT 1;

-- =============================================
-- 10. Verificacion
-- =============================================
SELECT 'Base de datos creada exitosamente!' AS status;
SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'tonalli';
