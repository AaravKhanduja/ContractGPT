'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ContractCard from './ContractCard';
import ContractStats from './ContractStats';
import EmptyState from './EmptyState';
import { SavedContract } from './Types';

export default function ContractsClient() {
  const [contracts, setContracts] = useState<SavedContract[]>([]);

  useEffect(() => {
    const loadedContracts: SavedContract[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('contract-') && !key.includes('-prompt')) {
        const contractData = localStorage.getItem(key);
        const promptData = localStorage.getItem(`${key}-prompt`);

        if (contractData) {
          try {
            const contract = JSON.parse(contractData);
            const contractId = key.replace('contract-', '');
            const timestampMatch = contractId.match(/\d+$/);
            const timestamp = timestampMatch ? Number(timestampMatch[0]) : Date.now();

            loadedContracts.push({
              id: contractId,
              title: contract.title,
              type: contract.type,
              content: contract.content,
              prompt: promptData || '',
              createdAt: new Date(timestamp).toLocaleDateString(),
            });
          } catch (error) {
            console.warn(`Invalid JSON for key ${key}, removing`);
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}-prompt`);
          }
        }
      }
    }

    loadedContracts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setContracts(loadedContracts);
  }, []);

  const handleDelete = (contractId: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      localStorage.removeItem(`contract-${contractId}`);
      localStorage.removeItem(`contract-${contractId}-prompt`);
      setContracts(contracts.filter((c) => c.id !== contractId));
    }
  };

  const handleDownload = (contract: SavedContract) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        color: #333;
        background: white;
      ">
        ${contract.content.replace(/\n/g, '<br>')}
      </div>
    `;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${contract.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      document.body.removeChild(tempDiv);
    });
  };

  if (contracts.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onDelete={() => handleDelete(contract.id)}
            onDownload={() => handleDownload(contract)}
          />
        ))}
      </div>
      <ContractStats contracts={contracts} />
    </>
  );
}
