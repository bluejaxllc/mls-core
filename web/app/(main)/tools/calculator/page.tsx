'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, Percent, Calendar, TrendingDown, PieChart, Info, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';

export default function MortgageCalculatorPage() {
    const [price, setPrice] = useState(2500000);
    const [downPaymentPct, setDownPaymentPct] = useState(20);
    const [interestRate, setInterestRate] = useState(11.5);
    const [termYears, setTermYears] = useState(20);
    const [showAmortization, setShowAmortization] = useState(false);

    const calc = useMemo(() => {
        const downPayment = price * (downPaymentPct / 100);
        const loanAmount = price - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const totalPayments = termYears * 12;

        if (monthlyRate === 0) {
            return {
                monthlyPayment: loanAmount / totalPayments,
                totalPayment: loanAmount,
                totalInterest: 0,
                downPayment,
                loanAmount,
                amortization: []
            };
        }

        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
        const totalPayment = monthlyPayment * totalPayments;
        const totalInterest = totalPayment - loanAmount;

        const amortization: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
        let balance = loanAmount;

        for (let year = 1; year <= termYears; year++) {
            let yearPrincipal = 0;
            let yearInterest = 0;

            for (let month = 0; month < 12; month++) {
                const interestPayment = balance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                yearPrincipal += principalPayment;
                yearInterest += interestPayment;
                balance -= principalPayment;
            }

            amortization.push({
                year,
                principalPaid: yearPrincipal,
                interestPaid: yearInterest,
                balance: Math.max(0, balance)
            });
        }

        return { monthlyPayment, totalPayment, totalInterest, downPayment, loanAmount, amortization };
    }, [price, downPaymentPct, interestRate, termYears]);

    const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;
    const interestPct = calc.totalPayment > 0 ? (calc.totalInterest / calc.totalPayment) * 100 : 0;
    const principalPct = 100 - interestPct;

    return (
        <PageTransition className="max-w-5xl mx-auto space-y-6">
            {/* Back + Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors mb-3">
                        <ArrowLeft className="h-4 w-4" />
                        Herramientas
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Calculator className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calculadora Hipotecaria</h1>
                    </div>
                    <p className="text-white/80 text-sm md:text-base">Calcula tu pago mensual y tabla de amortización</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Input Panel */}
                <AnimatedCard className="lg:col-span-2 p-6 space-y-6" index={0}>
                    {/* Price */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                            Precio de la Propiedad
                        </label>
                        <input
                            type="range"
                            min={500000}
                            max={20000000}
                            step={100000}
                            value={price}
                            onChange={e => setPrice(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>$500K</span>
                            <span className="text-base font-bold text-emerald-600">{fmt(price)} MXN</span>
                            <span>$20M</span>
                        </div>
                    </div>

                    {/* Down Payment */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <TrendingDown className="h-4 w-4 text-blue-500" />
                            Enganche ({downPaymentPct}%)
                        </label>
                        <input
                            type="range"
                            min={5}
                            max={50}
                            step={1}
                            value={downPaymentPct}
                            onChange={e => setDownPaymentPct(Number(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>5%</span>
                            <span className="text-base font-bold text-blue-600">{fmt(calc.downPayment)}</span>
                            <span>50%</span>
                        </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <Percent className="h-4 w-4 text-orange-500" />
                            Tasa de Interés Anual
                        </label>
                        <input
                            type="range"
                            min={5}
                            max={20}
                            step={0.1}
                            value={interestRate}
                            onChange={e => setInterestRate(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>5%</span>
                            <span className="text-base font-bold text-orange-600">{interestRate.toFixed(1)}%</span>
                            <span>20%</span>
                        </div>
                    </div>

                    {/* Term */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            Plazo (años)
                        </label>
                        <div className="flex gap-2">
                            {[10, 15, 20, 25, 30].map(y => (
                                <motion.button
                                    key={y}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setTermYears(y)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${termYears === y
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                        : 'bg-muted text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {y}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-muted-foreground">
                        <Info className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>Tasas bancarias en México (BANXICO Q1 2026): Promedio hipotecario 10.5%-12.5%. Consulta con tu banco para una cotización personalizada.</p>
                    </div>
                </AnimatedCard>

                {/* Results Panel */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Monthly Payment Hero */}
                    <motion.div
                        key={calc.monthlyPayment}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-8 text-white text-center shadow-lg shadow-emerald-500/20"
                    >
                        <p className="text-sm uppercase tracking-wider opacity-80 mb-2">Tu Pago Mensual Estimado</p>
                        <motion.div
                            key={calc.monthlyPayment}
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className="text-4xl md:text-5xl font-black"
                        >
                            {fmt(calc.monthlyPayment)}
                        </motion.div>
                        <p className="text-sm opacity-70 mt-2">MXN / mes</p>
                    </motion.div>

                    {/* Breakdown Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Monto del Crédito', value: fmt(calc.loanAmount), color: 'text-blue-600' },
                            { label: 'Total a Pagar', value: fmt(calc.totalPayment + calc.downPayment), color: 'text-foreground' },
                            { label: 'Total Intereses', value: fmt(calc.totalInterest), color: 'text-orange-600' },
                            { label: 'Enganche', value: fmt(calc.downPayment), color: 'text-emerald-600' },
                        ].map((card, idx) => (
                            <motion.div
                                key={card.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow"
                            >
                                <p className="text-xs text-muted-foreground">{card.label}</p>
                                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Cost Breakdown Visual */}
                    <AnimatedCard className="p-5" index={1}>
                        <div className="flex items-center gap-2 mb-3">
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold text-sm">Desglose del Pago Total</h3>
                        </div>
                        <div className="h-6 rounded-full overflow-hidden flex bg-muted">
                            <motion.div
                                className="bg-emerald-500 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${principalPct}%` }}
                                transition={{ duration: 0.6 }}
                            />
                            <motion.div
                                className="bg-orange-500 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${interestPct}%` }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                            <span className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                Capital: {principalPct.toFixed(1)}%
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                Intereses: {interestPct.toFixed(1)}%
                            </span>
                        </div>
                    </AnimatedCard>

                    {/* Amortization Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => setShowAmortization(!showAmortization)}
                        className="w-full text-left bg-card border rounded-xl p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            <span className="font-semibold text-sm">Tabla de Amortización</span>
                        </div>
                        <motion.div animate={{ rotate: showAmortization ? 180 : 0 }}>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                    </motion.button>

                    <AnimatePresence>
                        {showAmortization && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-card border rounded-xl overflow-hidden"
                            >
                                {/* Visual Bar Chart */}
                                <div className="p-4 border-b">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Capital vs Intereses por Año</h4>
                                    <div className="space-y-1.5 max-h-64 overflow-y-auto">
                                        {calc.amortization.map(row => {
                                            const total = row.principalPaid + row.interestPaid;
                                            const pPct = (row.principalPaid / total) * 100;
                                            return (
                                                <div key={row.year} className="flex items-center gap-2 text-xs">
                                                    <span className="w-8 text-muted-foreground text-right">A{row.year}</span>
                                                    <div className="flex-1 h-4 rounded-full overflow-hidden flex bg-muted">
                                                        <div className="bg-emerald-500 h-full" style={{ width: `${pPct}%` }} />
                                                        <div className="bg-orange-400 h-full" style={{ width: `${100 - pPct}%` }} />
                                                    </div>
                                                    <span className="w-20 text-right font-mono">{fmt(row.balance)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="p-2.5 text-left font-semibold">Año</th>
                                                <th className="p-2.5 text-right font-semibold">Capital</th>
                                                <th className="p-2.5 text-right font-semibold">Intereses</th>
                                                <th className="p-2.5 text-right font-semibold">Saldo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {calc.amortization.map(row => (
                                                <tr key={row.year} className="border-t hover:bg-muted/30 transition-colors">
                                                    <td className="p-2.5 font-medium">{row.year}</td>
                                                    <td className="p-2.5 text-right text-emerald-600">{fmt(row.principalPaid)}</td>
                                                    <td className="p-2.5 text-right text-orange-600">{fmt(row.interestPaid)}</td>
                                                    <td className="p-2.5 text-right font-mono">{fmt(row.balance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageTransition>
    );
}
