import { useState } from 'react';
import { Player } from '@remotion/player';
import { useNavigate } from 'react-router-dom';
import { BrandIntro } from '@/remotion/compositions/BrandIntro';
import { LowerThird } from '@/remotion/compositions/LowerThird';
import { DataBarChart } from '@/remotion/compositions/DataBarChart';
import { TypewriterTitle } from '@/remotion/compositions/TypewriterTitle';
import { HighlightTagline } from '@/remotion/compositions/HighlightTagline';
import { BRAND } from '@/remotion/brand';
import { ArrowLeft, Play, Film } from 'lucide-react';

type CompositionKey = 'BrandIntro' | 'LowerThird' | 'DataBarChart' | 'TypewriterTitle' | 'HighlightTagline';

const compositions: Record<CompositionKey, {
  component: React.FC<any>;
  label: string;
  description: string;
  durationInFrames: number;
  defaultProps: Record<string, any>;
}> = {
  BrandIntro: {
    component: BrandIntro,
    label: 'Brand Intro',
    description: 'Animated brand title with tagline reveal',
    durationInFrames: 150,
    defaultProps: {
      title: BRAND.name,
      subtitle: BRAND.tagline,
    },
  },
  LowerThird: {
    component: LowerThird,
    label: 'Lower Third',
    description: 'Name and title overlay for video interviews',
    durationInFrames: 150,
    defaultProps: {
      name: 'Dr. Jane Smith',
      role: 'Quantum Market Intelligence Analyst',
    },
  },
  DataBarChart: {
    component: DataBarChart,
    label: 'Data Bar Chart',
    description: 'Animated bar chart for market data visualization',
    durationInFrames: 120,
    defaultProps: {
      title: 'Quantum Computing Market Growth',
      data: [
        { label: '2022', value: 8.6 },
        { label: '2023', value: 12.4 },
        { label: '2024', value: 18.2 },
        { label: '2025', value: 28.9 },
        { label: '2026', value: 42.1 },
      ],
    },
  },
  TypewriterTitle: {
    component: TypewriterTitle,
    label: 'Typewriter Title',
    description: 'Typewriter text reveal for headlines',
    durationInFrames: 180,
    defaultProps: {
      text: BRAND.tagline,
    },
  },
  HighlightTagline: {
    component: HighlightTagline,
    label: 'Highlight Tagline',
    description: 'Text with animated word highlight effect',
    durationInFrames: 120,
    defaultProps: {
      text: 'Empowering confident decisions that move the industry forward.',
      highlightWord: 'confident decisions',
    },
  },
};

const VideoStudio = () => {
  const navigate = useNavigate();
  const [activeComposition, setActiveComposition] = useState<CompositionKey>('BrandIntro');
  const comp = compositions[activeComposition];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#0aa0ab]" />
              <h1 className="text-xl font-bold">TQI Video Studio</h1>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            Powered by Remotion
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Composition list */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Compositions
            </h2>
            <div className="space-y-2">
              {(Object.entries(compositions) as [CompositionKey, typeof comp][]).map(
                ([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setActiveComposition(key)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      activeComposition === key
                        ? 'border-[#0aa0ab] bg-[#0aa0ab]/10 text-foreground'
                        : 'border-border hover:border-[#0aa0ab]/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Play className="w-3 h-3" />
                      <span className="font-medium text-sm">{value.label}</span>
                    </div>
                    <p className="text-xs mt-1 opacity-70">{value.description}</p>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Main - Player */}
          <div className="lg:col-span-3">
            <div className="rounded-xl overflow-hidden border border-border bg-black">
              <Player
                component={comp.component}
                inputProps={comp.defaultProps}
                durationInFrames={comp.durationInFrames}
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{ width: '100%' }}
                controls
                autoPlay
                loop
              />
            </div>

            <div className="mt-6 p-6 rounded-lg border border-border bg-card">
              <h3 className="text-lg font-semibold mb-2">{comp.label}</h3>
              <p className="text-muted-foreground text-sm mb-4">{comp.description}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>1920 x 1080</span>
                <span>30 fps</span>
                <span>{comp.durationInFrames} frames ({(comp.durationInFrames / 30).toFixed(1)}s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
