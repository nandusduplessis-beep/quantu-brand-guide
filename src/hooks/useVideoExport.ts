import { useState, useCallback } from 'react';
import type { CompositionKey } from '@/remotion/compositionSchema';

type ExportState = {
  status: 'idle' | 'rendering' | 'done' | 'error';
  progress: number;
  error?: string;
};

export const useVideoExport = () => {
  const [state, setState] = useState<ExportState>({ status: 'idle', progress: 0 });

  const exportVideo = useCallback(async (compositionId: CompositionKey, props: Record<string, any>) => {
    setState({ status: 'rendering', progress: 0 });

    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compositionId, props }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Render failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${compositionId}.mp4`;
      a.click();
      URL.revokeObjectURL(url);

      setState({ status: 'done', progress: 100 });
    } catch (err: any) {
      setState({ status: 'error', progress: 0, error: err.message });
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle', progress: 0 }), []);

  return { ...state, exportVideo, reset };
};
