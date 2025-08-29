'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Edit, Save, X, RefreshCw, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/components/navigation';
import { generateContractPDF } from '@/utils/pdf-utils';
import ContractEditor from '@/components/contract/ContractEditor';

import { useAuth } from '@/lib/AuthContext';

interface ContractData {
  title: string;
  type: string;
  content: string;
}

export default function ContractPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isDevMode = process.env.NODE_ENV === 'development';
  const [contract, setContract] = useState<ContractData | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollPositionRef = useRef<number>(0);

  const fetchContract = useCallback(
    async (forceRegenerate = false) => {
      const contractId = params.id as string;

      if (isDevMode) {
        // Development mode: Use localStorage
        const storedPrompt = localStorage.getItem(`dev-contract-${contractId}-prompt`);
        if (!storedPrompt) return;

        // Clear existing contract if forcing regeneration
        if (forceRegenerate) {
          localStorage.removeItem(`dev-contract-${contractId}`);
        }

        try {
          setIsRegenerating(true);
          setError(null);

          const res = await fetch('/api/generate-contract-dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: storedPrompt }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || `HTTP ${res.status}`);
          }

          if (data.contract) {
            const contractData = {
              title: 'Generated Contract',
              type: 'Service Agreement',
              content: data.contract,
            };

            setContract(contractData);
            setEditedContent(data.contract);
            localStorage.setItem(`dev-contract-${contractId}`, JSON.stringify(contractData));
          } else {
            setError('No contract content received');
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Failed to generate contract');
          }
        } finally {
          setIsRegenerating(false);
        }
      } else {
        // Production mode: Fetch from Supabase
        try {
          setIsRegenerating(true);
          setError(null);

          const res = await fetch(`/api/contracts/${contractId}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || `HTTP ${res.status}`);
          }

          if (data.contract) {
            const contractData = {
              title: data.contract.title,
              type: 'Service Agreement',
              content: data.contract.content,
            };

            setContract(contractData);
            setEditedContent(data.contract.content);
            setOriginalPrompt(data.contract.prompt);
          } else {
            setError('Contract not found');
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Failed to fetch contract');
          }
        } finally {
          setIsRegenerating(false);
        }
      }
    },
    [params.id, isDevMode]
  );

  useEffect(() => {
    const contractId = params.id as string;

    if (isDevMode) {
      // Development mode: Use localStorage
      const storedPrompt = localStorage.getItem(`dev-contract-${contractId}-prompt`);
      const existing = localStorage.getItem(`dev-contract-${contractId}`);

      if (!storedPrompt) return;
      setOriginalPrompt(storedPrompt);

      // Load existing contract from localStorage
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          setContract(parsed);
          setEditedContent(parsed.content);
        } catch (err) {
          // Silent fail for production
        }
      } else {
        // Only generate if no existing contract is found
        fetchContract();
      }
    } else {
      // Production mode: Fetch from Supabase
      fetchContract();
    }
  }, [params.id, isDevMode, fetchContract]);

  // Restore scroll position when editing state changes
  useEffect(() => {
    if (!isEditing && scrollPositionRef.current > 0) {
      // Use a longer delay to ensure the DOM has updated
      const timer = setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
        scrollPositionRef.current = 0; // Reset after restoring
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  const handleEdit = () => {
    // Store current scroll position
    scrollPositionRef.current = window.scrollY;
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (contract) {
      setIsSaving(true);
      setError(null);

      try {
        if (isDevMode) {
          // Development: Save to localStorage only
          const updatedContract = { ...contract, content: editedContent };
          setContract(updatedContract);
          const contractId = params.id as string;
          localStorage.setItem(`dev-contract-${contractId}`, JSON.stringify(updatedContract));
          setIsEditing(false);
        } else {
          // Production: Save to Supabase only
          const contractId = params.id as string;
          const response = await fetch(`/api/contracts/${contractId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: editedContent,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to save contract');
          }

          // Update the local contract state with the saved content
          const updatedContract = { ...contract, content: editedContent };
          setContract(updatedContract);
          setIsEditing(false);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to save contract');
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    if (contract) {
      setEditedContent(contract.content);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const contractId = params.id as string;

      if (isDevMode) {
        // Development: Remove from localStorage only
        localStorage.removeItem(`dev-contract-${contractId}`);
        localStorage.removeItem(`dev-contract-${contractId}-prompt`);
        router.push('/contracts');
      } else {
        // Production: Delete from Supabase only
        const response = await fetch('/api/contracts/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contractId }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete contract');
        }

        router.push('/contracts');
      }
    } catch (error) {
      setError('Failed to delete contract');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (contract) {
      generateContractPDF({
        title: contract.title,
        type: contract.type,
        content: contract.content,
        prompt: originalPrompt,
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isDevMode || !!user} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Original Prompt */}
        {originalPrompt && (
          <div className="mb-8 p-4 bg-accent/50 rounded-lg border border-accent">
            <h3 className="text-sm font-medium text-foreground mb-2">Original Request:</h3>
            <p className="text-sm text-muted-foreground italic">&ldquo;{originalPrompt}&rdquo;</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} className="hover:bg-accent">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => fetchContract(true)}
                disabled={isRegenerating}
                variant="outline"
                className="hover:bg-accent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
              </Button>
              <Button variant="outline" onClick={handleEdit} className="hover:bg-accent">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDownload} className="hover:bg-accent">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </>
          )}
        </div>

        {/* Contract Content */}
        <div className="min-h-[600px]">
          {isEditing ? (
            <ContractEditor
              content={editedContent}
              onChange={setEditedContent}
              onSave={handleSave}
              onCancel={handleCancel}
            />
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
                      <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                        {children}
                      </h3>
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
    </div>
  );
}
