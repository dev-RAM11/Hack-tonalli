import type { ActaCertificateData } from '../types';
import { generateCertificatePdf } from '../utils/generateCertificatePdf';
import { useAuthStore } from '../stores/authStore';

interface Props {
  cert: ActaCertificateData;
}

export function CertificateCard({ cert }: Props) {
  const { user } = useAuthStore();

  const handleDownloadPdf = () => {
    generateCertificatePdf(cert, user?.username || 'Estudiante');
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className={`p-4 ${cert.type === 'official' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20' : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'}`}>
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {cert.type === 'official' ? '\uD83C\uDFC6' : '\uD83C\uDFC5'}
          </div>
          <div>
            <h3 className="text-white font-bold">{cert.chapterTitle}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              cert.type === 'official'
                ? 'bg-yellow-500/30 text-yellow-400'
                : 'bg-blue-500/30 text-blue-400'
            }`}>
              {cert.type === 'official' ? 'Certificado Oficial ACTA' : 'Imagen de Logro'}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Calificacion</span>
          <span className="text-green-400 font-bold">{cert.examScore}%</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Estado</span>
          <span className={`font-bold ${cert.status === 'issued' ? 'text-green-400' : cert.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
            {cert.status === 'issued' ? 'Emitido' : cert.status === 'pending' ? 'Pendiente' : 'Error'}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Fecha</span>
          <span className="text-gray-300">{new Date(cert.issuedAt).toLocaleDateString('es-MX')}</span>
        </div>

        {cert.actaVcId && (
          <div className="text-xs">
            <span className="text-gray-500">VC ID: </span>
            <span className="text-gray-400 font-mono break-all">{cert.actaVcId}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {cert.stellarExplorerUrl && (
            <a
              href={cert.stellarExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-gray-700 text-gray-300 text-sm py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Ver en Stellar
            </a>
          )}
          <button
            onClick={handleDownloadPdf}
            className="flex-1 text-center text-sm py-2 rounded-lg transition"
            style={{
              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
