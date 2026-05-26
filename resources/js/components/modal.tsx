import { ReactNode, useEffect } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    // close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (open) {
            window.addEventListener('keydown', handleEsc);
        }

        return () => window.removeEventListener('keydown', handleEsc);
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* modal box */}
            <div className="relative bg-white w-[600px] max-w-[90%] rounded-xl shadow-xl p-6 z-10">

                {/* header */}
                {title && (
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-lg font-semibold">{title}</h2>

                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* body */}
                <div>{children}</div>
            </div>
        </div>
    );
}