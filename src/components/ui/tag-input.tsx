import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Input } from './input';
import { Button } from './button';
import { X } from 'lucide-react';

const TagInput = ({
  onChange,
  defaultValue,
  onBlur,
  onTagRemoved,
}: {
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onTagRemoved?: (tag: string) => void;
}) => {
  const [tags, setTags] = useState<string[]>(
    defaultValue && defaultValue.length > 0 ? [...defaultValue.split(',')] : [],
  );
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      if (onChange) onChange([...tags, inputValue.trim()].join(','));
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      if (onChange) onChange(newTags.length ? newTags.join(',') : '');
      setTags(newTags);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    if (onChange) onChange(newTags.length ? newTags.join(',') : '');
    if (onTagRemoved) onTagRemoved(newTags.length ? newTags.join(',') : '');
    setTags(newTags);
  };

  return (
    <div className="visio-cms-flex visio-cms-items-center visio-cms-bg-dark-900 visio-cms-rounded-md  visio-cms-p-1 visio-cms-gap-2 visio-cms-w-full visio-cms-flex-wrap">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="visio-cms-flex visio-cms-w-max visio-cms-justify-between visio-cms-gap-1 visio-cms-items-center bg-slate-200 visio-cms-px-2 visio-cms-rounded-md visio-cms-text-xs visio-cms-bg-dark-800 visio-cms-h-6"
        >
          <p>{tag}</p>
          <Button
            type="button"
            variant={'ghost'}
            className="!visio-cms-p-0  visio-cms-rounded-full !visio-cms-bg-transparent"
            onClick={() => {
              handleTagRemove(tag);
            }}
          >
            <X className="visio-cms-text-white" size={16} />
          </Button>
        </div>
      ))}
      <Input
        className="visio-cms-border-none !visio-cms-w-max  !p-0 visio-cms-h-8  visio-cms-shadow-none"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Type and hit enter"
        onBlur={() => {
          if (onBlur) onBlur(tags.length ? tags.join(',') : '');
        }}
      />
    </div>
  );
};

export { TagInput };
