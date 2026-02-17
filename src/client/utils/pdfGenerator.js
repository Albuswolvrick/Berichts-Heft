import jsPDF from 'jspdf';

function asText(value) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

export function downloadReportPdf({ title, fileName, metadata, sections }) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 10;

  // =========== HEADER ===========
  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, pageWidth, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Wochenbericht', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleDateString('de-DE');
  doc.text(`Erstellt: ${dateStr}`, pageWidth - margin, 18, { align: 'right' });

  y = 40;

  // =========== METADATEN TABELLE (Manuelle Implementierung) ===========
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Allgemeine Informationen', margin, y);
  y += 8;

  // Tabelle Header
  const col1Width = 50;
  const col2Width = pageWidth - margin * 2 - col1Width;
  const rowHeight = 8;

  // Header Row
  doc.setFillColor(30, 58, 95);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.fontSize = 11;
  doc.rect(margin, y, col1Width, rowHeight, 'F');
  doc.rect(margin + col1Width, y, col2Width, rowHeight, 'F');
  doc.text('Feld', margin + 2, y + 5);
  doc.text('Wert', margin + col1Width + 2, y + 5);

  y += rowHeight;

  // Body Rows
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  metadata.forEach((item, index) => {
    // Alternating background colors
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(margin, y, col1Width, rowHeight, 'F');
    doc.rect(margin + col1Width, y, col2Width, rowHeight, 'F');

    // Borders
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, col1Width, rowHeight);
    doc.rect(margin + col1Width, y, col2Width, rowHeight);

    // Text
    doc.setTextColor(20, 20, 20);
    doc.text(item.label, margin + 2, y + 5);

    // Wrap value text if needed
    const valueLines = doc.splitTextToSize(asText(item.value), col2Width - 4);
    doc.text(valueLines[0] || '-', margin + col1Width + 2, y + 5);

    y += rowHeight;

    // Neue Seite falls nötig
    if (y > pageHeight - 60) {
      doc.addPage();
      y = 20;
    }
  });

  y += 12;

  // =========== CONTENT SECTIONS ===========
  sections.forEach((section) => {
    // Neuer Abschnitt
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);

    // Label
    doc.text(section.label, margin, y);
    y += 7;

    // Text Box mit Hintergrund
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);

    const textLines = doc.splitTextToSize(asText(section.value), pageWidth - margin * 2 - 8);
    const boxHeight = textLines.length * 5 + 8;

    doc.rect(margin, y - 2, pageWidth - margin * 2, boxHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);

    textLines.forEach((line, index) => {
      doc.text(line, margin + 2, y + 6 + index * 5);
    });

    y += boxHeight + 8;

    // Neue Seite falls nötig
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }
  });

  // =========== FOOTER ===========
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(`Seite ${i} von ${totalPages}`, pageWidth - margin, pageHeight - 10, {
      align: 'right',
    });
  }

  doc.save(fileName);
}
