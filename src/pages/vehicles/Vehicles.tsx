import React, { useState } from 'react';
import { Plus, Search, Car, Calendar, MoreVertical } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { AddVehicleDialog } from '@/components/AddVehicleDialog';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  owner: string;
  lastService: string;
  totalServices: number;
}

const mockVehicles: Vehicle[] = [
  { id: '1', make: 'Toyota', model: 'Camry', year: 2022, licensePlate: 'ABC-1234', vin: '1HGBH41JXMN109186', color: 'Silver', owner: 'John Smith', lastService: '2024-03-15', totalServices: 5 },
  { id: '2', make: 'Honda', model: 'Civic', year: 2021, licensePlate: 'XYZ-5678', vin: '2HGBH41JXMN109187', color: 'Black', owner: 'Sarah Wilson', lastService: '2024-03-10', totalServices: 3 },
  { id: '3', make: 'Ford', model: 'F-150', year: 2020, licensePlate: 'DEF-9012', vin: '3HGBH41JXMN109188', color: 'Blue', owner: 'Mike Johnson', lastService: '2024-02-28', totalServices: 8 },
  { id: '4', make: 'BMW', model: 'X5', year: 2023, licensePlate: 'GHI-3456', vin: '4HGBH41JXMN109189', color: 'White', owner: 'Emily Davis', lastService: '2024-03-18', totalServices: 2 },
  { id: '5', make: 'Audi', model: 'A4', year: 2021, licensePlate: 'JKL-7890', vin: '5HGBH41JXMN109190', color: 'Red', owner: 'Robert Brown', lastService: '2024-03-05', totalServices: 4 },
  { id: '6', make: 'Mercedes', model: 'C-Class', year: 2022, licensePlate: 'MNO-1234', vin: '6HGBH41JXMN109191', color: 'Gray', owner: 'Lisa Anderson', lastService: '2024-03-12', totalServices: 6 },
  { id: '7', make: 'Chevrolet', model: 'Silverado', year: 2020, licensePlate: 'PQR-5678', vin: '7HGBH41JXMN109192', color: 'Green', owner: 'David Martinez', lastService: '2024-02-20', totalServices: 7 },
  { id: '8', make: 'Tesla', model: 'Model 3', year: 2023, licensePlate: 'STU-9012', vin: '8HGBH41JXMN109193', color: 'White', owner: 'Jennifer Taylor', lastService: '2024-03-20', totalServices: 1 },
];

export const Vehicles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [vehicles, setVehicles] = useState(mockVehicles);

  const handleAddVehicle = (vehicle: Omit<Vehicle, 'id' | 'lastService' | 'totalServices'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: String(vehicles.length + 1),
      lastService: new Date().toISOString().split('T')[0],
      totalServices: 0,
    };
    setVehicles([newVehicle, ...vehicles]);
    toast({ title: 'Vehicle added', description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been added.` });
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
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
      render: (vehicle: Vehicle) => (
        <span className="text-foreground">{vehicle.owner}</span>
      ),
    },
    {
      key: 'lastService',
      header: 'Last Service',
      render: (vehicle: Vehicle) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(vehicle.lastService).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'totalServices',
      header: 'Total Services',
      render: (vehicle: Vehicle) => (
        <span className="font-medium text-foreground">{vehicle.totalServices}</span>
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
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Vehicle</DropdownMenuItem>
            <DropdownMenuItem>Service History</DropdownMenuItem>
            <DropdownMenuItem>Create Job Card</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
          <h1 className="page-title">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage registered vehicles</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-sm text-muted-foreground">Total Vehicles</p>
          <p className="text-2xl font-bold text-foreground mt-1">{vehicles.length}</p>
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredVehicles}
        emptyMessage="No vehicles found"
      />

      <AddVehicleDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAdd={handleAddVehicle} />
    </div>
  );
};
