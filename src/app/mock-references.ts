import { Citation } from './citation';

export const REFERENCES: Citation[] = [
  new Citation(42,
    'LOCDB',
    Citation.REFTYPES[1],
    ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
    'Learned helplessness in hu-mans: Critique and reformula',
    1978, 'Journal of Abnormal Psychology', null, 87, '49-74'),

  new Citation(44, 'LOCDB', Citation.REFTYPES[0], ['Adorno, T.W.'],
    'Studien zum autoritären Charakter', 1973,
    'Suhrkamp (Frankfurt)'),
];

export const REFERENCES_ALT: Citation[] = [
  new Citation(44, 'LOCDB', Citation.REFTYPES[0], ['Adorno, T.W.'],
    'Studien zum autoritären Charakter', 1973,
    'Suhrkamp (Frankfurt)')
];

export const EXTERNAL_REFERENCES: Citation[] = [
  new Citation(43,
    'DOAJ',
    Citation.REFTYPES[1],
    ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
    'Learned healthiness in humans: Critique and reformula',
    1978, 'Journal of Normal Psychology', null, 87, '46-78'),

  new Citation(30,
    'GoogleScholar',
    Citation.REFTYPES[0],
    ['Ioffe, Sergey', 'Szegedy, Christian'],
    'Batch normalization: Accelerating deep network training by reducing internal covariate shift',
    2015, 'arXiv preprint arXiv:1502.03167', null, null, null),

  new Citation(32,
    'GoogleScholar',
    Citation.REFTYPES[0],
    ['Maddison, Chris J ', ' Mnih, Andriy ', ' Teh, Yee Whye'],
    'The Concrete Distribution: A Continuous Relaxation of Discrete Random Variables', 2016,
    'arXiv preprint arXiv:1611.00712'),

  new Citation(31,
    'GoogleScholar',
    Citation.REFTYPES[0],
    ['Jang, E.', 'Gu, S.', 'Poole, B.'],
    'Categorical Reparameterization with Gumbel-Softmax',
    2016, 'arXiv preprint arXiv:1611.01144', null, null, null),
];
