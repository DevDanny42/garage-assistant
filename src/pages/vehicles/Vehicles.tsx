import React, { useState } from 'react';
import { Plus, Search, Car, Calendar, MoreVertical, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { StatusBadge, StatusType } from '@/components/StatusBadge';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  owner: string;
  ownerEmail?: string;
  ownerPhone?: string;
  lastService: string;
  totalServices: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
}

const mockVehicles: Vehicle[] = [
  { id: '1', make: 'Toyota', model: 'Camry', year: 2022, licensePlate: 'ABC-1234', vin: '1HGBH41JXMN109186', color: 'Silver', owner: 'John Smith', ownerEmail: 'john@email.com', ownerPhone: '+1234567890', lastService: '2024-03-15', totalServices: 5, status: 'approved' },
  { id: '2', make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'XYZ-5678', vin: '2HGBH41JXMN109187', color: 'Black', owner: 'Sarah Wilson', ownerEmail: 'sarah@email.com', ownerPhone: '+1234567891', lastService: '2024-03-10', totalServices: 3, status: 'approved' },
  { id: '3', make: 'Ford', model: 'F-150', year: 2020, licensePlate: 'DEF-9012', vin: '3HGBH41JXMN109188', color: 'Blue', owner: 'Mike Johnson', lastService: '2024-02-28', totalServices: 8, status: 'approved' },
  { id: '4', make: 'BMW', model: 'X5', year: 2023, licensePlate: 'GHI-3456', vin: '4HGBH41JXMN109189', color: 'White', owner: 'Emily Davis', lastService: '2024-03-18', totalServices: 2, status: 'approved' },
  { id: '5', make: 'Audi', model: 'A4', year: 2021, licensePlate: 'JKL-7890', vin: '5HGBH41JXMN109190', color: 'Red', owner: 'Robert Brown', lastService: '2024-03-05', totalServices: 4, status: 'approved' },
];

const mockPendingVehicles: Vehicle[] = [
  { id: '101', make: 'BMW', model: 'X3', year: 2023, licensePlate: 'KA-02-EF-9012', vin: '3HGBH41JXMN109188', color: 'Black', owner: 'John Smith', ownerEmail: 'john@email.com', ownerPhone: '+1234567890', lastService: '', totalServices: 0, status: 'pending', submittedAt: '2026-03-05' },
  { id: '102', make: 'Mercedes', model: 'E-Class', year: 2024, licensePlate: 'KA-03-GH-3456', vin: '6HGBH41JXMN109191', color: 'White', owner: 'Sarah Wilson', ownerEmail: 'sarah@email.com', ownerPhone: '+1234567891', lastService: '', totalServices: 0, status: 'pending', submittedAt: '2026-03-06' },
  { id: '103', make: 'Tesla', model: 'Model Y', year: 2025, licensePlate: 'KA-04-IJ-7890', vin: '8HGBH41JXMN109193', color: 'Red', owner: 'Emily Davis', ownerEmail: 'emily@email.com', ownerPhone: '+1234567892', lastService: '', totalServices: 0, status: 'pending', submittedAt: '2026-03-07' },
];

