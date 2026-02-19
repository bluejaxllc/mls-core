"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProvisionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
        timezone: "America/Chicago"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${''}/api/provision`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(`ÉXITO! Ubicación Creada: ${data.locationId}`);
                router.push('/');
            } else {
                alert(`ERROR: ${data.error || 'Error al crear ubicación'}`);
            }
        } catch (error: any) {
            alert(`NETWORK ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4 font-['Press_Start_2P'] text-white">
            <div className="max-w-2xl w-full border-4 border-white p-2 bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="border-4 border-white p-8">

                    {/* Header */}
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-xl text-[#3b82f6] drop-shadow-[2px_2px_0px_white] tracking-tighter">
                            PROVISIÓN DE SUBCUENTA
                        </h1>
                        <p className="text-[10px] text-zinc-400">CREAR NUEVA UBICACIÓN</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Company Info */}
                        <div className="space-y-4 border-2 border-zinc-700 p-4">
                            <p className="text-[10px] text-[#3b82f6]">DETALLES DE LA EMPRESA</p>

                            <div className="space-y-2">
                                <label className="text-[8px] text-zinc-400">NOMBRE *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 border-2 border-zinc-700 p-4">
                            <p className="text-[10px] text-[#3b82f6]">CONTACTO PRINCIPAL</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] text-zinc-400">PRIMER NOMBRE</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] text-zinc-400">APELLIDO</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[8px] text-zinc-400">EMAIL</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[8px] text-zinc-400">TELÉFONO</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4 border-2 border-zinc-700 p-4">
                            <p className="text-[10px] text-[#3b82f6]">DIRECCIÓN DE UBICACIÓN</p>

                            <div className="space-y-2">
                                <label className="text-[8px] text-zinc-400">CALLE</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[8px] text-zinc-400">CIUDAD</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] text-zinc-400">ESTADO</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[8px] text-zinc-400">CÓDIGO POSTAL</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="w-full bg-black border-2 border-white p-2 text-[10px] focus:outline-none focus:border-[#3b82f6] text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3b82f6] border-2 border-white text-white p-4 text-[10px] hover:bg-[#2563eb] active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'PROVISIONANDO...' : 'CREAR SUBCUENTA'}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-full bg-zinc-800 border-2 border-white text-white p-3 text-[10px] hover:bg-zinc-700 transition-all"
                        >
                            CANCELAR
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-[8px] text-zinc-500 text-center mt-6">
                        <p>bluejax.core © 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
