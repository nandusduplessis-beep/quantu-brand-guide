import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { DataTableEditor } from './DataTableEditor';
import type { CompositionEntry } from '@/remotion/compositionSchema';

type PropsEditorProps = {
  composition: CompositionEntry;
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
};

export const PropsEditor: React.FC<PropsEditorProps> = ({ composition, values, onChange, onReset }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Edit</h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReset}>
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>

      {composition.fields.map((field) => {
        const val = values[field.key];

        if (field.type === 'image') {
          return (
            <ImageUploadField
              key={field.key}
              label={field.label}
              value={val}
              onChange={(v) => onChange(field.key, v)}
            />
          );
        }

        if (field.type === 'dataTable') {
          return (
            <DataTableEditor
              key={field.key}
              label={field.label}
              value={val || []}
              onChange={(v) => onChange(field.key, v)}
            />
          );
        }

        if (field.type === 'select' && field.options) {
          return (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-medium">{field.label}</Label>
              <select
                value={val || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === 'textarea') {
          return (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-medium">{field.label}</Label>
              <Textarea
                value={val || ''}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="text-sm min-h-[80px]"
              />
            </div>
          );
        }

        return (
          <div key={field.key} className="space-y-2">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Input
              value={val || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="text-sm h-9"
            />
          </div>
        );
      })}
    </div>
  );
};
