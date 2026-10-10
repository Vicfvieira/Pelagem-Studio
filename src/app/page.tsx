import type { Metadata } from "next";

import { StatsBand } from "@/components/content/stats-band";
import { FeaturedServices } from "@/components/home/featured-services";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Location } from "@/components/home/location";
import { ServiceMarquee } from "@/components/home/service-marquee";
import { Testimonials } from "@/components/home/testimonials";
import { Transformations } from "@/components/home/transformations";
import { PetStoreJsonLd } from "@/components/seo/pet-store-json-ld";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <PetStoreJsonLd />
      <Hero />
      <ServiceMarquee />
      <FeaturedServices />
      <HowItWorks />
      <Transformations />
      <StatsBand />
      <Testimonials />
      <Location />
    </>
  );
}
