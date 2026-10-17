import { MessageCircle } from 'lucide-react';
import { SHOP } from '../../utils/constants';

export default function WhatsAppButton() {
    const url = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(
        'Hello, I would like to order.'
    )}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
            className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-ink shadow-lg transition hover:scale-105 hover:shadow-xl"
        >
            <MessageCircle size={22} />
            <span className="hidden sm:inline">Order on WhatsApp</span>
        </a>
    );
}