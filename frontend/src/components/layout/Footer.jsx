import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { SHOP } from '../../utils/constants';

export default function Footer() {
    return (
        <footer className="mt-16 bg-brand-900 text-brand-100">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                <div>
                    <p className="text-xl font-bold text-white">
                        Aleem<span className="text-gold-500">Dawa</span>
                    </p>
                    <p className="mt-2 text-sm"> Khana Pansar &amp; Dry Fruits</p>
                </div>

                <div>
                    <p className="font-semibold text-white">Quick links</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li>
                            <Link to="/" className="hover:text-gold-500">Home</Link>
                        </li>
                        <li>
                            <Link to="/products" className="hover:text-gold-500">Products</Link>
                        </li>
                        <li>
                            <Link to="/cart" className="hover:text-gold-500">Cart</Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="font-semibold text-white">Contact</p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <Phone size={16} /> {SHOP.phone}
                        </li>
                        <li className="flex items-center gap-2">
                            <MessageCircle size={16} />
                            <a
                                href={`https://wa.me/${SHOP.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-gold-500"
                            >
                                Chat on WhatsApp
                            </a>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5 shrink-0" /> {SHOP.address}
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-brand-700 py-4 text-center text-xs">
                © {new Date().getFullYear()} {SHOP.name}. All rights reserved.
            </div>
        </footer>
    );
}