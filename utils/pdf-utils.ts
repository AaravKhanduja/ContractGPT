import jsPDF from 'jspdf';

interface ContractData {
  title: string;
  type: string;
  content: string;
  prompt?: string;
}

export const generateContractPDF = (contract: ContractData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 20;
  const contentWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  let yPosition = margin;

  const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');

    const lines = pdf.splitTextToSize(text, contentWidth);
    if (yPosition + lines.length * 6 > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 6 + 2;
  };

  const addHeading = (text: string, fontSize: number = 16) => {
    addText(text, fontSize, true);
    yPosition += 4;
  };

  const addListItem = (text: string) => {
    const cleanText = text.replace(/\*\*([^*]+)\*\*/g, '$1');
    addText(`• ${cleanText}`);
  };

  // Title
  addHeading(contract.title, 18);

  // Process content
  const lines = contract.content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) {
      addHeading(trimmed.substring(2));
    } else if (trimmed.startsWith('## ')) {
      addHeading(trimmed.substring(3), 14);
    } else if (trimmed.startsWith('### ')) {
      addHeading(trimmed.substring(4), 12);
    } else if (trimmed.startsWith('- ')) {
      addListItem(trimmed.substring(2));
    } else if (trimmed.includes('**')) {
      const cleanLine = trimmed.replace(/\*\*([^*]+)\*\*/g, '$1');
      addText(cleanLine, 11, true);
    } else {
      addText(trimmed);
    }
  }

  // Signatures
  yPosition += 10;
  addHeading('Signatures', 14);

  ['Client Signature:', 'Service Provider Signature:', 'Date:'].forEach((label) => {
    addText(label, 11, true);
    yPosition += 15;
    pdf.line(margin, yPosition, margin + 60, yPosition);
    yPosition += 8;
  });

  pdf.save(`${contract.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_contract.pdf`);
};
