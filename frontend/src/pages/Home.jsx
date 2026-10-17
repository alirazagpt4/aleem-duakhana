import Hero from '../components/home/Hero';
import TrustStrip from '../components/home/TrustStrip';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryBand from '../components/home/CategoryBand';
import WhatsAppCta from '../components/home/WhatsAppCta';

export default function Home() {
    return (
        <>
            <Hero />
            <TrustStrip />
            <FeaturedProducts />
            <CategoryBand />
            <WhatsAppCta />
        </>
    );
}