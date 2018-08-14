export enum todoStatus {
  notOcrProcessed = "NOT_OCR_PROCESSED",
  ocrProcessing = "OCR_PROCESSING",
  ocrProcessed = "OCR_PROCESSED",
  external = "EXTERNAL"
}

export enum status {
  notOcrProcessed = "NOT_OCR_PROCESSED",
    ocrProcessing = "OCR_PROCESSING",
    ocrProcessed = "OCR_PROCESSED",
    valid = "VALID",
    external = "EXTERNAL"
}
export enum identifier {
  isbn = "ISBN",
    issn = "ISSN",
    swb_ppn = "SWB_PPN",
    urlSbw = "URL_SWB",
    olc_ppn = "OLC_PPN",
    zdb_ppn = "ZDB_PPN",
    zdb_id = "ZDB_ID",
    ppn = "PPN",
    doi = "DOI",
    lccn = "LCCN",
    gndId = "GND_ID",
    swbGndId = "SWB_GND_ID",
    oclcId = "OCLC_ID",
    uri = "URI",
    urlCrossref = "URL_CROSSREF",

}
export enum agentIdentifier {
    orcid = "ORCID",
    gndid = "GND-ID",

}
export enum roleType {
  author = "AUTHOR",
    editor = "EDITOR",
    publisher = "PUBLISHER",
    congress = "CONGRESS",
    corporate = "CORPORATE"
}
export enum resourceType {
  book = "BOOK",
    bookChapter = "BOOK_CHAPTER",
    bookPart = "BOOK_PART",
    bookSection = "BOOK_SECTION",
    bookSeries = "BOOK_SERIES",
    bookSet = "BOOK_SET",
    bookTrack = "BOOK_TRACK",
    component = "COMPONENT",
    dataset = "DATASET",
    dissertation = "DISSERTATION",
    editedBook = "EDITED_BOOK",
    journalArticle = "JOURNAL_ARTICLE",
    journalIssue = "JOURNAL_ISSUE",
    journalVolume = "JOURNAL_VOLUME",
    journal = "JOURNAL",
    monograph = "MONOGRAPH",
    proceedingsArticle = "PROCEEDINGS_ARTICLE",
    proceedings = "PROCEEDINGS",
    referenceBook = "REFERENCE_BOOK",
    referenceEntry = "REFERENCE_ENTRY",
    reportSeries = "REPORT_SERIES",
    report = "REPORT",
    standardSeries = "STANDARD_SERIES",
    standard = "STANDARD"
}
export enum embodimentType {
  digital = "DIGITAL",
    print = "PRINT"
}
export enum externalSources {
  gScholar = "URL_GOOGLE_SCHOLAR",
    crossref = "URL_CROSSREF",
    swb = "URL_SWB",
    zdb = "URL_ZDB",
    olcSsg = "URL_OLCSSG",
    gvi = "ID_GVI",
    k10plus = "ID_K10PLUS"
}
