import { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactSchema = z.object({
    name: z.string().min(2, 'Please enter your name'),
    email: z.string().email('Please enter a valid email'),
    message: z.string().min(10, 'Please include a short message (10+ chars)'),
});

type ContactForm = z.infer<typeof contactSchema>;

interface Props {
    onClose: () => void;
}

export default function ContactModal({ onClose }: Props) {
    const [sent, setSent] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

    const onSubmit = async (data: ContactForm) => {
        // Simulate submit — store messages locally and show success
        try {
            const raw = localStorage.getItem('contactMessages');
            const arr = raw ? JSON.parse(raw) : [];
            arr.unshift({ ...data, createdAt: new Date().toISOString() });
            localStorage.setItem('contactMessages', JSON.stringify(arr));
            setSent(true);
            reset();
            setTimeout(() => {
                setSent(false);
                onClose();
            }, 1200);
        } catch (e) {
            // ignore
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={onClose} className="absolute inset-0 bg-black/60" />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Contact Us</h3>
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
                        <X />
                    </button>
                </div>

                {sent ? (
                    <div className="py-8 text-center">
                        <h4 className="text-xl font-bold">Message sent</h4>
                        <p className="text-gray-500 mt-2">Thanks — we'll get back to you soon.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                {...register('name')}
                                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                {...register('email')}
                                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                            />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea
                                {...register('message')}
                                rows={4}
                                className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${errors.message ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'}`}
                            />
                            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60">
                                Send
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
