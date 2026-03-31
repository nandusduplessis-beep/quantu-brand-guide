import { useState, useCallback } from 'react';
import { Player } from '@remotion/player';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Film, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoExport } from '@/hooks/useVideoExport';
import { compositionRegistry, type CompositionKey } from '@/remotion/compositionSchema';
import { PropsEditor } from '@/components/video-studio/PropsEditor';
import { ScrollArea } from '@/components/ui/scroll-area';

const COMPOSITION_KEYS = Object.keys(compositionRegistry) as CompositionKey[];

// Initialize props state from defaults
const initPropsState = () => {
  const state: Record<CompositionKey, Record<string, any>> = {} as any;
  for (const key of COMPOSITION_KEYS) {
    state[key] = { ...compositionRegistry[key].defaultProps };
  }
  return state;
};

const VideoStudio = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<CompositionKey>('BrandIntro');
  const [propsState, setPropsState] = useState(initPropsState);

  const { status, error, exportVideo, reset: resetExport } = useVideoExport();
  const comp = compositionRegistry[activeKey];
  const currentProps = propsState[activeKey];

  const handlePropChange = useCallback(
    (key: string, value: any) => {
      setPropsState((prev) => ({
        ...prev,
        [activeKey]: { ...prev[activeKey], [key]: value },
      }));
    },
    [activeKey],
  );

  const handleReset = useCallback(() => {
    setPropsState((prev) => ({
      ...prev,
      [activeKey]: { ...compositionRegistry[activeKey].defaultProps },
    }));
  }, [activeKey]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#0aa0ab]" />
              <h1 className="text-xl font-bold">TQI Video Studio</h1>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">Powered by Remotion</span>
        </div>
      </header>

      {/* 3-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Composition selector */}
        <div className="w-56 shrink-0 border-r border-border p-4 overflow-y-auto">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Templates
          </h2>
          <div className="space-y-1.5">
            {COMPOSITION_KEYS.map((key) => {
              const entry = compositionRegistry[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveKey(key)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                    activeKey === key
                      ? 'border-[#0aa0ab] bg-[#0aa0ab]/10 text-foreground'
                      : 'border-transparent hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-3 h-3 shrink-0" />
                    <span className="font-medium text-sm">{entry.label}</span>
                  </div>
                  <p className="text-xs mt-0.5 opacity-60 pl-5">{entry.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Player */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-w-0">
          <div className="w-full max-w-4xl rounded-xl overflow-hidden border border-border bg-black">
            <Player
              component={comp.component}
              inputProps={currentProps}
              durationInFrames={comp.durationInFrames}
              fps={30}
              compositionWidth={comp.width}
              compositionHeight={comp.height}
              style={{ width: '100%' }}
              controls
              autoPlay
              loop
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{comp.width} x {comp.height}</span>
              <span>30 fps</span>
              <span>
                {comp.durationInFrames} frames ({(comp.durationInFrames / 30).toFixed(1)}s)
              </span>
            </div>
            <div className="ml-auto">
              {status === 'idle' && (
                <Button
                  size="sm"
                  className="bg-[#0aa0ab] hover:bg-[#0aa0ab]/80"
                  onClick={() => exportVideo(activeKey, currentProps)}
                >
                  <Download className="w-4 h-4 mr-1" /> Export MP4
                </Button>
              )}
              {status === 'rendering' && (
                <Button size="sm" disabled>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Rendering...
                </Button>
              )}
              {status === 'done' && (
                <Button size="sm" variant="outline" onClick={resetExport}>
                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Downloaded
                </Button>
              )}
              {status === 'error' && (
                <Button size="sm" variant="destructive" onClick={resetExport}>
                  <AlertCircle className="w-4 h-4 mr-1" /> {error || 'Failed'} — Retry
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Props editor */}
        <div className="w-72 shrink-0 border-l border-border">
          <ScrollArea className="h-full">
            <div className="p-4">
              <PropsEditor
                composition={comp}
                values={currentProps}
                onChange={handlePropChange}
                onReset={handleReset}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default VideoStudio;
