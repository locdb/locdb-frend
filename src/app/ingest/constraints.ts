import { enums, enum_values, models } from '../locdb';

const REQUIRED_IDENTIFIERS = {};
REQUIRED_IDENTIFIERS[enums.resourceType.journal] = [enums.identifier.zdb_id];
REQUIRED_IDENTIFIERS[enums.resourceType.journalArticle] = [enums.identifier.doi, enums.identifier.olc_ppn];
REQUIRED_IDENTIFIERS[enums.resourceType.bookChapter] = [enums.identifier.swb_ppn, enums.identifier.doi];
REQUIRED_IDENTIFIERS[enums.resourceType.proceedingsArticle] = [enums.identifier.swb_ppn, enums.identifier.doi];
REQUIRED_IDENTIFIERS[enums.resourceType.monograph] = [enums.identifier.swb_ppn];
REQUIRED_IDENTIFIERS[enums.resourceType.book] = [enums.identifier.swb_ppn];
export { REQUIRED_IDENTIFIERS };



/** When identifier belongs to container, page numbers are mandatory */
export function requiresPageNumbers(type: enums.resourceType | string, scheme: enums.identifier | string) {
  if (type === enums.resourceType.bookChapter && scheme === enums.identifier.swb_ppn) { return true };
  if (type === enums.resourceType.proceedingsArticle && scheme === enums.identifier.swb_ppn) { return true };
  return false;
}
