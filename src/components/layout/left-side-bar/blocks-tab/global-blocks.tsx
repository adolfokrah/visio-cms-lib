import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { BoxSelect, EditIcon, TrashIcon } from 'lucide-react';
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
import { useTabState } from '@/lib/states/useTabsState';
import { usePagesState } from '@/lib/states/usePagesState';
import { updateOrInsertProjectConfig } from '@/lib/utils';

export default function GlobalBlocks() {
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const [search, setSearch] = useState<string>('');
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
  const { tabs, setTabs } = useTabState();
  const { pages, setPages } = usePagesState();

  const deleteGlobalBlock = async (id: string) => {
    try {
      const newGlobalBlocks = globalBlocks.filter((block) => block.id !== id);
      await updateOrInsertProjectConfig({ global_blocks: newGlobalBlocks });
      setTabs([...tabs.filter((tab) => tab.id !== id)]);
      setGlobalBlocks(newGlobalBlocks);
      setBlockToDelete(null);
    } catch (error) {
      toast.error('Failed to delete global block');
    }
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
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tabs.find((tab) => tab.id === id)) {
                      setTabs([...tabs.map((tab) => ({ ...tab, active: tab.id === id }))]);
                      return;
                    }

                    setTabs([
                      ...tabs.map((tab) => ({ ...tab, active: false })),
                      { id, type: 'globalBlock', name, active: true },
                    ]);
                    setPages(pages.map((page) => ({ ...page, active: false })));
                  }}
                  variant={'ghost'}
                  className="visio-cms-bg-dark-800 visio-cms-text-white visio-cms-invisible group-hover:visio-cms-visible"
                >
                  <EditIcon size={16} />
                </Button>

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
  const { tabs, setTabs } = useTabState();
  const { globalBlocks, setGlobalBlocks } = useProjectConfigurationState();
  const updateBlockName = async (name: string) => {
    try {
      const block = globalBlocks.find((block) => block.name.toLowerCase() === name.toLowerCase() && block.id !== id);

      if (block) {
        toast.error('Block with the same name already exists');
        return;
      }
      const newGlobalBlocks = globalBlocks.map((block) => (block.id === id ? { ...block, name } : block));

      await updateOrInsertProjectConfig({ global_blocks: newGlobalBlocks });
      setTabs(tabs.map((tab) => (tab.id === id ? { ...tab, name } : tab)));
      setGlobalBlocks(newGlobalBlocks);
      toast.success('Block name updated');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update block name');
    }
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
