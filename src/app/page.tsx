import { FeaturedServices } from "@/components/home/featured-services";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Location } from "@/components/home/location";
import { Testimonials } from "@/components/home/testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <HowItWorks />
      <Testimonials />
      <Location />
    </>
  );
}
