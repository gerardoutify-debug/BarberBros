import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { BookingWidget } from '@/components/landing/BookingWidget';
import { Intro } from '@/components/landing/Intro';
import { RoomsShowcase } from '@/components/landing/RoomsShowcase';
import { Amenities } from '@/components/landing/Amenities';
import { Stats } from '@/components/landing/Stats';
import { Gallery } from '@/components/landing/Gallery';
import { Testimonials } from '@/components/landing/Testimonials';
import { Location } from '@/components/landing/Location';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { Footer } from '@/components/landing/Footer';
import { PageAnimations } from './PageAnimations';

export default function Home() {
  return (
    <main className='relative w-full bg-[#0a0c0f] text-[#f0ede8]'>
      <PageAnimations />
      <Navbar />
      <Hero />
      <BookingWidget />
      <Intro />
      <RoomsShowcase />
      <Amenities />
      <Stats />
      <Gallery />
      <Testimonials />
      <Location />
      <FinalCTA />
      <Footer />
    </main>
  );
}
