import { ToDo, ToDoStatus } from './locdb';

export const MOCK_TODOBRS: ToDo[] =
  [
  {
    '_id': '58d26b94a285f10778669ff5',
    'scans': [
      {
        '_id': '54d26b85a285f10778669ffc',
        'status': ToDoStatus.ocr
      }
    ],
    'children': [
      {
        '_id': '58d26b94a285f10778669ffa',
        'scans': [
          {
            '_id': '58d26b94a285f10778669ffc',
            'status': ToDoStatus.ocr
          }
        ]
      }
    ]
      },
      {
        '_id': '58e03947d6c893087e17d1a3',
        'children': [
          {
            '_id': '58e03947d6c893087e17d1a5',
            'scans': [
              {
                '_id': '58e03947d6c893087e17d1a7',
                'status': ToDoStatus.nocr
              }
            ]
          }
        ]
      }
]
;
