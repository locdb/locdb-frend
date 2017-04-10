import { ToDo } from './locdb';

// export const MOCK_TODOSCANS: any[] = [
//   { _id: "11", name: 'Journal-XY_Page-10' } ,
//   { _id: "12", name: 'Journal-XY_Page-42' } ,
//   { _id: "13", name: 'Journal-XY_Page-79' } ,
//   { _id: "14", name: 'Journal-XY_Page-113' } ,
//   { _id: "15", name: 'Journal-XY_Page-148' } ,
//   { _id: "16", name: 'Journal-XY_Page-196' } ,
//   { _id: "17", name: 'Journal-XY_Page-223' } ,
//   { _id: "18", name: 'Journal-XY_Page-240' } ,
//   { _id: "19", name: 'Journal-XY_Page-269' } ,
//   { _id: "20", name: 'Journal-XY_Page-300' }
// ];

export const MOCK_TODOBRS: ToDo[] =
[
  {
    '_id': '58d26b94a285f10778669ff5',
    'children': [
      {
        '_id': '58d26b94a285f10778669ffa',
        'scans': [
          {
            '_id': '58d26b94a285f10778669ffc',
            'status': 'OCR_PROCESSED'
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
            'status': 'NOT_OCR_PROCESSED'
          }
        ]
      }
    ]
  }
]
;
