import { CategoryNode } from '@/types/catalog';

export const mockCategories: CategoryNode[] = [
  {
    id: '1',
    name: 'Растения',
    parentId: null,
    children: [],
    level: 0,
    isExpanded: false,
  },
  {
    id: '2',
    name: 'Горшки',
    parentId: null,
    children: [],
    level: 0,
    isExpanded: false,
  },
  {
    id: '3',
    name: 'Удобрения',
    parentId: null,
    children: [],
    level: 0,
    isExpanded: false,
  },
  {
    id: '4',
    name: 'Инструменты',
    parentId: null,
    children: [
      {
        id: '5',
        name: 'Лейки',
        parentId: '4',
        children: [],
        level: 1,
        isExpanded: false,
      },
      {
        id: '6',
        name: 'Секаторы',
        parentId: '4',
        children: [
          {
            id: '7',
            name: 'Профессиональные секаторы',
            parentId: '6',
            children: [],
            level: 2,
            isExpanded: false,
          },
        ],
        level: 1,
        isExpanded: false,
      },
    ],
    level: 0,
    isExpanded: false,
  },
];