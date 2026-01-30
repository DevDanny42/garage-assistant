import React, { useState } from 'react';
import { Plus, Search, Download, MoreVertical, Receipt, CheckCircle, Clock, XCircle } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  jobCard: string;
  amount: number;
  tax: number;
  total: number;
  status: PaymentStatus;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', customer: 'John Smith', jobCard: 'JC-2024-003', amount: 250, tax: 30, total: 280, status: 'paid', dueDate: '2024-03-25', createdAt: '2024-03-18', paidAt: '2024-03-19' },
  { id: '2', invoiceNumber: 'INV-2024-002', customer: 'Sarah Wilson', jobCard: 'JC-2024-002', amount: 400, tax: 50, total: 450, status: 'pending', dueDate: '2024-03-28', createdAt: '2024-03-18' },
  { id: '3', invoiceNumber: 'INV-2024-003', customer: 'Mike Johnson', jobCard: 'JC-2024-005', amount: 100, tax: 20, total: 120, status: 'paid', dueDate: '2024-03-22', createdAt: '2024-03-17', paidAt: '2024-03-17' },
  { id: '4', invoiceNumber: 'INV-2024-004', customer: 'Emily Davis', jobCard: 'JC-2024-004', amount: 300, tax: 50, total: 350, status: 'pending', dueDate: '2024-03-26', createdAt: '2024-03-18' },
  { id: '5', invoiceNumber: 'INV-2024-005', customer: 'Robert Brown', jobCard: 'JC-2024-008', amount: 85, tax: 15, total: 100, status: 'paid', dueDate: '2024-03-24', createdAt: '2024-03-17', paidAt: '2024-03-18' },
  { id: '6', invoiceNumber: 'INV-2024-006', customer: 'Lisa Anderson', jobCard: 'JC-2024-006', amount: 480, tax: 70, total: 550, status: 'overdue', dueDate: '2024-03-15', createdAt: '2024-03-10' },
  { id: '7', invoiceNumber: 'INV-2024-007', customer: 'David Martinez', jobCard: 'JC-2024-007', amount: 180, tax: 20, total: 200, status: 'cancelled', dueDate: '2024-03-20', createdAt: '2024-03-15' },
  { id: '8', invoiceNumber: 'INV-2024-008', customer: 'Jennifer Taylor', jobCard: 'JC-2024-001', amount: 130, tax: 20, total: 150, status: 'pending', dueDate: '2024-03-27', createdAt: '2024-03-18' },
];

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; className: string }> = {
  paid: { label: 'Paid', icon: CheckCircle, className: 'text-status-completed bg-status-completed/10' },
  pending: { label: 'Pending', icon: Clock, className: 'text-status-pending bg-status-pending/10' },
  overdue: { label: 'Overdue', icon: XCircle, className: 'text-status-cancelled bg-status-cancelled/10' },
  cancelled: { label: 'Cancelled', icon: XCircle, className: 'text-muted-foreground bg-muted' },
};

export const Billing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockInvoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = mockInvoices.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = mockInvoices.filter((i) => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice',
      render: (invoice: Invoice) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Receipt className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-mono font-medium text-accent">{invoice.invoiceNumber}</p>
            <p className="text-sm text-muted-foreground">{invoice.jobCard}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (invoice: Invoice) => (
        <span className="font-medium text-foreground">{invoice.customer}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (invoice: Invoice) => (
        <div className="text-sm">
          <p className="font-medium text-foreground">${invoice.total.toFixed(2)}</p>
          <p className="text-muted-foreground">incl. ${invoice.tax} tax</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice: Invoice) => {
        const config = statusConfig[invoice.status];
        const Icon = config.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (invoice: Invoice) => (
        <span className="text-muted-foreground">
          {new Date(invoice.dueDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Invoice</DropdownMenuItem>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>Send to Customer</DropdownMenuItem>
            <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Void Invoice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="text-muted-foreground mt-1">Manage invoices and payments</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-status-completed mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-status-pending mt-1">${pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold text-destructive mt-1">${overdueAmount.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Invoices</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockInvoices.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'paid', 'pending', 'overdue', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredInvoices}
        emptyMessage="No invoices found"
      />
    </div>
  );
};
