import NewContractClient from './NewContractClient';

// Force dynamic rendering to ensure middleware runs
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NewContractPage() {
  return <NewContractClient />;
}
