import type { Metadata } from "next";

import { StatsBand } from "@/components/content/stats-band";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Location } from "@/components/home/location";
import { PetCategories } from "@/components/home/pet-categories";
import { PopularServices } from "@/components/home/popular-services";
import { PromoTiles } from "@/components/home/promo-tiles";
import { Testimonials } from "@/components/home/testimonials";
import { TipsPreview } from "@/components/home/tips-preview";
import { Transformations } from "@/components/home/transformations";
import { TrustFeatures } from "@/components/home/trust-features";
import { WhyChoose } from "@/components/home/why-choose";
import { PetStoreJsonLd } from "@/components/seo/pet-store-json-ld";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <PetStoreJsonLd />
      <Hero />
      <PopularServices />
      <PetCategories />
      <PromoTiles />
      <WhyChoose />
      <HowItWorks />
      <Transformations />
      <StatsBand />
      <Testimonials />
      <TipsPreview />
      <TrustFeatures />
      <Location />
    </>
  );
}
