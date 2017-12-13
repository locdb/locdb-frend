import { BibliographicResource, ProvenResource } from './locdb'

export const MOCK_INTERNAL: BibliographicResource[] = [
  new BibliographicResource({ 
    _id: '42',
    title: 'Learned helplessness in humans: Critique and reformula',
    type: 'journal',
    partOf: 'Journal of Abnormal Psychology',
    number: '87',
    publicationYear: '1989',
    embodiedAs: [{
      format: 'print',
      firstPage: 49,
      lastPage: 74,
    }],
    contributors: [
      {roleType: 'author', identifiers: [], heldBy: {nameString: 'Abramson, L.Y.', identifiers: []}},
      {roleType: 'author', identifiers: [], heldBy: {nameString: 'Seligman, M.E.P', identifiers: []}},
      {roleType: 'author', identifiers: [], heldBy: {nameString: 'Teasdale, J.D.', identifiers: []}},
    ]
  }),
  new BibliographicResource({ 
    _id: '43',
    title: 'Studien zum autoritären Charakter',
    type: 'Article',
    publicationYear: '1973',
    embodiedAs: [{
      format: 'print',
    }],
    contributors: [
      {roleType: 'author', identifiers: [],  heldBy: {nameString: 'Adorno, T.W.', identifiers: []}},
      {roleType: 'publisher', identifiers: [], heldBy: {nameString: 'Suhrkamp (Frankfurt)', identifiers: []}},
    ]
  })
];
