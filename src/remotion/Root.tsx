import { Composition, Folder } from 'remotion';
import { BrandIntro } from './compositions/BrandIntro';
import { LowerThird } from './compositions/LowerThird';
import { DataBarChart } from './compositions/DataBarChart';
import { TypewriterTitle } from './compositions/TypewriterTitle';
import { HighlightTagline } from './compositions/HighlightTagline';
import { SocialReel } from './compositions/SocialReel';
import { PhotoShowcase } from './compositions/PhotoShowcase';
import { StatCallout } from './compositions/StatCallout';
import { SaaSPromo } from './compositions/SaaSPromo';
import { InfographicCards } from './compositions/InfographicCards';
import { BRAND } from './brand';

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Brand">
        <Composition
          id="BrandIntro"
          component={BrandIntro}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: BRAND.name,
            subtitle: BRAND.tagline,
          }}
        />
        <Composition
          id="LowerThird"
          component={LowerThird}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            name: 'Dr. Jane Smith',
            role: 'Quantum Market Intelligence Analyst',
          }}
        />
      </Folder>

      <Folder name="Data">
        <Composition
          id="DataBarChart"
          component={DataBarChart}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Quantum Computing Market Growth',
            data: [
              { label: '2022', value: 8.6 },
              { label: '2023', value: 12.4 },
              { label: '2024', value: 18.2 },
              { label: '2025', value: 28.9 },
              { label: '2026', value: 42.1 },
            ],
          }}
        />
        <Composition
          id="StatCallout"
          component={StatCallout}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            statValue: '47',
            statUnit: '%',
            label: 'of enterprises plan to increase quantum investment in 2025',
            context: 'TQI Market Research',
            source: 'The Quantum Insider Report 2025',
          }}
        />
      </Folder>

      <Folder name="Text">
        <Composition
          id="TypewriterTitle"
          component={TypewriterTitle}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            text: BRAND.tagline,
          }}
        />
        <Composition
          id="HighlightTagline"
          component={HighlightTagline}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            text: 'Empowering confident decisions that move the industry forward.',
            highlightWord: 'confident decisions',
          }}
        />
      </Folder>

      <Folder name="Social">
        <Composition
          id="SocialReel"
          component={SocialReel}
          durationInFrames={180}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            headline: 'Quantum\nMarket\nIntelligence',
            subline: 'Data-driven insights for the quantum era.',
            badge: 'NEW',
          }}
        />
        <Composition
          id="PhotoShowcase"
          component={PhotoShowcase}
          durationInFrames={270}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Quantum in Focus',
            photos: [
              { url: '', caption: 'Caption one' },
              { url: '', caption: 'Caption two' },
              { url: '', caption: 'Caption three' },
            ],
            credit: `© ${BRAND.shortName} ${new Date().getFullYear()}`,
          }}
        />
      </Folder>

      <Folder name="Marketing">
        <Composition
          id="SaaSPromo"
          component={SaaSPromo}
          durationInFrames={780}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            brandTheme: 'qhub' as const,
            heroTitle: 'Launch Your Platform With Style',
            feature1Title: 'Market Intelligence',
            feature1Desc: 'Real-time quantum market data and competitive monitoring',
            feature2Title: 'Data Analytics & Insights',
            feature2Desc: 'AI-powered trend discovery and informed decisions',
            feature3Title: 'Predictive Analytics',
            feature3Desc: 'Forecast trends and outcomes to stay ahead',
            mockupHeadline: 'AI solutions built for real business impact',
            mockupSubtitle: 'Streamline operations, elevate decision-making, and fuel growth',
            mockupCtaText: 'Start for free',
            statNumber: '500+',
            statLabel: 'Enterprise Clients',
            stat2Number: '10M+',
            stat2Label: 'Data Points Analyzed',
            stat3Number: '99.9%',
            stat3Label: 'Uptime',
            productName: 'QHUB',
            tagline: BRAND.tagline,
            ctaText: 'Explore all services',
            ctaUrl: 'qhub.thequantuminsider.com',
          }}
        />
        <Composition
          id="SaaSPromoVertical"
          component={SaaSPromo}
          durationInFrames={780}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            brandTheme: 'qhub' as const,
            heroTitle: 'Launch Your Platform With Style',
            feature1Title: 'Market Intelligence',
            feature1Desc: 'Real-time quantum market data and competitive monitoring',
            feature2Title: 'Data Analytics & Insights',
            feature2Desc: 'AI-powered trend discovery and informed decisions',
            feature3Title: 'Predictive Analytics',
            feature3Desc: 'Forecast trends and outcomes to stay ahead',
            mockupHeadline: 'AI solutions built for real business impact',
            mockupSubtitle: 'Streamline operations, elevate decision-making, and fuel growth',
            mockupCtaText: 'Start for free',
            statNumber: '500+',
            statLabel: 'Enterprise Clients',
            stat2Number: '10M+',
            stat2Label: 'Data Points Analyzed',
            stat3Number: '99.9%',
            stat3Label: 'Uptime',
            productName: 'QHUB',
            tagline: BRAND.tagline,
            ctaText: 'Explore all services',
            ctaUrl: 'qhub.thequantuminsider.com',
          }}
        />
        <Composition
          id="SaaSPromoSquare"
          component={SaaSPromo}
          durationInFrames={780}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{
            brandTheme: 'qhub' as const,
            heroTitle: 'Launch Your Platform With Style',
            feature1Title: 'Market Intelligence',
            feature1Desc: 'Real-time quantum market data and competitive monitoring',
            feature2Title: 'Data Analytics & Insights',
            feature2Desc: 'AI-powered trend discovery and informed decisions',
            feature3Title: 'Predictive Analytics',
            feature3Desc: 'Forecast trends and outcomes to stay ahead',
            mockupHeadline: 'AI solutions built for real business impact',
            mockupSubtitle: 'Streamline operations, elevate decision-making, and fuel growth',
            mockupCtaText: 'Start for free',
            statNumber: '500+',
            statLabel: 'Enterprise Clients',
            stat2Number: '10M+',
            stat2Label: 'Data Points Analyzed',
            stat3Number: '99.9%',
            stat3Label: 'Uptime',
            productName: 'QHUB',
            tagline: BRAND.tagline,
            ctaText: 'Explore all services',
            ctaUrl: 'qhub.thequantuminsider.com',
          }}
        />
      </Folder>
      <Folder name="Infographic">
        <Composition
          id="InfographicCards"
          component={InfographicCards}
          durationInFrames={825}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={{
            brandTheme: 'tqi' as const,
            section1Url: '',
            section2Url: '',
            section3Url: '',
            section4Url: '',
            section5Url: '',
            section6Url: '',
            fact1: "The World's First Quantum-Formulated Pizza",
            fact2: 'Thermally transformed carbohydrate matrix optimized by quantum algorithms',
            fact3: 'Pineapple: fundamentally incompatible in both classical and quantum realms',
            fact4: '10,000 years on classical supercomputer — seconds on quantum',
            fact5: 'Chemical-level simulation of every ingredient at molecular scale',
            fact6: '2030: Full Quantum Dining — quantum-enhanced strombolis and pizza pockets',
          }}
        />
      </Folder>
    </>
  );
};
