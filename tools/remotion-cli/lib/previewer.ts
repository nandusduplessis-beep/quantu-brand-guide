import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export function launchPreview(filePath: string): void {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const code = fs.readFileSync(absPath, 'utf-8');

  // Extract component name from export
  const exportMatch = code.match(/export\s+const\s+(\w+)/);
  const componentName = exportMatch ? exportMatch[1] : 'MyComposition';

  // Create a temporary Remotion project
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'remotion-preview-'));
  const srcDir = path.join(tmpDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  // Copy the component file
  fs.copyFileSync(absPath, path.join(srcDir, 'Composition.tsx'));

  // Create Root.tsx
  const rootContent = `import { Composition } from 'remotion';
import { ${componentName} } from './Composition';

export const RemotionRoot = () => {
  return (
    <Composition
      id="${componentName}"
      component={${componentName}}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
`;
  fs.writeFileSync(path.join(srcDir, 'Root.tsx'), rootContent);

  // Create index.ts entry point
  const indexContent = `import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';
registerRoot(RemotionRoot);
`;
  fs.writeFileSync(path.join(srcDir, 'index.ts'), indexContent);

  // Create package.json
  const pkgContent = {
    name: 'remotion-preview',
    version: '1.0.0',
    type: 'module',
    scripts: {
      studio: 'npx remotion studio src/index.ts',
    },
  };
  fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(pkgContent, null, 2));

  console.log(`\nPreview project created at: ${tmpDir}`);
  console.log(`Component: ${componentName}`);
  console.log(`\nTo preview, run:`);
  console.log(`  cd ${tmpDir}`);
  console.log(`  npm install remotion @remotion/cli @remotion/google-fonts @remotion/transitions`);
  console.log(`  npx remotion studio src/index.ts`);
  console.log(`\nOr from the project root:`);
  console.log(`  npx remotion studio --entry ${path.join(srcDir, 'index.ts')}`);
}
