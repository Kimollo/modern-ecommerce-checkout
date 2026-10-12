import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../lib/styles';

export interface AccordionItem {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIds, setOpenIds] = useState<string[]>(() => (items[0] ? [items[0].id] : []));

  const toggle = (id: string) => {
    setOpenIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="divide-y divide-stone-200 border-y border-stone-200">
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const panelId = `${item.id}-panel`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center gap-3 py-4 text-left text-sm font-medium text-stone-900"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className="text-stone-500" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="flex-1">{item.title}</span>
                <ChevronDown className={cx('size-4 text-stone-500 transition-transform', open && 'rotate-180')} />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={cx('grid transition-[grid-template-rows] duration-300 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
            >
              <div className="overflow-hidden">
                <div className="pb-4 pl-7">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
