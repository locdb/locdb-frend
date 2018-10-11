import { Metadata, TypedResourceView, enums  } from './locdb'

const br1 = new TypedResourceView({_id: '42', type: enums.resourceType.journalArticle});
br1.title = 'Learned helplessness in humans: Critique and reformula';
br1.publicationDate = new Date('1989');
br1.contributors = [
      {roleType: 'author', identifiers: [], heldBy: {nameString: 'Abramson, L.Y.', identifiers: []}},
      {roleType: 'author', identifiers: [], heldBy: {nameString: 'Seligman, M.E.P', identifiers: []}},
      {roleType: 'author', identifiers: [], heldBy: {nameString: 'Teasdale, J.D.', identifiers: []}},
];

const br2 = new TypedResourceView({_id: '43', type: enums.resourceType.monograph});
br2.title = 'Studien zum autoritaeren Charakter';
br2.publicationDate = new Date('1973');
br2.embodiedAs = [{format: 'print'}];
br2.contributors = [
      {roleType: 'author', identifiers: [],  heldBy: {nameString: 'Adorno, T.W.', identifiers: []}},
      {roleType: 'publisher', identifiers: [], heldBy: {nameString: 'Suhrkamp (Frankfurt)', identifiers: []}},
    ];


export const MOCK_INTERNAL: TypedResourceView[] = [br1, br2];
