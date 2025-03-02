import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader } from 'lucide-react';
import { useSave } from '@/lib/hooks/useSave';

export default function SaveButton() {
  const { isSaving, isChanged, onSavePage, updatePageData, activePage } = useSave();

  return (
    <div className="visio-cms-justify-between visio-cms-items-center visio-cms-flex visio-cms-gap-2">
      <div className="visio-cms-flex visio-cms-items-center visio-cms-space-x-2">
        <Label htmlFor="auto-save">Auto save</Label>
        <Switch
          id="auto-save"
          checked={activePage?.autoSave || false}
          onCheckedChange={(checked) => {
            if (activePage) {
              updatePageData({ ...activePage, autoSave: checked });
            }
          }}
        />
      </div>
      <Button disabled={activePage?.autoSave || isSaving || !isChanged} onClick={() => onSavePage()}>
        {isSaving ? (
          <div className="visio-cms-flex visio-cms-items-center">
            <Loader size={16} className="visio-cms-animate-spin visio-cms-mr-2" />
            Saving...
          </div>
        ) : (
          'Save'
        )}
      </Button>
    </div>
  );
}