export const Vehicles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [pendingVehicles, setPendingVehicles] = useState(mockPendingVehicles);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; vehicle: Vehicle } | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);

  const handleAddVehicle = (vehicle: Omit<Vehicle, 'id' | 'lastService' | 'totalServices' | 'status'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: String(vehicles.length + 1),
      lastService: new Date().toISOString().split('T')[0],
      totalServices: 0,
      status: 'approved',
    };
    setVehicles([newVehicle, ...vehicles]);
    toast({ title: 'Vehicle added', description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been added.` });
  };

  const handleApprove = (vehicle: Vehicle) => {
    setPendingVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    setVehicles((prev) => [{ ...vehicle, status: 'approved' as const }, ...prev]);
    toast({ title: 'Vehicle approved', description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been approved.` });
    setConfirmAction(null);
  };

  const handleReject = (vehicle: Vehicle) => {
    setPendingVehicles((prev) => prev.filter((v) => v.id !== vehicle.id));
    toast({ title: 'Vehicle rejected', description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been rejected.` });
    setConfirmAction(null);
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPending = pendingVehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedColumns = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Car className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-sm text-muted-foreground">{vehicle.color}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'licensePlate',
      header: 'License Plate',
      render: (vehicle: Vehicle) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted font-mono text-sm font-medium">
          {vehicle.licensePlate}
        </span>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (vehicle: Vehicle) => <span className="text-foreground">{vehicle.owner}</span>,
    },
    {
      key: 'lastService',
      header: 'Last Service',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      key: 'totalServices',
      header: 'Total Services',
      render: (vehicle: Vehicle) => <span className="font-medium text-foreground">{vehicle.totalServices}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (vehicle: Vehicle) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewVehicle(vehicle)}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Vehicle</DropdownMenuItem>
            <DropdownMenuItem>Service History</DropdownMenuItem>
            <DropdownMenuItem>Create Job Card</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const pendingColumns = [
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
            <Car className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-sm text-muted-foreground">{vehicle.color}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'licensePlate',
      header: 'License Plate',
      render: (vehicle: Vehicle) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted font-mono text-sm font-medium">
          {vehicle.licensePlate}
        </span>
      ),
    },
    {
      key: 'vin',
      header: 'VIN',
      render: (vehicle: Vehicle) => (
        <span className="text-sm font-mono text-muted-foreground">{vehicle.vin}</span>
      ),
    },
    {
      key: 'owner',
      header: 'Submitted By',
      render: (vehicle: Vehicle) => (
        <div>
          <p className="text-foreground font-medium">{vehicle.owner}</p>
          {vehicle.ownerEmail && <p className="text-xs text-muted-foreground">{vehicle.ownerEmail}</p>}
        </div>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {vehicle.submittedAt ? new Date(vehicle.submittedAt).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewVehicle(vehicle)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setConfirmAction({ type: 'approve', vehicle })}
            className="p-2 hover:bg-green-500/10 rounded-lg transition-colors"
            title="Approve"
          >
            <CheckCircle className="h-4 w-4 text-green-600" />
          </button>
          <button
            onClick={() => setConfirmAction({ type: 'reject', vehicle })}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
            title="Reject"
          >
            <XCircle className="h-4 w-4 text-destructive" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage registered vehicles and approve user submissions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by make, model, plate, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Approved Vehicles</p>
          <p className="text-2xl font-bold text-foreground mt-1">{vehicles.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-yellow-500/30">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingVehicles.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Services</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {vehicles.reduce((sum, v) => sum + v.totalServices, 0)}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold text-foreground mt-1">12</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="approved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="approved">
            Approved ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending ({pendingVehicles.length})
            {pendingVehicles.length > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
                {pendingVehicles.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved">
          <DataTable columns={approvedColumns} data={filteredVehicles} emptyMessage="No approved vehicles found" />
        </TabsContent>

        <TabsContent value="pending">
          <DataTable columns={pendingColumns} data={filteredPending} emptyMessage="No pending vehicles to review" />
        </TabsContent>
      </Tabs>

      <AddVehicleDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddVehicle} />

      {/* Vehicle Detail Modal */}
      <Dialog open={!!viewVehicle} onOpenChange={() => setViewVehicle(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          {viewVehicle && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                  <Car className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {viewVehicle.year} {viewVehicle.make} {viewVehicle.model}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      viewVehicle.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-600'
                        : viewVehicle.status === 'approved'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {viewVehicle.status === 'pending' ? <Clock className="h-3 w-3" /> : viewVehicle.status === 'approved' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {viewVehicle.status.charAt(0).toUpperCase() + viewVehicle.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">License Plate</p>
                  <p className="text-sm font-mono font-medium text-foreground">{viewVehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">VIN</p>
                  <p className="text-sm font-mono font-medium text-foreground break-all">{viewVehicle.vin}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: viewVehicle.color.toLowerCase() === 'white' ? '#e5e7eb' : viewVehicle.color.toLowerCase() }}
                    />
                    <p className="text-sm font-medium text-foreground">{viewVehicle.color}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Year</p>
                  <p className="text-sm font-medium text-foreground">{viewVehicle.year}</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">Owner Information</p>
                <p className="text-sm font-medium text-foreground">{viewVehicle.owner}</p>
                {viewVehicle.ownerEmail && (
                  <p className="text-sm text-muted-foreground">{viewVehicle.ownerEmail}</p>
                )}
                {viewVehicle.ownerPhone && (
                  <p className="text-sm text-muted-foreground">{viewVehicle.ownerPhone}</p>
                )}
              </div>

              {viewVehicle.status === 'approved' && (
                <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Service</p>
                    <p className="text-sm font-medium text-foreground">
                      {viewVehicle.lastService ? new Date(viewVehicle.lastService).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Services</p>
                    <p className="text-sm font-medium text-foreground">{viewVehicle.totalServices}</p>
                  </div>
                </div>
              )}

              {viewVehicle.submittedAt && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Submitted At</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(viewVehicle.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {viewVehicle.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setViewVehicle(null);
                      setConfirmAction({ type: 'reject', vehicle: viewVehicle });
                    }}
                    className="px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      setViewVehicle(null);
                      setConfirmAction({ type: 'approve', vehicle: viewVehicle });
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        title={confirmAction?.type === 'approve' ? 'Approve Vehicle' : 'Reject Vehicle'}
        description={
          confirmAction?.type === 'approve'
            ? `Are you sure you want to approve the ${confirmAction.vehicle.year} ${confirmAction.vehicle.make} ${confirmAction.vehicle.model} submitted by ${confirmAction.vehicle.owner}?`
            : `Are you sure you want to reject the ${confirmAction?.vehicle.year} ${confirmAction?.vehicle.make} ${confirmAction?.vehicle.model} submitted by ${confirmAction?.vehicle.owner}?`
        }
        confirmText={confirmAction?.type === 'approve' ? 'Approve' : 'Reject'}
        variant={confirmAction?.type === 'reject' ? 'destructive' : 'default'}
        onConfirm={() => {
          if (confirmAction?.type === 'approve') handleApprove(confirmAction.vehicle);
          else if (confirmAction?.type === 'reject') handleReject(confirmAction.vehicle);
        }}
      />
    </div>
  );
};
