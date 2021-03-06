import { Injectable } from '@angular/core';

// import { DropdownQuestion } from './question-dropdown';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';

import { enums, models, TypedResourceView, typedProperty } from '../../locdb';


/* We're dealing with raw property names:
 * we need some helpers to make them human readable and order them
 */
function humanReadable(property: string) {
  // split on _ and capitalize
  const components = property.split('_').map(c => c.charAt(0).toUpperCase() + c.substr(1))
  const nosnake = components.join(' ');
  // convert camel case to space seperated words
  const nocamel = nosnake.replace(/([a-z])([A-Z])/g, '$1 $2');
  return nocamel;
}

// Determines the sorting order of the dynamically generated fields
const PROPERTY_ORDER =
  [ typedProperty(enums.resourceType.journal, 'title'),
    typedProperty(enums.resourceType.journal, 'subtitle'),
    typedProperty(enums.resourceType.journalVolume, 'number'),
    typedProperty(enums.resourceType.bookSeries, 'title'),
    typedProperty(enums.resourceType.bookSeries, 'number'),
    typedProperty(enums.resourceType.bookSet, 'title'),
  ]

function getTypeForProperty(property: string) {
  // Also number fields sometimes hold strings...
  // if (property.endsWith('number')) { return 'number' }
  return ''; // default to text input field
}

@Injectable()
export class QuestionService {

  getQuestionsForResource(trv: TypedResourceView) {
    // depends on active view
    const foreignProperties = trv.getForeignProperties();
    const questions: QuestionBase<any>[] = []

    for (const fp of foreignProperties) {
      // we could use something like NumberQuestions for 'number' properties
      questions.push(
        new TextboxQuestion(
          { key: fp,
            label: humanReadable(fp),
            value: trv.data[fp],
            required: false,
            order: PROPERTY_ORDER.findIndex(x => x === fp),
            type: getTypeForProperty(fp)
          }
        )
      )
    }

      // new DropdownQuestion({
      //   key: 'brave',
      //   label: 'Bravery Rating',
      //   options: [
      //     {key: 'solid',  value: 'Solid'},
      //     {key: 'great',  value: 'Great'},
      //     {key: 'good',   value: 'Good'},
      //     {key: 'unproven', value: 'Unproven'}
      //   ],
      //   order: 3
      // }),

      // new TextboxQuestion({
      //   key: 'firstName',
      //   label: 'First name',
      //   value: 'Bombasto',
      //   required: true,
      //   order: 1
      // }),

      // new TextboxQuestion({
      //   key: 'emailAddress',
      //   label: 'Email',
      //   type: 'email',
      //   order: 2
      // })
    // ];

    return questions.sort((a, b) => a.order - b.order);
  }
}
