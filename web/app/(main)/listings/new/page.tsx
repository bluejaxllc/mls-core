'use client';
import { useLanguage } from '@/lib/i18n';
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewListingPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        address: '',
        type: 'commercial'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Integrate with backend API
        alert('New listing created! (Mock - No actual save)');
        router.push('/listings');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Create New Listing</h2>
                    <p className="text-muted-foreground">Add a new commercial property listing</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted text-sm"
                >
                    <X className="h-4 w-4" /> Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Property Title</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 bg-card border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Luxury Office Floor in Reforma"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price (MXN)</label>
                        <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-3 py-2 bg-card border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="45000000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Property Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 bg-card border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="commercial">Commercial</option>
                            <option value="residential">Residential</option>
                            <option value="industrial">Industrial</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 bg-card border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Av. Paseo de la Reforma 483"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 bg-card border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe the property..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded-md hover:bg-muted text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Create Listing
                    </button>
                </div>
            </form>
        </div>
    );
}
