import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

type DataPoint = { label: string; value: number };

type DataTableEditorProps = {
  label: string;
  value: DataPoint[];
  onChange: (data: DataPoint[]) => void;
};

export const DataTableEditor: React.FC<DataTableEditorProps> = ({ label, value, onChange }) => {
  const updateRow = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...value];
    if (field === 'value') {
      updated[index] = { ...updated[index], value: parseFloat(val) || 0 };
    } else {
      updated[index] = { ...updated[index], label: val };
    }
    onChange(updated);
  };

  const addRow = () => onChange([...value, { label: '', value: 0 }]);

  const removeRow = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-2">
        {value.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={row.label}
              onChange={(e) => updateRow(i, 'label', e.target.value)}
              placeholder="Label"
              className="flex-1 h-8 text-xs"
            />
            <Input
              type="number"
              value={row.value}
              onChange={(e) => updateRow(i, 'value', e.target.value)}
              placeholder="Value"
              className="w-20 h-8 text-xs"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeRow(i)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={addRow}>
        <Plus className="w-3 h-3 mr-1" /> Add Row
      </Button>
    </div>
  );
};
