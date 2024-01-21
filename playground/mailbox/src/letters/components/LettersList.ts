/* eslint-disable @typescript-eslint/ban-ts-comment */
//import { useSelector } from 'react-redux';
import { IState, ITriggers } from '../../_redux/types';
import { ComposeGrid } from '../../compose/components/ComposeGrid';
//import { useReflector } from '../../../../../packages/redux-react/dist/lib';
import './styles.less';
import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import { Reflexio } from '../../../../../packages/on-reflexio/lib/reflector';
import { ILetter } from '../interfaces/Letter.interface';
import { Text } from '../../../../__shared/ui/Text';
import { Sidebar } from '../../folders/components';
import { TextInput } from '../../../../__shared/ui/Input';
import { Search } from '../../../../__shared/ui/Svg/Search';
import {store, system} from '../../_redux/index';

const tree = new Tree({
  //@ts-ignore
  makeElement: (tag) => {
    if (tag === 'svg' || tag === 'path') {
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    } else {
      return document.createElement(tag);
    }
  },
  keyPrefix: 'sound'
});
const tags = new Tags(tree);
const reflexio = new Reflexio<ITriggers, IState>(store, system);
export const LettersList = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => {
      return {letters: state.letters?.lettersList?.data as Array<ILetter>,
      isLoading: state.letters?.lettersList?.loading as boolean,
    }},
    ['lettersList', 'saveLetter'],
    LettersList
  );

  return tags.root({
    onMount: () => {
      console.log('LETTERS MOUNT');
      trigger('lettersList', 'init', null);
      trigger('setContent', 'init', null);
    },
    onUpdate() {
        console.log('letters update');
    },
    attributes: {
      class: 'lettersListContainer',
    },
    tagName: 'div',
    child: [
      tags.div({
        child: ComposeGrid(),
      }),
      tags.div({
        className: 'letters-container',
        child: [
          tags.div({
            className: 'letters-search',
            child: TextInput(
              tags,
              {
                size: 'l',
                w: '750px',
                rightIcon: Search(tags, { size: 'l' }, 'letters_search_icon'),
              },
              'letters_search'
            ),
          }),
          tags.div({
            className: 'lettersList',
            child:
              state.letters && state.letters.length
                ? state.letters.map((l) =>
                    tags.div(
                      {
                        onClick: () =>
                          trigger('setContent', 'openFromList', {
                            body: l.body,
                            subject: l.subject,
                          }),
                        className: 'lettersListItem',
                        child: Text(
                          tags,
                          {
                            children: l.subject || '',
                            //className: 'lettersListItem',
                          },
                          `k${l.uid}`
                        ),
                      },
                      `wrap_${l.uid}`
                    )
                  )
                : Text(
                    tags,
                    {
                      children: 'LOADING...',
                    },
                    'load-L_text_key'
                  ),
          }),
        ],
      }),
    ],
  });
};
