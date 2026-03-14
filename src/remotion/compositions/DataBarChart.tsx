import { loadFont } from '@remotion/google-fonts/Roboto';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND } from '../brand';

const { fontFamily } = loadFont('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

type DataPoint = {
  label: string;
  value: number;
};

type DataBarChartProps = {
  title: string;
  data: DataPoint[];
};

export const DataBarChart: React.FC<DataBarChartProps> = ({ title, data }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const maxValue = Math.max(...data.map((d) => d.value));
  const chartHeight = height - 320;

  // Title fade in
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.colors.deepNavy,
        padding: 80,
        display: 'flex',
        flexDirection: 'column',
        fontFamily,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 48,
          opacity: titleProgress,
        }}
      >
        <div
          style={{
            color: BRAND.colors.white,
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          {title}
        </div>
      </div>

      {/* Chart area */}
      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 24, paddingBottom: 60 }}>
        {data.map((item, i) => {
          const progress = spring({
            frame: frame - i * 6 - 15,
            fps,
            config: { damping: 18, stiffness: 80 },
          });

          const barHeight = (item.value / maxValue) * chartHeight * progress;

          return (
            <div
              key={item.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              {/* Value label */}
              <div
                style={{
                  color: BRAND.colors.quantumTeal,
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 8,
                  opacity: progress,
                }}
              >
                ${item.value}B
              </div>

              {/* Bar */}
              <div
                style={{
                  width: '70%',
                  height: barHeight,
                  background: `linear-gradient(to top, ${BRAND.colors.resonanceBlue}, ${BRAND.colors.quantumTeal})`,
                  borderRadius: '8px 8px 0 0',
                  opacity: progress,
                }}
              />

              {/* Label */}
              <div
                style={{
                  color: BRAND.colors.coolGray,
                  fontSize: 20,
                  marginTop: 12,
                  opacity: progress,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
