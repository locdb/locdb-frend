import { BibliographicResource, ExternalResource } from './locdb'

export const MOCK_INTERNAL: BibliographicResource[] = [
  { 
    _id: '42',
    title: 'Learned helplessness in humans: Critique and reformula',
    type: 'journal',
    partOf: 'Journal of Abnormal Psychology',
    number: 87,
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
  },
  { 
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
  }
];

export const MOCK_EXTERNAL: ExternalResource[] = [
  {identifiers: [ {scheme: 'DOAJ', literalValue: '00example'} ],
    authors: ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
    title: 'Learned healthiness in humans: Critique and reformula',
    year: 1978, 
    publisher: 'Journal of Normal Psychology',
    number: 87,
    },

  {
    identifiers: [ {scheme: 'GoogleScholar', literalValue: '00example'} ],
    authors: ['Ioffe, Sergey', 'Szegedy, Christian'],
    title: 'Batch normalization: Accelerating deep network training by reducing internal covariate shift',
    year: 2015, 
    publisher: 'arXiv preprint arXiv:1502.03167',
    },

  {
    identifiers: [ {scheme: 'GoogleScholar', literalValue: '00example'} ],
    authors: ['Maddison, Chris J ', ' Mnih, Andriy ', ' Teh, Yee Whye'],
    title: 'The Concrete Distribution: A Continuous Relaxation of Discrete Random Variables',
    year: 2016, 
    publisher: 'arXiv preprint arXiv:1611.00712',
    },

  {
    identifiers: [ {scheme: 'GoogleScholar', literalValue: '00example'} ],
    authors: ['Jang, E.', 'Gu, S.', 'Poole, B.'],
    title: 'Categorical Reparameterization with Gumbel-Softmax',
    year: 2016, 
    publisher: 'arXiv preprint arXiv:1611.01144',
    }
];
