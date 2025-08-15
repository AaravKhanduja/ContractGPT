import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Contracts - ContractGPT',
  description: 'View and manage your generated contracts',
};

export default function ContractsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
