import { Injectable } from '@angular/core';

// import { DropdownQuestion } from './question-dropdown';
import { QuestionBase } from './question-base';
import { TextboxQuestion } from './question-textbox';

import { models, TypedResourceView } from '../../locdb';


/* We're dealing with raw property names:
 * we need some helpers to make them human readable and order them
 */
function humanReadable(property: string) {
  return property;
}

function getOrderForProperty(property: string) {
  if (property.endsWith('title')) { return 1 }
  if (property.endsWith('subtitle')) { return 2 }
  if (property.endsWith('number')) { return 3 }
  return 99; // default case
}

function getTypeForProperty(property: string) {
  if (property.endsWith('number')) { return 'number' }
  return ''; // default to text input field
}

@Injectable()
export class QuestionService {

  getQuestionsForResource(trv: TypedResourceView) {
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
            order: getOrderForProperty(fp),
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
