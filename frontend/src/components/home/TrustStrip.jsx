import { Leaf, MessageCircle, Truck } from 'lucide-react';

const items = [
    { icon: Leaf, title: 'Natural products', text: 'Honey, herbs and dry fruits.' },
    { icon: MessageCircle, title: 'Clear guidance', text: 'Ask us on WhatsApp before you buy.' },
    { icon: Truck, title: 'Cash on delivery', text: 'Pay when your order arrives.' },
];

export default function TrustStrip() {
    return (
        <section className="border-y border-gray-200 bg-cream-50">
            <div className="mx-auto grid max-w-6xl divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {items.map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-start gap-3 px-4 py-5">
                        <Icon size={22} className="mt-0.5 shrink-0 text-gold-600" />
                        <div>
                            <p className="font-semibold text-ink">{title}</p>
                            <p className="text-sm text-muted">{text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}