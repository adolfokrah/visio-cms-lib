import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { BoxSelect, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function GlobalBlocks() {
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const [search, setSearch] = useState<string>('');
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
  const deleteGlobalBlock = (id: string) => {
    setGlobalBlocks(globalBlocks.filter((block) => block.id !== id));
    setBlockToDelete(null);
  };

  return (
    <div className="visio-cms-border-t visio-cms-border-t-dark-900 visio-cms-pt-3 ">
      <div>
        <div className="visio-cms-mb-4 visio-cms-text-sm">Global Blocks</div>
        <Input
          placeholder="Search for block"
          className="visio-cms-mb-2"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>
      <div className="scrollbar-custom visio-cms-overflow-auto visio-cms-h-[calc(100vh-600px)]">
        <div className="visio-cms-text-purple-400">
          {globalBlocks
            .filter((globalBlock) => globalBlock?.name.toLowerCase().includes(search.toLowerCase()))
            .map(({ id, name, blockId }) => (
              <div
                key={id}
                className="visio-cms-flex visio-cms-group visio-cms-items-center visio-cms-gap-2 visio-cms-p-3 hover:visio-cms-bg-dark-700 visio-cms-rounded-md visio-cms-cursor-pointer"
                draggable={true} // Add draggable attribute
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.setData(
                    'application/block',
                    JSON.stringify({ globalBlockId: id, blockId, isGlobal: true }),
                  ); // Set the data to be transferred during drag
                }}
              >
                <BoxSelect size={16} />
                <GlobalBlockName name={name} id={id} />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => setBlockToDelete(id)}
                      variant={'ghost'}
                      className="visio-cms-bg-dark-800 visio-cms-text-white visio-cms-invisible group-hover:visio-cms-visible"
                    >
                      <TrashIcon size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the global block and unlink all
                        instances of this block.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="visio-cms-text-white">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteGlobalBlock(blockToDelete || '')}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const GlobalBlockName = ({ name, id }: { name: string; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const updateBlockName = (name: string) => {
    const block = globalBlocks.find((block) => block.name.toLowerCase() === name.toLowerCase() && block.id !== id);
    if (block) {
      toast.error('Block with the same name already exists');
      return;
    }
    setGlobalBlocks(globalBlocks.map((block) => (block.id === id ? { ...block, name } : block)));
    toast.success('Block name updated');
    setIsEditing(false);
  };

  return (
    <div
      className="visio-cms-flex-1  visio-cms-truncate visio-cms-whitespace-nowrap"
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <Input
          key={name}
          type="text"
          onBlur={(e) => updateBlockName(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && updateBlockName(e.currentTarget.value)}
          defaultValue={name}
        />
      ) : (
        name
      )}
    </div>
  );
};
