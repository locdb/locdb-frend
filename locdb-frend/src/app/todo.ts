export class TodoScan {
  _id: string;
  status: string;
}

export class Todo {
  _id: string;
  scans: [TodoScan];
  status?: string; // formally specified but not returned

}

export function is_ready(todo: Todo | TodoScan) {
  return todo.status === "OCR_PROCESSED";
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

