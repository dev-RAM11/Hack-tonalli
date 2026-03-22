import { useT } from '../hooks/useT';

interface Props {
  chapterTitle: string;
  onUpgradePremium: () => void;
  onBuyCertificate: () => void;
  onSkip: () => void;
}

export function ConversionScreen({ chapterTitle, onUpgradePremium, onBuyCertificate, onSkip }: Props) {
  const t = useT();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Celebration */}
        <div className="mb-8">
          <div className="text-7xl mb-4">{'\uD83C\uDF89'}</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t('congratulations')}
          </h1>
          <p className="text-xl text-yellow-400 font-semibold">
            {t('completed75').replace('{title}', chapterTitle)}
          </p>
          <p className="text-gray-400 mt-2">
            {t('chimaProud')}
          </p>
        </div>

        {/* Achievement image placeholder */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 rounded-2xl p-6 mb-8">
          <div className="text-5xl mb-3">{'\uD83C\uDFC5'}</div>
          <h3 className="text-white font-bold text-lg">{t('achievementImage')}</h3>
          <p className="text-gray-400 text-sm mt-1">{chapterTitle}</p>
          <button className="mt-3 text-sm text-yellow-400 hover:text-yellow-300">
            {t('shareOnSocial')}
          </button>
        </div>

        {/* Upgrade options */}
        <div className="space-y-4">
          {/* Option A: Max plan */}
          <button
            onClick={onUpgradePremium}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 font-bold py-4 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-300 transition-all shadow-lg shadow-yellow-500/25"
          >
            <div className="text-lg">👑 Plan Max — $8 USD/mes</div>
            <div className="text-sm font-normal mt-1 opacity-80">
              Todos los capitulos + Certificados gratis + Podio semanal
            </div>
          </button>

          {/* Option B: Pro plan */}
          <button
            onClick={onBuyCertificate}
            className="w-full bg-gray-700 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-600 transition-all border border-gray-600"
          >
            <div className="text-lg">🚀 Plan Pro — $3 USD/mes</div>
            <div className="text-sm font-normal mt-1 text-gray-400">
              Todos los capitulos + Certificaciones por $2 USD cada una
            </div>
          </button>

          {/* Skip */}
          <button
            onClick={onSkip}
            className="w-full text-gray-500 hover:text-gray-400 py-3 text-sm transition"
          >
            {t('continueWithout')}
          </button>
        </div>
      </div>
    </div>
  );
}
