import { SavingsBankList } from "@/features/savingsBank/components/savings-bank-list";

export default function SavingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Savings Bank
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Manage your savings records
          </p>
        </div>
      </div>

      <SavingsBankList />
    </div>
  );
}
