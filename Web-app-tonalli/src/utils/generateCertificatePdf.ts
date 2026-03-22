import { jsPDF } from 'jspdf';
import type { ActaCertificateData } from '../types';

export function generateCertificatePdf(cert: ActaCertificateData, username: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // ── Background ──────────────────────────────────────────────────────────
  doc.setFillColor(26, 26, 46); // #1A1A2E
  doc.rect(0, 0, w, h, 'F');

  // Border frame
  doc.setDrawColor(245, 197, 24); // gold
  doc.setLineWidth(1.5);
  doc.roundedRect(10, 10, w - 20, h - 20, 4, 4, 'S');

  // Inner border
  doc.setDrawColor(46, 139, 63); // green
  doc.setLineWidth(0.5);
  doc.roundedRect(14, 14, w - 28, h - 28, 3, 3, 'S');

  // ── Corner decorations ──────────────────────────────────────────────────
  const cornerSize = 15;
  doc.setDrawColor(245, 197, 24);
  doc.setLineWidth(0.8);
  // Top-left
  doc.line(18, 22, 18 + cornerSize, 22);
  doc.line(18, 22, 18, 22 + cornerSize);
  // Top-right
  doc.line(w - 18, 22, w - 18 - cornerSize, 22);
  doc.line(w - 18, 22, w - 18, 22 + cornerSize);
  // Bottom-left
  doc.line(18, h - 22, 18 + cornerSize, h - 22);
  doc.line(18, h - 22, 18, h - 22 - cornerSize);
  // Bottom-right
  doc.line(w - 18, h - 22, w - 18 - cornerSize, h - 22);
  doc.line(w - 18, h - 22, w - 18, h - 22 - cornerSize);

  // ── Header: Tonalli logo text ───────────────────────────────────────────
  let y = 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(245, 197, 24); // gold
  doc.text('TONALLI', w / 2, y, { align: 'center' });

  // ── Subtitle ────────────────────────────────────────────────────────────
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(155, 89, 182); // purple
  doc.text('Plataforma de Educacion Financiera Web3 en Stellar', w / 2, y, { align: 'center' });

  // ── Divider ─────────────────────────────────────────────────────────────
  y += 8;
  doc.setDrawColor(245, 197, 24);
  doc.setLineWidth(0.3);
  doc.line(w / 2 - 60, y, w / 2 + 60, y);

  // ── Certificate title ───────────────────────────────────────────────────
  y += 14;
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  const titleText = cert.type === 'official'
    ? 'CERTIFICADO OFICIAL'
    : 'CERTIFICADO DE LOGRO';
  doc.text(titleText, w / 2, y, { align: 'center' });

  // ── ACTA badge ──────────────────────────────────────────────────────────
  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(0, 200, 150); // teal
  doc.text('Credencial Verificable ACTA - Respaldado en Blockchain Stellar', w / 2, y, { align: 'center' });

  // ── Awarded to ──────────────────────────────────────────────────────────
  y += 16;
  doc.setFontSize(11);
  doc.setTextColor(180, 180, 180);
  doc.text('Otorgado a:', w / 2, y, { align: 'center' });

  y += 12;
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(username.toUpperCase(), w / 2, y, { align: 'center' });

  // ── Underline name ──────────────────────────────────────────────────────
  y += 3;
  doc.setDrawColor(46, 139, 63);
  doc.setLineWidth(0.4);
  const nameWidth = doc.getTextWidth(username.toUpperCase());
  doc.line(w / 2 - nameWidth / 2, y, w / 2 + nameWidth / 2, y);

  // ── Chapter completed ───────────────────────────────────────────────────
  y += 14;
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text('Por completar exitosamente:', w / 2, y, { align: 'center' });

  y += 10;
  doc.setFontSize(16);
  doc.setTextColor(245, 197, 24);
  doc.setFont('helvetica', 'bold');
  doc.text(cert.chapterTitle, w / 2, y, { align: 'center' });

  // ── Score ───────────────────────────────────────────────────────────────
  y += 12;
  doc.setFontSize(12);
  doc.setTextColor(0, 200, 150);
  doc.text(`Calificacion: ${cert.examScore}%`, w / 2, y, { align: 'center' });

  // ── Bottom info boxes ───────────────────────────────────────────────────
  y = h - 48;
  const boxW = 70;
  const boxH = 22;
  const gap = 10;
  const startX = (w - (boxW * 3 + gap * 2)) / 2;

  // Box 1: VC ID
  doc.setFillColor(35, 35, 60);
  doc.roundedRect(startX, y, boxW, boxH, 2, 2, 'F');
  doc.setFontSize(6);
  doc.setTextColor(155, 89, 182);
  doc.text('ACTA VC ID', startX + boxW / 2, y + 6, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(200, 200, 200);
  const vcText = cert.actaVcId || 'N/A';
  doc.text(vcText.length > 35 ? vcText.slice(0, 35) + '...' : vcText, startX + boxW / 2, y + 13, { align: 'center' });

  // Box 2: TX Hash
  doc.setFillColor(35, 35, 60);
  doc.roundedRect(startX + boxW + gap, y, boxW, boxH, 2, 2, 'F');
  doc.setFontSize(6);
  doc.setTextColor(155, 89, 182);
  doc.text('STELLAR TX HASH', startX + boxW + gap + boxW / 2, y + 6, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(200, 200, 200);
  const txText = cert.txHash || 'N/A';
  doc.text(txText.length > 35 ? txText.slice(0, 35) + '...' : txText, startX + boxW + gap + boxW / 2, y + 13, { align: 'center' });

  // Box 3: Date
  doc.setFillColor(35, 35, 60);
  doc.roundedRect(startX + (boxW + gap) * 2, y, boxW, boxH, 2, 2, 'F');
  doc.setFontSize(6);
  doc.setTextColor(155, 89, 182);
  doc.text('FECHA DE EMISION', startX + (boxW + gap) * 2 + boxW / 2, y + 6, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  const dateStr = new Date(cert.issuedAt).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.text(dateStr, startX + (boxW + gap) * 2 + boxW / 2, y + 14, { align: 'center' });

  // ── Footer ──────────────────────────────────────────────────────────────
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 120);
  doc.text(
    'Este certificado es verificable en blockchain. Valida en: stellar.expert | acta.build',
    w / 2, h - 18, { align: 'center' },
  );

  // ── Save ────────────────────────────────────────────────────────────────
  const filename = `Tonalli_Certificado_${cert.chapterTitle.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
