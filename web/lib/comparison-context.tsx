'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface ComparisonItem {
    id: string;
    title: string;
    price: number | null;
    address: string | null;
    image: string | null;
    propertyType?: string;
    status?: string;
    source?: string;
    trustScore?: number;
}

interface ComparisonContextType {
    items: ComparisonItem[];
    addItem: (item: ComparisonItem) => void;
    removeItem: (id: string) => void;
    clearAll: () => void;
    isInComparison: (id: string) => boolean;
    isFull: boolean;
}

const MAX_COMPARE = 4;

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ComparisonItem[]>([]);

    const addItem = useCallback((item: ComparisonItem) => {
        setItems(prev => {
            if (prev.length >= MAX_COMPARE) return prev;
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const clearAll = useCallback(() => setItems([]), []);

    const isInComparison = useCallback((id: string) => {
        return items.some(i => i.id === id);
    }, [items]);

    const isFull = items.length >= MAX_COMPARE;

    return (
        <ComparisonContext.Provider value={{ items, addItem, removeItem, clearAll, isInComparison, isFull }}>
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const ctx = useContext(ComparisonContext);
    if (!ctx) throw new Error('useComparison must be used within ComparisonProvider');
    return ctx;
}
