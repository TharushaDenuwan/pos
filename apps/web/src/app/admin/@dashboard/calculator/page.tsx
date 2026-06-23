"use client";

import { useMemo, useState } from "react";

const VEHICLE_CONFIG = {
  AQUA: {
    label: "Aqua",
    efficiencyKmPerL: 20,
    fuelName: "Petrol 92",
  },
  CHR: {
    label: "CHR",
    efficiencyKmPerL: 10,
    fuelName: "Petrol 95",
  },
  KDH: {
    label: "KDH",
    efficiencyKmPerL: 10,
    fuelName: "Diesel",
  },
} as const;

const DEFAULT_PRICES = {
  petrol92: 434,
  petrol95: 495,
  diesel: 407,
};

export default function CalculatorPage() {
  const [vehicleType, setVehicleType] =
    useState<keyof typeof VEHICLE_CONFIG>("AQUA");
  const [distanceKm, setDistanceKm] = useState(0);
  const [fuelPrices, setFuelPrices] = useState({
    petrol92: DEFAULT_PRICES.petrol92,
    petrol95: DEFAULT_PRICES.petrol95,
    diesel: DEFAULT_PRICES.diesel,
  });

  const vehicle = VEHICLE_CONFIG[vehicleType];

  const fuelNeeded = useMemo(() => {
    if (!distanceKm || distanceKm <= 0) return 0;
    return Number((distanceKm / vehicle.efficiencyKmPerL).toFixed(2));
  }, [distanceKm, vehicle.efficiencyKmPerL]);

  const selectedFuelPrice = useMemo(() => {
    if (vehicleType === "AQUA") return fuelPrices.petrol92;
    if (vehicleType === "CHR") return fuelPrices.petrol95;
    return fuelPrices.diesel;
  }, [fuelPrices, vehicleType]);

  const fuelCost = useMemo(() => {
    if (!fuelNeeded) return 0;
    return Number((fuelNeeded * selectedFuelPrice).toFixed(2));
  }, [fuelNeeded, selectedFuelPrice]);

  const handlePriceChange = (key: keyof typeof fuelPrices, value: string) => {
    const parsed = Number(value);
    setFuelPrices((prev) => ({
      ...prev,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  return (
    <div className="space-y-8 p-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Hire price calculator
          </p>
          <h1 className="text-3xl font-semibold">Fuel & trip cost estimate</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Choose a vehicle, enter the trip distance, update fuel prices, and
            see the required fuel and cost for the trip.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
            <h2 className="text-lg font-medium">Trip inputs</h2>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Vehicle type
              </label>
              <select
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition hover:border-primary"
                value={vehicleType}
                onChange={(event) =>
                  setVehicleType(
                    event.target.value as keyof typeof VEHICLE_CONFIG,
                  )
                }
              >
                {Object.entries(VEHICLE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium text-foreground">
                Distance (km)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition hover:border-primary"
                value={distanceKm}
                onChange={(event) => setDistanceKm(Number(event.target.value))}
                placeholder="Enter trip distance"
              />

              <div className="rounded-2xl border border-border bg-muted p-4">
                <p className="text-sm text-muted-foreground">Fuel efficiency</p>
                <p className="mt-1 text-lg font-semibold">
                  {vehicle.efficiencyKmPerL} km / 1L ({vehicle.fuelName})
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
            <h2 className="text-lg font-medium">Fuel prices</h2>
            <div className="grid gap-4">
              <label className="block text-sm font-medium text-foreground">
                Petrol 92 price (Rs. per litre)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition hover:border-primary"
                value={fuelPrices.petrol92}
                onChange={(event) =>
                  handlePriceChange("petrol92", event.target.value)
                }
              />

              <label className="block text-sm font-medium text-foreground">
                Petrol 95 price (Rs. per litre)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition hover:border-primary"
                value={fuelPrices.petrol95}
                onChange={(event) =>
                  handlePriceChange("petrol95", event.target.value)
                }
              />

              <label className="block text-sm font-medium text-foreground">
                Diesel price (Rs. per litre)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none transition hover:border-primary"
                value={fuelPrices.diesel}
                onChange={(event) =>
                  handlePriceChange("diesel", event.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-background p-6">
          <h2 className="text-lg font-medium">Calculation result</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted p-4">
              <p className="text-sm text-muted-foreground">Selected vehicle</p>
              <p className="mt-1 text-xl font-semibold">{vehicle.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fuel type: {vehicle.fuelName}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted p-4">
              <p className="text-sm text-muted-foreground">Fuel required</p>
              <p className="mt-1 text-xl font-semibold">
                {fuelNeeded.toFixed(2)} L
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                for {distanceKm || 0} km
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted p-4 sm:col-span-2">
              <p className="text-sm text-muted-foreground">
                Estimated fuel cost
              </p>
              <p className="mt-1 text-3xl font-semibold">
                Rs. {fuelCost.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on {vehicle.fuelName} at Rs.{selectedFuelPrice.toFixed(2)}{" "}
                per litre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
