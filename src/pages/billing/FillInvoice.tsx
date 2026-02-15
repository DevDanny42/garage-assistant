import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { toast } from 'sonner';

export const FillInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatCurrency } = useSettings();

  const [labourAmount, setLabourAmount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(15);
  const [sending, setSending] = useState(false);

  const taxAmount = labourAmount * (taxRate / 100);
  const total = labourAmount + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (labourAmount <= 0) {
      toast.error('Please enter a valid labour amount');
      return;
    }
    setSending(true);
    try {
      // TODO: call backend API with invoice id
      // await billingApi.update(id, { labourAmount, taxRate, tax: taxAmount, total });
      toast.success('Bill sent to customer successfully');
      navigate('/billing');
    } catch {
      toast.error('Failed to send bill');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/billing')} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fill Bill</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Invoice #{id} — Enter labour charge and tax</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Labour Amount *</label>
            <input
              type="number"
              value={labourAmount || ''}
              onChange={(e) => setLabourAmount(Number(e.target.value))}
              placeholder="Enter labour amount"
              min={0}
              step={0.01}
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

        {/* Summary */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Labour</span>
              <span className="font-medium text-foreground">{formatCurrency(labourAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({taxRate}%)</span>
              <span className="font-medium text-foreground">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold text-lg text-foreground">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <button type="button" onClick={() => navigate('/billing')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="btn-primary">
              <Send className="h-4 w-4" />
              {sending ? 'Sending…' : 'Send Bill'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
