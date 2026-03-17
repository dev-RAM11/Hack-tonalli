export const MODULES = [
  {
    id: "m1",
    title: "Blockchain Fundamentals",
    emoji: "⛓️",
    description: "Learn the basics of blockchain technology",
    totalLessons: 5,
    completedLessons: 3,
    xpReward: 500,
    locked: false,
    color: "#FF6B35",
  },
  {
    id: "m2",
    title: "Stellar Network",
    emoji: "⭐",
    description: "Deep dive into the Stellar ecosystem",
    totalLessons: 6,
    completedLessons: 1,
    xpReward: 600,
    locked: false,
    color: "#FFD700",
  },
  {
    id: "m3",
    title: "DeFi & Smart Contracts",
    emoji: "📜",
    description: "Decentralized finance concepts",
    totalLessons: 8,
    completedLessons: 0,
    xpReward: 800,
    locked: false,
    color: "#00C896",
  },
  {
    id: "m4",
    title: "NFTs & Digital Assets",
    emoji: "🎨",
    description: "Understanding digital ownership",
    totalLessons: 5,
    completedLessons: 0,
    xpReward: 500,
    locked: false,
    color: "#9B59B6",
  },
];

export const LESSONS: Record<string, any[]> = {
  m1: [
    {
      id: "l1",
      moduleId: "m1",
      title: "What is Blockchain?",
      emoji: "🔗",
      xpReward: 100,
      duration: "5 min",
      completed: true,
      locked: false,
      content: [
        {
          type: "text",
          text: "A blockchain is a distributed, decentralized ledger that records transactions across many computers. Think of it as a shared Google Doc that no single person controls.",
        },
        {
          type: "highlight",
          text: "Key Insight: Once data is recorded on a blockchain, it's nearly impossible to change or delete.",
        },
        {
          type: "text",
          text: "Each 'block' contains a set of transactions. When a block is full, it gets chained to the previous block — hence the name 'blockchain'.",
        },
        {
          type: "bullets",
          items: [
            "Decentralized — no single owner",
            "Transparent — anyone can verify",
            "Immutable — data cannot be altered",
            "Secure — cryptographically protected",
          ],
        },
      ],
    },
    {
      id: "l2",
      moduleId: "m1",
      title: "How Transactions Work",
      emoji: "💸",
      xpReward: 100,
      duration: "6 min",
      completed: true,
      locked: false,
      content: [
        {
          type: "text",
          text: "A blockchain transaction is a record of value transfer between two parties. Before it's added to the blockchain, it must be validated by the network.",
        },
        {
          type: "highlight",
          text: "Every transaction is signed with a private key — your digital signature that proves you authorized it.",
        },
        {
          type: "text",
          text: "Validators (or miners in some networks) check the transaction is valid and add it to the next block.",
        },
      ],
    },
    {
      id: "l3",
      moduleId: "m1",
      title: "Consensus Mechanisms",
      emoji: "🤝",
      xpReward: 100,
      duration: "7 min",
      completed: true,
      locked: false,
      content: [
        {
          type: "text",
          text: "A consensus mechanism is the method by which nodes on a blockchain network agree on the current state of the ledger.",
        },
        {
          type: "bullets",
          items: [
            "Proof of Work (PoW) — used by Bitcoin, energy intensive",
            "Proof of Stake (PoS) — validators stake tokens",
            "Stellar Consensus Protocol (SCP) — fast, low-energy",
          ],
        },
      ],
    },
    {
      id: "l4",
      moduleId: "m1",
      title: "Public & Private Keys",
      emoji: "🔑",
      xpReward: 100,
      duration: "5 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Cryptographic key pairs are the foundation of blockchain identity. Your public key is your address, visible to everyone. Your private key is your password — never share it.",
        },
        {
          type: "highlight",
          text: "Warning: If you lose your private key, you lose access to your assets forever. No password reset exists.",
        },
      ],
    },
    {
      id: "l5",
      moduleId: "m1",
      title: "Wallets Explained",
      emoji: "👛",
      xpReward: 100,
      duration: "5 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "A crypto wallet doesn't actually store your crypto — it stores your private keys. The assets live on the blockchain.",
        },
        {
          type: "bullets",
          items: [
            "Hot wallets — connected to internet, convenient",
            "Cold wallets — offline, maximum security",
            "Custodial — third party holds keys",
            "Non-custodial — you hold your own keys",
          ],
        },
      ],
    },
  ],
  m2: [
    {
      id: "l6",
      moduleId: "m2",
      title: "Stellar Overview",
      emoji: "⭐",
      xpReward: 100,
      duration: "6 min",
      completed: true,
      locked: false,
      content: [
        {
          type: "text",
          text: "Stellar is an open-source, decentralized blockchain network focused on enabling fast, low-cost cross-border payments and financial inclusion.",
        },
        {
          type: "highlight",
          text: "Stellar processes transactions in 3-5 seconds with fees of just 0.00001 XLM (fractions of a cent).",
        },
        {
          type: "text",
          text: "Founded in 2014 by Jed McCaleb and Joyce Kim, Stellar's mission is to provide universal access to the global financial system.",
        },
      ],
    },
    {
      id: "l7",
      moduleId: "m2",
      title: "XLM — The Native Token",
      emoji: "💫",
      xpReward: 100,
      duration: "5 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Lumens (XLM) is the native digital currency of the Stellar network. It serves as a bridge currency for cross-asset transactions and pays network fees.",
        },
        {
          type: "bullets",
          items: [
            "Minimum balance: 1 XLM to open an account",
            "Transaction fee: 0.00001 XLM",
            "Total supply: 50 billion XLM",
            "No mining — all XLM was created at genesis",
          ],
        },
      ],
    },
  ],
  m3: [
    {
      id: "l8",
      moduleId: "m3",
      title: "¿Qué es DeFi?",
      emoji: "🏦",
      xpReward: 100,
      duration: "6 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "DeFi (Finanzas Descentralizadas) es un ecosistema de aplicaciones financieras construidas sobre blockchain que operan sin intermediarios como bancos o brokers.",
        },
        {
          type: "highlight",
          text: "DeFi busca recrear servicios financieros tradicionales (préstamos, ahorro, trading) de forma abierta, transparente y accesible para todos.",
        },
        {
          type: "bullets",
          items: [
            "Sin intermediarios — código en lugar de bancos",
            "Accesible — solo necesitas internet y una wallet",
            "Transparente — todo el código es público y auditable",
            "Componible — los protocolos se conectan entre sí como piezas LEGO",
          ],
        },
      ],
    },
    {
      id: "l9",
      moduleId: "m3",
      title: "Smart Contracts",
      emoji: "📜",
      xpReward: 100,
      duration: "7 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Un smart contract (contrato inteligente) es un programa que se ejecuta automáticamente en la blockchain cuando se cumplen condiciones predefinidas.",
        },
        {
          type: "highlight",
          text: "Piensa en un smart contract como una máquina expendedora: insertas dinero, seleccionas el producto, y la máquina lo entrega automáticamente sin necesidad de un vendedor.",
        },
        {
          type: "bullets",
          items: [
            "Autoejecutables — se activan solos al cumplirse las condiciones",
            "Inmutables — una vez desplegados no se pueden modificar",
            "Deterministas — siempre producen el mismo resultado",
            "Soroban — la plataforma de smart contracts de Stellar",
          ],
        },
      ],
    },
    {
      id: "l10",
      moduleId: "m3",
      title: "Liquidity Pools & AMMs",
      emoji: "🌊",
      xpReward: 100,
      duration: "7 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Un pool de liquidez es un fondo de tokens bloqueados en un smart contract que facilita el trading descentralizado. Los AMM (Automated Market Makers) usan estos pools para determinar precios automáticamente.",
        },
        {
          type: "highlight",
          text: "En lugar de un libro de órdenes tradicional, los AMM usan fórmulas matemáticas para calcular precios. Cualquier persona puede ser proveedor de liquidez y ganar comisiones.",
        },
        {
          type: "bullets",
          items: [
            "Proveedores de liquidez ganan fees por cada trade",
            "No necesitas comprador/vendedor directo",
            "Stellar DEX tiene su propio sistema de liquidez nativo",
            "Riesgo: impermanent loss cuando los precios cambian mucho",
          ],
        },
      ],
    },
    {
      id: "l11",
      moduleId: "m3",
      title: "Lending & Borrowing",
      emoji: "💰",
      xpReward: 100,
      duration: "6 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Los protocolos de préstamos DeFi permiten prestar y pedir prestado cripto sin intermediarios. Los prestamistas ganan intereses y los prestatarios deben dejar colateral.",
        },
        {
          type: "highlight",
          text: "A diferencia de un banco, en DeFi los préstamos son sobre-colateralizados: debes depositar más valor del que pides prestado, lo que protege al protocolo.",
        },
        {
          type: "bullets",
          items: [
            "Préstamos sin permisos — cualquiera puede participar",
            "Tasas de interés dinámicas según oferta y demanda",
            "Flash loans — préstamos instantáneos sin colateral (deben devolverse en la misma transacción)",
            "Liquidación automática si el colateral cae de valor",
          ],
        },
      ],
    },
    {
      id: "l12",
      moduleId: "m3",
      title: "Stablecoins",
      emoji: "💵",
      xpReward: 100,
      duration: "5 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Las stablecoins son criptomonedas diseñadas para mantener un valor estable, generalmente vinculado a una moneda fiat como el dólar. Son fundamentales en DeFi.",
        },
        {
          type: "highlight",
          text: "USDC es una stablecoin popular en Stellar que mantiene una paridad 1:1 con el dólar estadounidense, respaldada por reservas reales.",
        },
        {
          type: "bullets",
          items: [
            "Colateralizadas por fiat (USDC, USDT) — respaldadas por dólares reales",
            "Colateralizadas por cripto (DAI) — respaldadas por otras criptos",
            "Algorítmicas — usan algoritmos para mantener el precio",
            "En Stellar: USDC está disponible nativamente en la red",
          ],
        },
      ],
    },
    {
      id: "l13",
      moduleId: "m3",
      title: "Yield Farming & Staking",
      emoji: "🌾",
      xpReward: 100,
      duration: "6 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Yield farming es la práctica de mover tus cripto entre diferentes protocolos DeFi para maximizar rendimientos. Staking es bloquear tokens para ayudar a asegurar la red y ganar recompensas.",
        },
        {
          type: "highlight",
          text: "El yield farming puede ofrecer rendimientos altos, pero también conlleva riesgos como smart contract bugs, impermanent loss y volatilidad del mercado.",
        },
        {
          type: "bullets",
          items: [
            "Staking — bloquear tokens para validar transacciones",
            "Yield farming — buscar los mejores rendimientos entre protocolos",
            "APY vs APR — APY incluye interés compuesto, APR no",
            "DYOR (Do Your Own Research) — siempre investiga antes de invertir",
          ],
        },
      ],
    },
    {
      id: "l14",
      moduleId: "m3",
      title: "Riesgos en DeFi",
      emoji: "⚠️",
      xpReward: 100,
      duration: "6 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "DeFi ofrece grandes oportunidades pero también riesgos importantes. Es crucial entenderlos antes de participar.",
        },
        {
          type: "highlight",
          text: "El mayor riesgo en DeFi es el riesgo de smart contracts: si el código tiene un bug, los fondos pueden perderse permanentemente.",
        },
        {
          type: "bullets",
          items: [
            "Smart contract risk — bugs o vulnerabilidades en el código",
            "Rug pulls — proyectos fraudulentos que roban fondos",
            "Impermanent loss — pérdida temporal al proveer liquidez",
            "Regulación — cambios legales pueden afectar protocolos",
          ],
        },
      ],
    },
    {
      id: "l15",
      moduleId: "m3",
      title: "DeFi en Stellar (Soroban)",
      emoji: "🚀",
      xpReward: 100,
      duration: "7 min",
      completed: false,
      locked: false,
      content: [
        {
          type: "text",
          text: "Soroban es la plataforma de smart contracts de Stellar, diseñada para ser segura, escalable y amigable para desarrolladores. Permite construir aplicaciones DeFi en la red Stellar.",
        },
        {
          type: "highlight",
          text: "Soroban usa Rust como lenguaje de programación, lo que reduce errores comunes y hace los smart contracts más seguros que en otras plataformas.",
        },
        {
          type: "bullets",
          items: [
            "Escrito en Rust — lenguaje seguro y eficiente",
            "Fees ultra bajos — hereda los bajos costos de Stellar",
            "Interoperabilidad — se conecta con el DEX nativo de Stellar",
            "Escalable — diseñado para manejar miles de transacciones por segundo",
          ],
        },
      ],
    },
  ],
};

