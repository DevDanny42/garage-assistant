import React from 'react';
import { Download, Eye, Receipt } from 'lucide-react';
import { StatusBadge, StatusType } from '@/components/StatusBadge';

const invoices = [
  {
    id: 'INV-2024-042',
    date: '2026-02-03',
    vehicle: 'Honda Civic 2021',
    service: 'Brake Replacement',
    amount: 4500,
    status: 'paid' as StatusType,
  },
  {
    id: 'INV-2024-038',
    date: '2026-01-15',
    vehicle: 'Toyota Camry 2022',
    service: 'Full Service',
    amount: 8200,
    status: 'paid' as StatusType,
  },
  {
    id: 'INV-2024-045',
    date: '2026-02-07',
    vehicle: 'Toyota Camry 2022',
    service: 'AC Repair',
    amount: 3500,
    status: 'pending' as StatusType,
  },
  {
    id: 'INV-2024-030',
    date: '2025-12-20',
    vehicle: 'Honda Civic 2021',
    service: 'Oil Change',
    amount: 1200,
    status: 'paid' as StatusType,
  },
];

export const MyInvoices: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Invoices</h1>
          <p className="text-muted-foreground mt-1">View and download your service invoices.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-foreground mt-1">₹{invoices.reduce((a, b) => a + b.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold text-accent mt-1">
            ₹{invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-destructive mt-1">
            ₹{invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-card rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Invoice</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Service</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{inv.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{inv.date}</td>
                  <td className="p-4 text-sm text-foreground">{inv.vehicle}</td>
                  <td className="p-4 text-sm text-foreground">{inv.service}</td>
                  <td className="p-4 text-sm font-medium text-foreground">₹{inv.amount.toLocaleString()}</td>
                  <td className="p-4"><StatusBadge status={inv.status} /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Download">
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
