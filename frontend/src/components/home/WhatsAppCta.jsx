import { MessageCircle, Phone } from 'lucide-react';
import { SHOP } from '../../utils/constants';

export default function WhatsAppCta() {
    const whatsappUrl = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(
        'Hello, I need help choosing a product.'
    )}`;
    const telUrl = `tel:${SHOP.phone.replace(/[^\d+]/g, '')}`;

    return (
        <section className="mx-auto max-w-6xl px-4 py-14">
            <div className="rounded-3xl border border-gray-200 bg-cream-50 px-6 py-10 text-center sm:px-12">
                <p className="text-xs font-medium uppercase tracking-widest text-gold-600">
                    Need help?
                </p>
                <h2 className="mt-2 text-3xl font-bold text-brand-900">Not sure what to choose?</h2>
                <p className="mx-auto mt-3 max-w-xl text-muted">
                    Message us on WhatsApp or call us. Tell us what you are looking for and we will
                    guide you before you order.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 py-3 font-semibold text-ink transition hover:opacity-90 sm:w-auto"
                    >
                        <MessageCircle size={18} />
                        Chat on WhatsApp
                    </a>
                    <a
                        href={telUrl}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-900 px-6 py-3 font-semibold text-brand-900 transition hover:bg-brand-100 sm:w-auto"
                    >
                        <Phone size={18} />
                        {SHOP.phone}
                    </a>
                </div>
            </div>
        </section>
    );
}