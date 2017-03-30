export class TodoScan {
  _id: string;
  status: string;
}

export class Todo {
  _id: string;
  status?: string; // formally specified but not returned
  scans: [TodoScan];

  isReady() {
    return this.status === "OCR_PROCESSED";
  }
}

export class TodoBR {
  _id: string;
  parts: [Todo]
}

// export class TodoOrigBR {
//   _id: string;
//   parts: [
//     {
//       _id: string,
//       status?: string,
//       scans: [
//         {
//           _id: string,
//           status: string
//         }
//       ]
//     }
//   ];
// }