export const QUIZZES: Record<string, any> = {
  l1: {
    lessonId: "l1",
    questions: [
      {
        id: "q1",
        question: "¿Qué es una blockchain?",
        options: [
          "Una base de datos centralizada de una empresa",
          "Un libro contable distribuido que registra transacciones en muchas computadoras",
          "Un tipo de criptomoneda",
          "Un sistema financiero gubernamental",
        ],
        correctIndex: 1,
        explanation:
          "Una blockchain es un libro contable distribuido y descentralizado que registra transacciones en muchas computadoras sin un solo propietario.",
      },
      {
        id: "q2",
        question: "¿Qué sucede con los datos una vez registrados en una blockchain?",
        options: [
          "Pueden ser editados fácilmente por admins",
          "Expiran después de 30 días",
          "Es casi imposible cambiarlos o eliminarlos",
          "Se eliminan automáticamente después de 1 año",
        ],
        correctIndex: 2,
        explanation:
          "Los datos en blockchain son inmutables — una vez registrados, están criptográficamente asegurados y es casi imposible alterarlos.",
      },
      {
        id: "q3",
        question: "¿Qué contiene cada 'bloque' en una blockchain?",
        options: [
          "Un solo archivo grande",
          "Contraseñas de usuarios",
          "Un conjunto de transacciones",
          "Cookies del navegador",
        ],
        correctIndex: 2,
        explanation:
          "Cada bloque contiene un conjunto de transacciones validadas. Cuando está lleno, se encadena al bloque anterior.",
      },
      {
        id: "q4",
        question: "¿Cuál NO es una característica de blockchain?",
        options: ["Descentralizada", "Transparente", "Propiedad de bancos", "Segura"],
        correctIndex: 2,
        explanation:
          "Blockchain NO es propiedad de bancos — es descentralizada, sin un solo propietario, haciéndola abierta y sin necesidad de confianza.",
      },
    ],
  },
  l2: {
    lessonId: "l2",
    questions: [
      {
        id: "q2_1",
        question: "¿Qué se necesita para autorizar una transacción en blockchain?",
        options: [
          "Una contraseña de correo",
          "Una firma con llave privada",
          "Aprobación de un banco",
          "Un código SMS",
        ],
        correctIndex: 1,
        explanation:
          "Cada transacción se firma con una llave privada — tu firma digital que prueba que tú la autorizaste.",
      },
      {
        id: "q2_2",
        question: "¿Quién valida las transacciones antes de añadirlas a un bloque?",
        options: [
          "Los bancos centrales",
          "Los validadores o mineros de la red",
          "El gobierno",
          "El usuario que envía",
        ],
        correctIndex: 1,
        explanation:
          "Los validadores (o mineros en algunas redes) verifican que la transacción sea válida y la añaden al siguiente bloque.",
      },
      {
        id: "q2_3",
        question: "¿Qué es una transacción en blockchain?",
        options: [
          "Un mensaje de texto",
          "Un registro de transferencia de valor entre dos partes",
          "Una actualización de software",
          "Un archivo compartido",
        ],
        correctIndex: 1,
        explanation:
          "Una transacción blockchain es un registro de transferencia de valor entre dos partes que debe ser validado por la red.",
      },
    ],
  },
  l3: {
    lessonId: "l3",
    questions: [
      {
        id: "q3_1",
        question: "¿Qué es un mecanismo de consenso?",
        options: [
          "Un tipo de criptomoneda",
          "El método por el cual los nodos acuerdan el estado del libro contable",
          "Un contrato legal",
          "Una base de datos centralizada",
        ],
        correctIndex: 1,
        explanation:
          "Un mecanismo de consenso es el método por el cual los nodos de la red acuerdan sobre el estado actual del libro contable.",
      },
      {
        id: "q3_2",
        question: "¿Cuál mecanismo de consenso usa Bitcoin?",
        options: [
          "Proof of Stake (PoS)",
          "Stellar Consensus Protocol (SCP)",
          "Proof of Work (PoW)",
          "Delegated Proof of Stake",
        ],
        correctIndex: 2,
        explanation:
          "Bitcoin usa Proof of Work (PoW), que es intensivo en energía pero fue el primer mecanismo de consenso exitoso.",
      },
      {
        id: "q3_3",
        question: "¿Qué ventaja tiene el Stellar Consensus Protocol?",
        options: [
          "Consume mucha energía",
          "Es rápido y de bajo consumo energético",
          "Solo funciona con Bitcoin",
          "Requiere hardware especializado",
        ],
        correctIndex: 1,
        explanation:
          "El Stellar Consensus Protocol (SCP) es rápido y de bajo consumo energético, a diferencia de PoW.",
      },
    ],
  },
  l4: {
    lessonId: "l4",
    questions: [
      {
        id: "q4_1",
        question: "¿Cuál es la función de la llave pública?",
        options: [
          "Firmar transacciones en secreto",
          "Servir como tu dirección visible para todos",
          "Desbloquear tu teléfono",
          "Acceder a tu correo electrónico",
        ],
        correctIndex: 1,
        explanation:
          "Tu llave pública es tu dirección, visible para todos. Es como tu número de cuenta bancaria.",
      },
      {
        id: "q4_2",
        question: "¿Qué pasa si pierdes tu llave privada?",
        options: [
          "Puedes resetearla con tu email",
          "El banco te da una nueva",
          "Pierdes acceso a tus activos para siempre",
          "Se genera automáticamente otra",
        ],
        correctIndex: 2,
        explanation:
          "Si pierdes tu llave privada, pierdes acceso a tus activos para siempre. No existe opción de reseteo de contraseña.",
      },
      {
        id: "q4_3",
        question: "¿Qué NUNCA debes hacer con tu llave privada?",
        options: [
          "Guardarla en un lugar seguro",
          "Compartirla con alguien",
          "Hacer un respaldo",
          "Memorizarla",
        ],
        correctIndex: 1,
        explanation:
          "Tu llave privada es tu contraseña — NUNCA la compartas con nadie. Quien la tenga, controla tus activos.",
      },
    ],
  },
  l5: {
    lessonId: "l5",
    questions: [
      {
        id: "q5_1",
        question: "¿Qué almacena realmente una wallet crypto?",
        options: [
          "Tus criptomonedas directamente",
          "Tus llaves privadas",
          "Archivos del blockchain",
          "Tu historial de navegación",
        ],
        correctIndex: 1,
        explanation:
          "Una wallet no almacena tus cripto — almacena tus llaves privadas. Los activos viven en la blockchain.",
      },
      {
        id: "q5_2",
        question: "¿Cuál es la diferencia entre hot wallet y cold wallet?",
        options: [
          "El color del diseño",
          "Hot está conectada a internet, cold está offline",
          "Hot es gratis, cold es de pago",
          "No hay diferencia",
        ],
        correctIndex: 1,
        explanation:
          "Hot wallets están conectadas a internet (convenientes), cold wallets están offline (máxima seguridad).",
      },
      {
        id: "q5_3",
        question: "En una wallet non-custodial, ¿quién controla las llaves?",
        options: [
          "La empresa que creó la wallet",
          "El gobierno",
          "Tú mismo",
          "Los mineros",
        ],
        correctIndex: 2,
        explanation:
          "En una wallet non-custodial tú controlas tus propias llaves. En una custodial, un tercero las controla por ti.",
      },
    ],
  },
  l6: {
    lessonId: "l6",
    questions: [
      {
        id: "q6_1",
        question: "¿Qué tan rápido procesa transacciones Stellar?",
        options: ["10 minutos", "1 hora", "3-5 segundos", "24 horas"],
        correctIndex: 2,
        explanation:
          "Stellar es extremadamente rápido, procesando transacciones en solo 3-5 segundos.",
      },
      {
        id: "q6_2",
        question: "¿Cuál es el enfoque principal de Stellar?",
        options: [
          "NFTs para gaming",
          "Pagos transfronterizos rápidos y de bajo costo",
          "Redes sociales descentralizadas",
          "Almacenamiento en la nube",
        ],
        correctIndex: 1,
        explanation:
          "Stellar se enfoca en permitir pagos transfronterizos rápidos, de bajo costo, y la inclusión financiera.",
      },
      {
        id: "q6_3",
        question: "¿En qué año se fundó Stellar?",
        options: ["2009", "2012", "2014", "2020"],
        correctIndex: 2,
        explanation:
          "Stellar fue fundada en 2014 por Jed McCaleb y Joyce Kim.",
      },
    ],
  },
  l7: {
    lessonId: "l7",
    questions: [
      {
        id: "q7_1",
        question: "¿Cuál es el balance mínimo para abrir una cuenta Stellar?",
        options: ["0 XLM", "0.5 XLM", "1 XLM", "10 XLM"],
        correctIndex: 2,
        explanation:
          "Se necesita un mínimo de 1 XLM para abrir una cuenta en la red Stellar.",
      },
      {
        id: "q7_2",
        question: "¿Cuánto cuesta una transacción en Stellar?",
        options: ["1 XLM", "0.01 XLM", "0.00001 XLM", "Es gratis"],
        correctIndex: 2,
        explanation:
          "Las transacciones en Stellar cuestan solo 0.00001 XLM, una fracción de centavo.",
      },
      {
        id: "q7_3",
        question: "¿Cómo se crearon los Lumens (XLM)?",
        options: [
          "Se minan como Bitcoin",
          "Se crearon todos al inicio (génesis)",
          "Se generan diariamente",
          "Los crean los usuarios",
        ],
        correctIndex: 1,
        explanation:
          "No hay minería — todos los 50 billones de XLM fueron creados al inicio (génesis) de la red.",
      },
    ],
  },
  l8: {
    lessonId: "l8",
    questions: [
      {
        id: "q8_1",
        question: "¿Qué significa DeFi?",
        options: [
          "Digital Finance",
          "Finanzas Descentralizadas",
          "Definición Financiera",
          "Deflación Internacional",
        ],
        correctIndex: 1,
        explanation:
          "DeFi significa Finanzas Descentralizadas — un ecosistema de aplicaciones financieras sobre blockchain sin intermediarios.",
      },
      {
        id: "q8_2",
        question: "¿Qué reemplaza a los bancos en DeFi?",
        options: [
          "Gobiernos",
          "Código (smart contracts)",
          "Empresas fintech",
          "Inteligencia artificial",
        ],
        correctIndex: 1,
        explanation:
          "En DeFi, el código (smart contracts) reemplaza a los intermediarios tradicionales como bancos y brokers.",
      },
      {
        id: "q8_3",
        question: "¿Qué necesitas para acceder a DeFi?",
        options: [
          "Una cuenta bancaria y un pasaporte",
          "Solo internet y una wallet",
          "Ser programador",
          "Inversión mínima de $1000",
        ],
        correctIndex: 1,
        explanation:
          "DeFi es accesible para todos — solo necesitas una conexión a internet y una wallet crypto.",
      },
      {
        id: "q8_4",
        question: "¿Qué significa que DeFi sea 'componible'?",
        options: [
          "Que se puede romper fácilmente",
          "Que los protocolos se conectan entre sí como piezas LEGO",
          "Que solo funciona en una blockchain",
          "Que es temporal",
        ],
        correctIndex: 1,
        explanation:
          "La componibilidad significa que los protocolos DeFi pueden conectarse entre sí como piezas LEGO, creando servicios financieros más complejos.",
      },
    ],
  },
  l9: {
    lessonId: "l9",
    questions: [
      {
        id: "q9_1",
        question: "¿Qué es un smart contract?",
        options: [
          "Un contrato legal firmado digitalmente",
          "Un programa que se ejecuta automáticamente en blockchain cuando se cumplen condiciones",
          "Un acuerdo entre dos empresas de tecnología",
          "Una app de celular para contratos",
        ],
        correctIndex: 1,
        explanation:
          "Un smart contract es un programa autoejecutable en blockchain que se activa cuando se cumplen condiciones predefinidas.",
      },
      {
        id: "q9_2",
        question: "¿Cómo se llama la plataforma de smart contracts de Stellar?",
        options: ["Ethereum", "Solana", "Soroban", "Polkadot"],
        correctIndex: 2,
        explanation:
          "Soroban es la plataforma de smart contracts de Stellar, diseñada para seguridad y escalabilidad.",
      },
      {
        id: "q9_3",
        question: "¿Qué característica NO tienen los smart contracts?",
        options: [
          "Son autoejecutables",
          "Son inmutables",
          "Se pueden modificar después de desplegar",
          "Son deterministas",
        ],
        correctIndex: 2,
        explanation:
          "Los smart contracts son inmutables — una vez desplegados NO se pueden modificar, lo que hace crucial auditarlos antes del despliegue.",
      },
    ],
  },
  l10: {
    lessonId: "l10",
    questions: [
      {
        id: "q10_1",
        question: "¿Qué es un pool de liquidez?",
        options: [
          "Una piscina de natación para traders",
          "Un fondo de tokens en un smart contract que facilita el trading",
          "Una cuenta bancaria compartida",
          "Un tipo de criptomoneda",
        ],
        correctIndex: 1,
        explanation:
          "Un pool de liquidez es un fondo de tokens bloqueados en un smart contract que facilita el trading descentralizado.",
      },
      {
        id: "q10_2",
        question: "¿Qué es un AMM?",
        options: [
          "Application Mobile Manager",
          "Automated Market Maker — usa fórmulas para calcular precios",
          "Automated Money Machine",
          "Advanced Mining Method",
        ],
        correctIndex: 1,
        explanation:
          "Un AMM (Automated Market Maker) usa fórmulas matemáticas para determinar precios automáticamente en lugar de un libro de órdenes.",
      },
      {
        id: "q10_3",
        question: "¿Qué es impermanent loss?",
        options: [
          "Perder tu wallet",
          "Una pérdida temporal cuando los precios cambian al proveer liquidez",
          "Un hack al protocolo",
          "Un impuesto sobre ganancias",
        ],
        correctIndex: 1,
        explanation:
          "Impermanent loss es una pérdida temporal que ocurre cuando los precios de los tokens cambian mucho mientras provees liquidez.",
      },
    ],
  },
  l11: {
    lessonId: "l11",
    questions: [
      {
        id: "q11_1",
        question: "¿Qué son los préstamos sobre-colateralizados?",
        options: [
          "Préstamos sin garantía",
          "Préstamos donde depositas más valor del que pides",
          "Préstamos con tasas de interés cero",
          "Préstamos solo para empresas",
        ],
        correctIndex: 1,
        explanation:
          "En DeFi los préstamos son sobre-colateralizados: debes depositar más valor del que pides prestado para proteger al protocolo.",
      },
      {
        id: "q11_2",
        question: "¿Qué es un flash loan?",
        options: [
          "Un préstamo con interés muy alto",
          "Un préstamo a largo plazo",
          "Un préstamo instantáneo sin colateral que debe devolverse en la misma transacción",
          "Un préstamo gubernamental",
        ],
        correctIndex: 2,
        explanation:
          "Los flash loans son préstamos instantáneos sin colateral que deben devolverse en la misma transacción de blockchain.",
      },
      {
        id: "q11_3",
        question: "¿Qué determina las tasas de interés en DeFi?",
        options: [
          "El banco central",
          "La oferta y demanda de los usuarios",
          "El gobierno",
          "Son fijas y nunca cambian",
        ],
        correctIndex: 1,
        explanation:
          "En DeFi, las tasas de interés son dinámicas y se ajustan automáticamente según la oferta y demanda de los usuarios.",
      },
    ],
  },
  l12: {
    lessonId: "l12",
    questions: [
      {
        id: "q12_1",
        question: "¿Qué es una stablecoin?",
        options: [
          "Una cripto que siempre sube de precio",
          "Una cripto diseñada para mantener un valor estable",
          "Una moneda física digital",
          "Un tipo de NFT",
        ],
        correctIndex: 1,
        explanation:
          "Las stablecoins son criptomonedas diseñadas para mantener un valor estable, generalmente vinculado al dólar.",
      },
      {
        id: "q12_2",
        question: "¿Qué stablecoin está disponible nativamente en Stellar?",
        options: ["DAI", "USDT", "USDC", "BUSD"],
        correctIndex: 2,
        explanation:
          "USDC está disponible nativamente en la red Stellar, manteniendo paridad 1:1 con el dólar estadounidense.",
      },
      {
        id: "q12_3",
        question: "¿Cómo mantiene DAI su estabilidad?",
        options: [
          "Respaldada por dólares en un banco",
          "Respaldada por otras criptomonedas como colateral",
          "El gobierno garantiza su valor",
          "No es estable",
        ],
        correctIndex: 1,
        explanation:
          "DAI es una stablecoin colateralizada por cripto — está respaldada por otras criptomonedas depositadas como colateral en smart contracts.",
      },
    ],
  },
  l13: {
    lessonId: "l13",
    questions: [
      {
        id: "q13_1",
        question: "¿Qué es yield farming?",
        options: [
          "Cultivar criptomonedas en una granja",
          "Mover cripto entre protocolos para maximizar rendimientos",
          "Minar Bitcoin",
          "Comprar y vender NFTs",
        ],
        correctIndex: 1,
        explanation:
          "Yield farming es mover tus cripto entre diferentes protocolos DeFi para obtener los mejores rendimientos posibles.",
      },
      {
        id: "q13_2",
        question: "¿Cuál es la diferencia entre APY y APR?",
        options: [
          "Son lo mismo",
          "APY incluye interés compuesto, APR no",
          "APR es siempre mayor que APY",
          "APY es para cripto y APR para fiat",
        ],
        correctIndex: 1,
        explanation:
          "APY (Annual Percentage Yield) incluye interés compuesto, mientras que APR (Annual Percentage Rate) no lo incluye.",
      },
      {
        id: "q13_3",
        question: "¿Qué es staking?",
        options: [
          "Vender tus criptomonedas",
          "Bloquear tokens para ayudar a asegurar la red y ganar recompensas",
          "Pedir un préstamo",
          "Crear un NFT",
        ],
        correctIndex: 1,
        explanation:
          "Staking es bloquear tus tokens para participar en la validación de transacciones y ganar recompensas a cambio.",
      },
    ],
  },
  l14: {
    lessonId: "l14",
    questions: [
      {
        id: "q14_1",
        question: "¿Cuál es el mayor riesgo en DeFi?",
        options: [
          "Que el internet se caiga",
          "Riesgo de smart contracts — bugs que pueden causar pérdida de fondos",
          "Que los bancos cierren",
          "Inflación del dólar",
        ],
        correctIndex: 1,
        explanation:
          "El mayor riesgo en DeFi es el riesgo de smart contracts: si el código tiene un bug, los fondos pueden perderse permanentemente.",
      },
      {
        id: "q14_2",
        question: "¿Qué es un rug pull?",
        options: [
          "Una estrategia de trading legítima",
          "Un proyecto fraudulento que roba los fondos de los usuarios",
          "Un tipo de smart contract",
          "Una forma de staking",
        ],
        correctIndex: 1,
        explanation:
          "Un rug pull es un proyecto fraudulento donde los creadores se llevan los fondos de los usuarios y desaparecen.",
      },
      {
        id: "q14_3",
        question: "¿Qué significa DYOR?",
        options: [
          "Do Your Own Research — investiga antes de invertir",
          "Don't Yield On Returns",
          "Decentralized Yield Over Risk",
          "Digital Yield Operating Rules",
        ],
        correctIndex: 0,
        explanation:
          "DYOR significa 'Do Your Own Research' — siempre investiga y entiende un proyecto antes de invertir tu dinero.",
      },
    ],
  },
  l15: {
    lessonId: "l15",
    questions: [
      {
        id: "q15_1",
        question: "¿Qué lenguaje de programación usa Soroban?",
        options: ["JavaScript", "Python", "Rust", "Solidity"],
        correctIndex: 2,
        explanation:
          "Soroban usa Rust como lenguaje de programación, lo que reduce errores comunes y hace los smart contracts más seguros.",
      },
      {
        id: "q15_2",
        question: "¿Qué ventaja tiene Soroban sobre otras plataformas?",
        options: [
          "Es más caro",
          "Solo funciona con Bitcoin",
          "Fees ultra bajos y se conecta con el DEX nativo de Stellar",
          "Requiere permiso para usarlo",
        ],
        correctIndex: 2,
        explanation:
          "Soroban hereda los bajos costos de Stellar y tiene interoperabilidad con el DEX nativo de la red.",
      },
      {
        id: "q15_3",
        question: "¿Por qué Rust hace los smart contracts más seguros?",
        options: [
          "Porque es más lento",
          "Porque reduce errores comunes de programación",
          "Porque solo lo usan expertos",
          "Porque no permite crear smart contracts complejos",
        ],
        correctIndex: 1,
        explanation:
          "Rust tiene un sistema de tipos estricto y manejo de memoria seguro que previene errores comunes que causan vulnerabilidades en smart contracts.",
      },
    ],
  },
};

