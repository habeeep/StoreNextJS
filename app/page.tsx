'use client';

import { PageBackground } from "@/components/layout/PageBackground/PageBackground";
import { Container } from "@/components/layout/Container/Container";
import { HeroSection } from '@/components/home/HeroSection/HeroSection';
import { CategoriesCards } from '@/components/home/CategoriesCards/CategoriesCards';
import { PromoSection } from '@/components/home/PromoSection/PromoSection';

export default function HomePage() {
  return (
    <>
      <PageBackground
        imageUrl='/images/backgrounds/background1.png'
        topOffset='350px'
      />
      <Container>
        <HeroSection />
      </Container>
      <Container fullWidth={true}>
        <CategoriesCards />
      </Container>
      <Container>
        <PromoSection />
      </Container>
    </>
  );
}