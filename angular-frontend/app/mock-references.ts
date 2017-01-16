import { Citation } from './citation';



export const REFERENCES: Citation[] = [
  new Citation(42,
    'LOCDB',
    Citation.REFTYPES[1],
    ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
    'Learned helplessness in hu-mans: Critique and reformula',
    1978, 'Journal of Abnormal Psychology', null, 87, '49-74'),

  new Citation(43,
    'DOAJ',
    Citation.REFTYPES[1],
    ['Abramson, L.Y.', 'Seligman, M.E.P.', 'Teasdale, J.D.'],
    'Learned healthiness in humans: Critique and reformula',
    1978, 'Journal of Normal Psychology', null, 87, '46-78'),

  new Citation(44, 'DOAJ', Citation.REFTYPES[0], ['Adorno, T.W.'],
    'Studien zum autoritären Charakter', 1973,
    'Suhrkamp (Frankfurt)')

];
