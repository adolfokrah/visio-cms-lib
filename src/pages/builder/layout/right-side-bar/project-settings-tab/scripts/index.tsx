import { Button } from '@/components/ui/button';
import CodeTag from '@/components/ui/code-tag';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowUpRight, Loader } from 'lucide-react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { useState } from 'react';
import { HTML_SECTIONS } from '@/lib/constants';
import { useProjectConfigurationState } from '@/lib/states/useProjectConfigState';
import { toast } from 'sonner';
import { updateOrInsertProjectConfig } from '@/lib/utils';

export default function ScriptTag({ section }: { section: (typeof HTML_SECTIONS)[0] }) {
  const { scripts, setScripts } = useProjectConfigurationState();
  const [code, setCode] = useState(scripts[section.name as 'body' | 'head'] || '');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeChanged, setCodeChanged] = useState(false);

  const updateProjectScripts = async () => {
    try {
      setLoading(true);
      await updateOrInsertProjectConfig({ scripts: { ...scripts, [section.name]: code } });
      setScripts({ ...scripts, [section.name]: code });
      setOpen(false);
      setCodeChanged(false);
    } catch (error) {
      toast.error('Failed to update project scripts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button
            variant={'ghost'}
            className="visio-cms-w-full visio-cms-bg-dark-900 visio-cms-h-9 hover:!visio-cms-bg-dark-700 visio-cms-flex visio-cms-justify-between visio-cms-mb-2"
          >
            {section.title}
            <ArrowUpRight size={15} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="!visio-cms-max-w-4xl">
        <DialogHeader>
          <DialogTitle>Insert script </DialogTitle>
          <DialogDescription>
            Insert script in {section.title}{' '}
            <CodeTag className="visio-cms-text-primary">{section.name === 'body' ? '</body>' : '<head>'}</CodeTag>
          </DialogDescription>
        </DialogHeader>
        <div className="visio-cms-overflow-auto scrollbar-custom visio-cms-h-[calc(100vh-500px)]">
          <CodeEditor
            language="javascript"
            value={code}
            onChange={(env) => {
              setCode(env.target.value);
              setCodeChanged(true);
            }}
            padding={24}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              backgroundColor: '#1E1E1E',
              borderRadius: 4,
              color: '#FFF',
            }}
          />
        </div>
        <DialogFooter>
          <Button disabled={!codeChanged} onClick={updateProjectScripts}>
            {loading ? <Loader size={16} className="visio-cms-animate-spin" /> : ' Insert Script'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
