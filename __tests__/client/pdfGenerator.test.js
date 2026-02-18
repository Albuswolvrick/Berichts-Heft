import jsPDF from 'jspdf';
import { downloadReportPdf } from '../../src/client/utils/pdfGenerator';

vi.mock('jspdf', () => {
  const JsPdfMock = vi.fn(function JsPdfMock() {
    return {
      internal: {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297,
        },
      },
      setFillColor: vi.fn(),
      rect: vi.fn(),
      setTextColor: vi.fn(),
      setFont: vi.fn(),
      setFontSize: vi.fn(),
      text: vi.fn(),
      line: vi.fn(),
      setDrawColor: vi.fn(),
      splitTextToSize: vi.fn((value) => [String(value)]),
      getNumberOfPages: vi.fn(() => 1),
      setPage: vi.fn(),
      addPage: vi.fn(),
      save: vi.fn(),
    };
  });

  return {
    default: JsPdfMock,
  };
});

describe('pdfGenerator', () => {
  it('creates and saves a report PDF', () => {
    downloadReportPdf({
      title: 'Test Report',
      fileName: 'test-report.pdf',
      metadata: [{ label: 'Field', value: 'Value' }],
      sections: [{ label: 'Section', value: 'Content' }],
    });

    expect(jsPDF).toHaveBeenCalledTimes(1);
    const instance = jsPDF.mock.results[0].value;
    expect(instance.save).toHaveBeenCalledWith('test-report.pdf');
  });
});
