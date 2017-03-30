import { Todo, TodoScan, TodoBR } from './todo';

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

export const MOCK_TODOBRS: TodoBR[] = [
  {
    "_id": "58d0f859970e5c3367db7ced",
    "parts": [
      {
        "_id": "58d0f859970e5c3367db7cf2",
        "scans": [
          {
            "_id": "58d0f859970e5c3367db7cf3",
            "status": "NOT_OCR_PROCESSED"
          }
        ]
      },
      {
        "_id": "58d0fa9418feb833c25f1530",
        "scans": [
          {
            "_id": "58d0fa9418feb833c25f1531",
            "status": "NOT_OCR_PROCESSED"
          }
        ]
      }
    ]
  },
  {
    "_id": "58d0f859970e5c3367db7ced",
    "parts": [
      {
        "_id": "58d0f859970e5c3367db7cf2",
        "scans": [
          {
            "_id": "58d0f859970e5c3367db7cf3",
            "status": "OCR_PROCESSED"
          }
        ]
      },
      {
        "_id": "58d0fa9418feb833c25f1530",
        "scans": [
          {
            "_id": "58d0fa9418feb833c25f1531",
            "status": "NOT_OCR_PROCESSED"
          }
        ]
      }
    ]
  }
];
