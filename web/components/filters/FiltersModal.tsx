'use client';

import { X, Filter as FilterIcon } from 'lucide-react';
import { useState } from 'react';

interface FiltersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
    const [filters, setFilters] = useState({
        propertyType: '',
        priceMin: '',
        priceMax: '',
        region: '',
        status: ''
    });

    if (!isOpen) return null;

    const handleApply = () => {
        // TODO: Implement actual filtering logic
        console.log('Applying filters:', filters);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card border rounded-lg max-w-md w-full shadow-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FilterIcon className="h-4 w-4" /> Property Filters
                    </h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Property Type</label>
                        <select
                            value={filters.propertyType}
                            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                            className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                        >
                            <option value="">All Types</option>
                            <option value="commercial">Commercial</option>
                            <option value="residential">Residential</option>
                            <option value="industrial">Industrial</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Min Price (MXN)</label>
                            <input
                                type="number"
                                value={filters.priceMin}
                                onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                                placeholder="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Price (MXN)</label>
                            <input
                                type="number"
                                value={filters.priceMax}
                                onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                                className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                                placeholder="∞"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Region</label>
                        <input
                            type="text"
                            value={filters.region}
                            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                            className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                            placeholder="e.g., Chihuahua, Roma Norte"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-3 py-2 bg-background border rounded-md text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-muted text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