export const CERTIFICATES = [
  {
    id: "cert1",
    title: "Blockchain Pioneer",
    emoji: "🏆",
    description: "Completed all Blockchain Fundamentals lessons",
    dateEarned: "2024-01-15",
    xpAwarded: 500,
    xlmAwarded: 5,
    moduleId: "m1",
    nftHash: "GBXXX...1234",
    color: "#FF6B35",
    rarity: "Rare",
  },
  {
    id: "cert2",
    title: "Stellar Explorer",
    emoji: "⭐",
    description: "First lesson on the Stellar Network",
    dateEarned: "2024-01-20",
    xpAwarded: 100,
    xlmAwarded: 1,
    moduleId: "m2",
    nftHash: "GBYYY...5678",
    color: "#FFD700",
    rarity: "Common",
  },
];

export const LEADERBOARD = [
  { rank: 1, name: "María González", xp: 2500, streak: 8, avatar: "👩‍🎓", badge: "🏆" },
  { rank: 2, name: "Carlos Ruiz", xp: 2200, streak: 6, avatar: "👨‍💻", badge: "🥈" },
  { rank: 3, name: "Ana López", xp: 1900, streak: 5, avatar: "👩‍🚀", badge: "🥉" },
  { rank: 4, name: "Diego Martín", xp: 1700, streak: 4, avatar: "🧑‍🎨", badge: "" },
  { rank: 5, name: "Sofía Herrera", xp: 1500, streak: 3, avatar: "👩‍🔬", badge: "" },
  { rank: 6, name: "Luis Torres", xp: 1300, streak: 3, avatar: "🧑‍💼", badge: "" },
  { rank: 7, name: "Valentina Cruz", xp: 1100, streak: 2, avatar: "👩‍🎤", badge: "" },
  { rank: 8, name: "Tú", xp: 0, streak: 0, avatar: "😎", badge: "", isCurrentUser: true },
  { rank: 9, name: "Pablo Jiménez", xp: 1050, streak: 1, avatar: "🧑‍🍳", badge: "" },
  { rank: 10, name: "Isabella Moreno", xp: 1000, streak: 1, avatar: "👩‍🏫", badge: "" },
];
