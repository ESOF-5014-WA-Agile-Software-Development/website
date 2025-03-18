import { createContext, useContext, useState, ReactNode } from 'react';

// Define the data types
interface EnergyData {
    key: string;
    source?: string;
    amount?: string;
    appliance?: string;
    daily?: string;
    weekly?: string;
    seller?: string;
    price?: number;
}

// Define the context type
interface EnergyContextType {
    generationData: EnergyData[];
    consumptionData: EnergyData[];
    marketData: EnergyData[];
    setGenerationData: (data: EnergyData[]) => void;
    setConsumptionData: (data: EnergyData[]) => void;
    setMarketData: (data: EnergyData[]) => void;
}

// Provide a default context value
const defaultContext: EnergyContextType = {
    generationData: [],
    consumptionData: [],
    marketData: [],
    setGenerationData: () => {},
    setConsumptionData: () => {},
    setMarketData: () => {},
};

// Create the context with the defined type
const EnergyContext = createContext<EnergyContextType>(defaultContext);

// Define the provider props type
interface EnergyProviderProps {
    children: ReactNode; // Fix for TS7031 error
}

// Context Provider Component
export function EnergyProvider({ children }: EnergyProviderProps) {
    const [generationData, setGenerationData] = useState<EnergyData[]>([
        { key: '1', source: 'Solar Panels', amount: '10 kWh' },
        { key: '2', source: 'Wind Turbine', amount: '5 kWh' },
        { key: '3', source: 'Hydro Power', amount: '8 kWh' },
    ]);

    const [consumptionData, setConsumptionData] = useState<EnergyData[]>([
        { key: '1', appliance: 'TV', daily: '2 kWh', weekly: '14 kWh' },
        { key: '2', appliance: 'Light', daily: '1 kWh', weekly: '7 kWh' },
        { key: '3', appliance: 'Fridge', daily: '3 kWh', weekly: '21 kWh' },
        { key: '4', appliance: 'Washing Machine', daily: '1.5 kWh', weekly: '10.5 kWh' },
    ]);

    const [marketData, setMarketData] = useState<EnergyData[]>([
        { key: '1', seller: 'User A', amount: '20 kWh', price: 5 },
        { key: '2', seller: 'User B', amount: '35 kWh', price: 4.5 },
        { key: '3', seller: 'User C', amount: '50 kWh', price: 4 },
    ]);

    return (
        <EnergyContext.Provider value={{ generationData, consumptionData, marketData, setGenerationData, setConsumptionData, setMarketData }}>
            {children}
        </EnergyContext.Provider>
    );
}

// Hook to use EnergyContext
export function useEnergy() {
    return useContext(EnergyContext);
}
