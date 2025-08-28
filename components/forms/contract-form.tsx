'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PromptInput from './prompt-input';

export default function ContractForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (input: string, contractName: string) => {
    setLoading(true);

    setTimeout(() => {
      // Parse user input to extract key information
      const inputLower = input.toLowerCase();

      // Extract project type
      let projectType = 'Digital Services';
      if (inputLower.includes('website') || inputLower.includes('web'))
        projectType = 'Website Development';
      else if (inputLower.includes('app') || inputLower.includes('mobile'))
        projectType = 'Mobile App Development';
      else if (inputLower.includes('logo') || inputLower.includes('brand'))
        projectType = 'Brand Identity Design';
      else if (inputLower.includes('marketing') || inputLower.includes('social'))
        projectType = 'Marketing Services';

      // Extract budget if mentioned
      const budgetMatch = input.match(/\$[\d,]+|\d+\s*(?:dollars?|k|thousand)/i);
      const budget = budgetMatch ? budgetMatch[0] : '$5,000';

      // Extract timeline if mentioned
      const timelineMatch = input.match(/(\d+)\s*(?:weeks?|months?|days?)/i);
      const timeline = timelineMatch ? timelineMatch[0] : '6 weeks';

      // Generate realistic contract content
      const mockContract = `📄 Service Agreement

This Service Agreement ("Agreement") is made on ${new Date().toLocaleDateString()}, by and between:

Client: [Client Name]
Service Provider: [Your Business Name]

---

1. Scope of Work

The Service Provider agrees to deliver ${projectType.toLowerCase()} services including:

- ${input.split('.')[0] || input.substring(0, 100)}
- Project planning and consultation
- Regular progress updates and communication
- Quality assurance and testing
- Final delivery and handover

---

2. Deliverables

The following deliverables will be provided to the Client upon project completion:

- Completed ${projectType.toLowerCase()} as specified
- Source files and documentation
- Basic training and support documentation
- 30 days of post-launch support

---

3. Payment Terms

- Total Amount: ${budget}
- Payment Schedule: 50% upfront, 50% upon completion
- Payment Method: Bank transfer or PayPal
- Late Payment: 2% monthly fee applies to overdue amounts

---

4. Timeline

- Start Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Estimated Completion: ${timeline} from start date
- Milestones: Weekly progress reviews and updates

---

5. Revisions

The Client is entitled to 3 rounds of revisions. Additional revisions may incur extra charges at $75 per hour.

---

6. Termination

Either party may terminate this agreement with 7 days written notice. Payment will be made for work completed up to the termination date.

---

7. Ownership & Rights

Upon full payment, all final deliverables become the property of the Client. The Service Provider retains the right to showcase work in portfolios and case studies.

---

8. Confidentiality

Both parties agree to maintain confidentiality regarding any proprietary or sensitive information exchanged during this project.

---

9. Signatures

Client Signature: ___________________________
Service Provider Signature: ___________________________

Date: ___________________________`;

      // Generate contract ID and navigate to contract page
      const contractId = 'mock-contract-' + Date.now();
      const envPrefix = process.env.NODE_ENV === 'development' ? 'dev-' : 'prod-';

      // In a real app, you'd save the contract to a database here
      // For now, we'll store it in localStorage for the demo
      localStorage.setItem(
        `${envPrefix}contract-${contractId}`,
        JSON.stringify({
          title: contractName,
          type: projectType,
          content: mockContract,
        })
      );
      localStorage.setItem(`${envPrefix}contract-${contractId}-prompt`, input);

      router.push(`/contract/${contractId}`);
      setLoading(false);
    }, 1500); // Slightly longer delay for better UX
  };

  /* Future API implementation:
  const handleGenerate = async (input: string) => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      setResult(data.contract);
    } catch (error) {
      console.error('Error generating contract:', error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };
  */

  return (
    <div className="space-y-6">
      <PromptInput onGenerate={handleGenerate} loading={loading} />
    </div>
  );
}
