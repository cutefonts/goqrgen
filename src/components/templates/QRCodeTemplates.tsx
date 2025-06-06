import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Template {
  id: string;
  name: string;
  preview: string;
  settings: any;
}

interface QRCodeTemplatesProps {
  onSelectTemplate: (settings: any) => void;
}

const templates: Template[] = [
  {
    id: 'modern',
    name: 'Modern Business',
    preview: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    settings: {
      fgColor: '#6366F1',
      bgColor: '#FFFFFF',
      cornerRadius: 8,
      style: 'rounded'
    }
  },
  {
    id: 'creative',
    name: 'Creative Design',
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    settings: {
      fgColor: '#EC4899',
      bgColor: '#FFFFFF',
      cornerRadius: 12,
      style: 'dots'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg',
    settings: {
      fgColor: '#000000',
      bgColor: '#FFFFFF',
      cornerRadius: 0,
      style: 'squares'
    }
  }
];

const SortableTemplate = ({ template }: { template: Template }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: template.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-move"
    >
      <img
        src={template.preview}
        alt={template.name}
        className="w-full h-32 object-cover"
      />
      <div className="p-4">
        <h3 className="font-medium text-gray-800 dark:text-white">
          {template.name}
        </h3>
      </div>
    </div>
  );
};

const QRCodeTemplates: React.FC<QRCodeTemplatesProps> = ({ onSelectTemplate }) => {
  const [items, setItems] = React.useState(templates);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Design Templates
      </h2>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(i => i.id)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template.settings)}
              >
                <SortableTemplate template={template} />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Drag and drop to reorder templates. Click to apply.
      </p>
    </div>
  );
};

export default QRCodeTemplates;