'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { AnimatedButton, AnimatedInput } from '@/components/ui/animated';
import { motion, AnimatePresence } from 'framer-motion';

const leadSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
    listingId: string;
    listingTitle: string;
}

export function LeadForm({ listingId, listingTitle }: LeadFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            message: `I'm interested in "${listingTitle}". Please send me more information.`
        }
    });

    const onSubmit = async (data: LeadFormData) => {
        setIsLoading(true);
        setError('');

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${API_URL}/api/public/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, listingId }),
            });

            if (!res.ok) throw new Error('Failed to submit inquiry');

            setIsSubmitted(true);
            reset();
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center"
            >
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-green-500 mb-2">Inquiry Sent!</h3>
                <p className="text-green-400 mb-6">Given the high interest in this property, an agent will contact you shortly.</p>
                <AnimatedButton
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="mx-auto"
                >
                    Send another message
                </AnimatedButton>
            </motion.div>
        );
    }

    return (
        <div className="bg-card rounded-xl shadow-lg border p-6 sticky top-24">
            <div className="mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Interested in this property?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Direct message the listing agent.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <AnimatedInput
                        placeholder="Your Name"
                        {...register('name')}
                        className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <AnimatedInput
                        type="email"
                        placeholder="Email Address"
                        {...register('email')}
                        className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <AnimatedInput
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        {...register('phone')}
                        className="w-full"
                    />
                </div>

                <div>
                    <textarea
                        {...register('message')}
                        rows={4}
                        className={`w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${errors.message ? 'border-red-500' : 'border-input'}`}
                        placeholder="Message..."
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded-md border border-red-500/20">
                        {error}
                    </div>
                )}

                <AnimatedButton
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full justify-center py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            Send Inquiry <Send className="ml-2 h-5 w-5" />
                        </>
                    )}
                </AnimatedButton>

                <p className="text-xs text-center text-muted-foreground mt-4">
                    By sending, you agree to our Terms of Service and Privacy Policy.
                </p>
            </form>
        </div>
    );
}
