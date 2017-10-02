export function str(obj: any) {
  if ('__str__' in obj) {
    return obj.__str__();
  } else if ('toString' in obj) {
    return obj.toString();
  } else {
    return obj as string;
  }
}
