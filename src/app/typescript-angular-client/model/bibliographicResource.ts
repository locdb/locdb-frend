/**
 * LOC-DB Central Component
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AgentRole } from './agentRole';
import { BibliographicEntry } from './bibliographicEntry';
import { Identifier } from './identifier';
import { ResourceEmbodiment } from './resourceEmbodiment';


export interface BibliographicResource {
    _id?: string;
    journal_identifiers?: Array<Identifier>;
    journalVolume_identifiers?: Array<Identifier>;
    journalIssue_identifiers?: Array<Identifier>;
    journalArticle_identifiers?: Array<Identifier>;
    monograph_identifiers?: Array<Identifier>;
    editedBook_identifiers?: Array<Identifier>;
    bookSeries_identifiers?: Array<Identifier>;
    bookSet_identifiers?: Array<Identifier>;
    bookChapter_identifiers?: Array<Identifier>;
    bookSection_identifiers?: Array<Identifier>;
    bookPart_identifiers?: Array<Identifier>;
    bookTrack_identifiers?: Array<Identifier>;
    component_identifiers?: Array<Identifier>;
    dissertation_identifiers?: Array<Identifier>;
    proceedingsArticle_identifiers?: Array<Identifier>;
    proceedings_identifiers?: Array<Identifier>;
    dataset_identifiers?: Array<Identifier>;
    report_identifiers?: Array<Identifier>;
    reportSeries_identifiers?: Array<Identifier>;
    book_identifiers?: Array<Identifier>;
    referenceBook_identifiers?: Array<Identifier>;
    referenceEntry_identifiers?: Array<Identifier>;
    standard_identifiers?: Array<Identifier>;
    standardSeries_identifiers?: Array<Identifier>;
    type: string;
    journal_title?: string;
    journalVolume_title?: string;
    journalIssue_title?: string;
    journalArticle_title?: string;
    monograph_title?: string;
    editedBook_title?: string;
    bookSeries_title?: string;
    bookSet_title?: string;
    bookChapter_title?: string;
    bookSection_title?: string;
    bookPart_title?: string;
    bookTrack_title?: string;
    component_title?: string;
    report_title?: string;
    proceedingsArticle_title?: string;
    proceedings_title?: string;
    dataset_title?: string;
    reportSeries_title?: string;
    book_title?: string;
    referenceBook_title?: string;
    referenceEntry_title?: string;
    standard_title?: string;
    standardSeries_title?: string;
    editedBook_subtitle?: string;
    report_subtitle?: string;
    dissertation_subtitle?: string;
    proceedingsArticle_subtitle?: string;
    standard_subtitle?: string;
    standardSeries_subtitle?: string;
    journal_subtitle?: string;
    journalArticle_subtitle?: string;
    bookSeries_subtitle?: string;
    monograph_subtitle?: string;
    bookSet_subtitle?: string;
    bookPart_subtitle?: string;
    bookChapter_subtitle?: string;
    bookSection_subtitle?: string;
    bookTrack_subtitle?: string;
    component_subtitle?: string;
    proceedings_subtitle?: string;
    dataset_subtitle?: string;
    reportSeries_subtitle?: string;
    book_subtitle?: string;
    referenceBook_subtitle?: string;
    referenceEntry_subtitle?: string;
    monograph_edition?: string;
    editedBook_edition?: string;
    dissertation_edition?: string;
    proceedings_edition?: string;
    report_edition?: string;
    book_edition?: string;
    referenceBook_edition?: string;
    standard_edition?: string;
    journalVolume_number?: string;
    journalIssue_number?: string;
    journalArticle_number?: string;
    bookPart_number?: string;
    monograph_number?: string;
    editedBook_number?: string;
    component_number?: string;
    bookSet_number?: string;
    bookChapter_number?: string;
    bookSection_number?: string;
    bookSeries_number?: string;
    bookTrack_number?: string;
    proceedings_number?: string;
    report_number?: string;
    book_number?: string;
    standard_number?: string;
    referenceBook_number?: string;
    referenceEntry_number?: string;
    journal_contributors?: Array<AgentRole>;
    report_contributors?: Array<AgentRole>;
    journalVolume_contributors?: Array<AgentRole>;
    journalIssue_contributors?: Array<AgentRole>;
    journalArticle_contributors?: Array<AgentRole>;
    monograph_contributors?: Array<AgentRole>;
    editedBook_contributors?: Array<AgentRole>;
    bookSeries_contributors?: Array<AgentRole>;
    proceedingsArticle_contributors?: Array<AgentRole>;
    bookSet_contributors?: Array<AgentRole>;
    bookChapter_contributors?: Array<AgentRole>;
    dataset_contributors?: Array<AgentRole>;
    bookTrack_contributors?: Array<AgentRole>;
    component_contributors?: Array<AgentRole>;
    dissertation_contributors?: Array<AgentRole>;
    proceedings_contributors?: Array<AgentRole>;
    reportSeries_contributors?: Array<AgentRole>;
    book_contributors?: Array<AgentRole>;
    referenceBook_contributors?: Array<AgentRole>;
    referenceEntry_contributors?: Array<AgentRole>;
    standard_contributors?: Array<AgentRole>;
    standardSeries_contributors?: Array<AgentRole>;
    journalArticle_publicationDate?: string;
    journalIssue_publicationDate?: string;
    journalVolume_publicationDate?: string;
    journal_publicationDate?: string;
    monograph_publicationDate?: string;
    report_publicationDate?: string;
    reportSeries_publicationDate?: string;
    bookChapter_publicationDate?: string;
    bookSeries_publicationDate?: string;
    bookSet_publicationDate?: string;
    editedBook_publicationDate?: string;
    dissertation_publicationDate?: string;
    proceedingsArticle_publicationDate?: string;
    dataset_publicationDate?: string;
    proceedings_publicationDate?: string;
    book_publicationDate?: string;
    referenceBook_publicationDate?: string;
    referenceEntry_publicationDate?: string;
    standard_publicationDate?: string;
    standardSeries_publicationDate?: string;
    bookPart_publicationDate?: string;
    bookSection_publicationDate?: string;
    bookTrack_publicationDate?: string;
    component_publicationDate?: string;
    status?: string;
    parts?: Array<BibliographicEntry>;
    partOf?: string;
    cites?: Array<string>;
    monograph_embodiedAs?: Array<ResourceEmbodiment>;
    editedBook_embodiedAs?: Array<ResourceEmbodiment>;
    bookSeries_embodiedAs?: Array<ResourceEmbodiment>;
    bookSet_embodiedAs?: Array<ResourceEmbodiment>;
    bookPart_embodiedAs?: Array<ResourceEmbodiment>;
    bookTrack_embodiedAs?: Array<ResourceEmbodiment>;
    component_embodiedAs?: Array<ResourceEmbodiment>;
    dissertation_embodiedAs?: Array<ResourceEmbodiment>;
    proceedingsArticle_embodiedAs?: Array<ResourceEmbodiment>;
    proceedings_embodiedAs?: Array<ResourceEmbodiment>;
    journal_embodiedAs?: Array<ResourceEmbodiment>;
    journalVolume_embodiedAs?: Array<ResourceEmbodiment>;
    journalIssue_embodiedAs?: Array<ResourceEmbodiment>;
    journalArticle_embodiedAs?: Array<ResourceEmbodiment>;
    dataset_embodiedAs?: Array<ResourceEmbodiment>;
    report_embodiedAs?: Array<ResourceEmbodiment>;
    reportSeries_embodiedAs?: Array<ResourceEmbodiment>;
    book_embodiedAs?: Array<ResourceEmbodiment>;
    referenceBook_embodiedAs?: Array<ResourceEmbodiment>;
    referenceEntry_embodiedAs?: Array<ResourceEmbodiment>;
    standard_embodiedAs?: Array<ResourceEmbodiment>;
    standardSeries_embodiedAs?: Array<ResourceEmbodiment>;
    source?: string;
}
