'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Edit, Save, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/components/navigation';

interface ContractData {
  title: string;
  type: string;
  content: string;
}

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<ContractData | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const contractId = params.id as string;
    const storedPrompt = localStorage.getItem(`contract-${contractId}-prompt`);

    if (!storedPrompt) return;

    setOriginalPrompt(storedPrompt);

    // Call the OpenAI-backed API
    const fetchContract = async () => {
      try {
        const res = await fetch('/api/generate-contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: storedPrompt }),
        });

        const data = await res.json();

        if (data.contract) {
          const contractData = {
            title: 'Generated Contract',
            type: 'Service Agreement',
            content: data.contract,
          };

          setContract(contractData);
          setEditedContent(data.contract);

          localStorage.setItem(`contract-${contractId}`, JSON.stringify(contractData));
        } else {
          console.error('❌ No contract in response', data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch contract:', error);
      }
    };

    fetchContract();
  }, [params.id]);

  const handleCopy = async () => {
    if (contract) {
      await navigator.clipboard.writeText(contract.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (contract) {
      const updatedContract = { ...contract, content: editedContent };
      setContract(updatedContract);

      // Save to localStorage
      const contractId = params.id as string;
      localStorage.setItem(`contract-${contractId}`, JSON.stringify(updatedContract));

      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (contract) {
      setEditedContent(contract.content);
    }
    setIsEditing(false);
  };

  const handleDownload = () => {
    // Download temporarily disabled
    alert('Download feature is currently unavailable.');
  };

  if (!contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Action Buttons */}
        <div className="mb-6 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="hover:bg-accent">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit} className="hover:bg-accent">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDownload} className="hover:bg-accent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>

        {/* Original Prompt */}
        {originalPrompt && (
          <div className="mb-8 p-4 bg-accent/50 rounded-lg border border-accent">
            <h3 className="text-sm font-medium text-foreground mb-2">Original Request:</h3>
            <p className="text-sm text-muted-foreground italic">"{originalPrompt}"</p>
          </div>
        )}

        {/* Contract Content */}
        {isEditing ? (
          <div className="bg-background contract-content">
            <div className="prose prose-gray max-w-none leading-relaxed">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[600px] w-full border-none bg-transparent text-foreground leading-relaxed resize-none focus:outline-none focus:ring-0 text-base p-0"
                placeholder="Edit your contract content here..."
                style={{ fontFamily: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-background contract-content">
            <div className="prose prose-gray max-w-none leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-foreground mb-6 pb-4 border-b border-border">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-4 flex items-center">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground mb-4 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => <ul className="list-none space-y-2 mb-4">{children}</ul>,
                  li: ({ children }) => (
                    <li className="text-foreground flex items-start">
                      <span className="mr-2 text-muted-foreground">•</span>
                      <span>{children}</span>
                    </li>
                  ),
                  hr: () => <hr className="my-8 border-border" />,
                  em: ({ children }) => (
                    <em className="text-muted-foreground italic">{children}</em>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                }}
              >
                {contract.content}
              </ReactMarkdown>
            </div>
            {/* Signature Section */}
            <div className="mt-12 border-t pt-6 border-border text-foreground">
              <h2 className="text-xl font-semibold mb-4">Signatures</h2>

              <div className="flex flex-col space-y-6">
                <div>
                  <div className="border-b border-muted h-10 w-64"></div>
                  <p className="text-sm text-foreground mt-1">Client Signature</p>
                </div>
                <div>
                  <div className="border-b border-muted h-10 w-64"></div>
                  <p className="text-sm text-foreground mt-1">Service Provider Signature</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
