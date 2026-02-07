import React from 'react';
import { Car, Calendar, Wrench, Fuel } from 'lucide-react';

const vehicles = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    plateNo: 'KA-01-AB-1234',
    color: 'Silver',
    fuelType: 'Petrol',
    lastService: '2026-01-15',
    totalServices: 5,
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    plateNo: 'KA-01-CD-5678',
    color: 'White',
    fuelType: 'Diesel',
    lastService: '2026-02-03',
    totalServices: 3,
  },
];

export const MyVehicles: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Vehicles</h1>
          <p className="text-muted-foreground mt-1">View your registered vehicles and service history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Car className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h3>
                <p className="text-sm text-muted-foreground">{vehicle.plateNo}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fuel</p>
                  <p className="text-sm font-medium text-foreground">{vehicle.fuelType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: vehicle.color.toLowerCase() === 'white' ? '#e5e7eb' : vehicle.color.toLowerCase() }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Color</p>
                  <p className="text-sm font-medium text-foreground">{vehicle.color}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Service</p>
                  <p className="text-sm font-medium text-foreground">{vehicle.lastService}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Services</p>
                  <p className="text-sm font-medium text-foreground">{vehicle.totalServices}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
