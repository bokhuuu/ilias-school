import { usePage } from '@inertiajs/react';
import { CheckCircle, X, XCircle } from 'lucide-react';
import { useState } from 'react';

export function FlashMessage() {
    const { flash } = usePage<{
        flash: { success: string | null; error: string | null };
    }>().props;
    const [dismissed, setDismissed] = useState<string | null>(null);

    const success = flash?.success ?? null;
    const error = flash?.error ?? null;

    const message = success
        ? { type: 'success' as const, text: success }
        : error
          ? { type: 'error' as const, text: error }
          : null;

    if (!message || dismissed === message.text) return null;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in duration-300 fade-in slide-in-from-top-2">
            <div
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${
                    message.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                }`}
            >
                {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
                <button
                    onClick={() => setDismissed(message.text)}
                    className="ml-2"
                >
                    <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                </button>
            </div>
        </div>
    );
}
