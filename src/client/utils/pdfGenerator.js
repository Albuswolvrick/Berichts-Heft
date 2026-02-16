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
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const ensureSpace = (requiredHeight = 8) => {
    if (y + requiredHeight > pageHeight - 20) {
      doc.addPage();
      y = 18;
    }
  };

  const writeValue = (label, value) => {
    ensureSpace(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${label}:`, margin, y);

    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(asText(value), contentWidth - 38);
    doc.text(wrapped, margin + 38, y);
    y += Math.max(7, wrapped.length * 5.2);
  };

  doc.setFillColor(30, 58, 95);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, margin, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Created: ${new Date().toLocaleString()}`, margin, 22);

  y = 36;
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Report Details', margin, y);
  y += 7;
  doc.setDrawColor(180, 180, 180);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  metadata.forEach((item) => writeValue(item.label, item.value));

  y += 2;
  sections.forEach((section) => {
    ensureSpace(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(section.label, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const wrappedText = doc.splitTextToSize(asText(section.value), contentWidth);
    wrappedText.forEach((line) => {
      ensureSpace(6);
      doc.text(line, margin, y);
      y += 5.5;
    });
    y += 4;
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i += 1) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(110, 110, 110);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
      align: 'right',
    });
  }

  doc.save(fileName);
}
