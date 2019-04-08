import { enums, enum_values, models } from '../locdb';

const REQUIRED_IDENTIFIERS = {};
REQUIRED_IDENTIFIERS[enums.resourceType.journal] = [enums.identifier.zdb_id];
REQUIRED_IDENTIFIERS[enums.resourceType.journalArticle] = [enums.identifier.doi];
REQUIRED_IDENTIFIERS[enums.resourceType.bookChapter] = [enums.identifier.k10plusId, enums.identifier.doi];
REQUIRED_IDENTIFIERS[enums.resourceType.proceedingsArticle] = [enums.identifier.k10plusId, enums.identifier.doi];
REQUIRED_IDENTIFIERS[enums.resourceType.monograph] = [enums.identifier.k10plusId];
REQUIRED_IDENTIFIERS[enums.resourceType.book] = [enums.identifier.k10plusId];
export { REQUIRED_IDENTIFIERS };



/** When identifier belongs to container, page numbers are mandatory */
export function requiresPageNumbers(type: enums.resourceType | string, scheme: enums.identifier | string) {
  if (type === enums.resourceType.bookChapter && scheme === enums.identifier.k10plusId) { return true };
  if (type === enums.resourceType.proceedingsArticle && scheme === enums.identifier.k10plusId) { return true };
  return false;
}
