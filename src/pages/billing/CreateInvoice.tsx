import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { toast } from 'sonner';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { formatCurrency } = useSettings();

  const [customer, setCustomer] = useState('');
  const [jobCard, setJobCard] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(15);
  const [items, setItems] = useState<LineItem[]>([
    { id: generateId(), description: '', quantity: 1, unitPrice: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !dueDate || items.some((i) => !i.description || i.unitPrice <= 0)) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Invoice created successfully');
    navigate('/billing');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/billing')} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Invoice</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Job Card */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Customer Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Customer Name *</label>
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. John Smith"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Job Card Reference</label>
              <input
                value={jobCard}
                onChange={(e) => setJobCard(e.target.value)}
                placeholder="e.g. JC-2024-001"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Due Date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                min={0}
                max={100}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Line Items</h2>
            <button type="button" onClick={addItem} className="btn-secondary text-sm">
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          {/* Header row - hidden on mobile */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_80px_120px_40px] gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
            <span>Description</span>
            <span>Qty</span>
            <span>Unit Price</span>
            <span></span>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_40px] gap-3 items-start">
                <div>
                  <label className="sm:hidden block text-xs text-muted-foreground mb-1">Description</label>
                  <input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Service or part description"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="sm:hidden block text-xs text-muted-foreground mb-1">Qty</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                    min={1}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="sm:hidden block text-xs text-muted-foreground mb-1">Unit Price</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                    min={0}
                    step={0.01}
                    className="input-field"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive self-end sm:self-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes for the invoice..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Totals & Submit */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <div className="flex flex-col items-end gap-2 text-sm">
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between w-full max-w-xs">
              <span className="text-muted-foreground">Tax ({taxRate}%)</span>
              <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-border w-full max-w-xs pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <button type="button" onClick={() => navigate('/billing')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save className="h-4 w-4" />
              Create Invoice
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
