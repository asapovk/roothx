/* eslint-disable @typescript-eslint/ban-ts-comment */
//import { useSelector } from 'react-redux';
import { IState } from '../../_redux/types';
import { ComposeGrid } from '../../compose/components/ComposeGrid';
//import { useReflector } from '../../../../../packages/redux-react/dist/lib';
import './styles.less';
import { Tree } from '../../../../../packages/core/lib/NTree';
import { Tags } from '../../../../../packages/core/lib/Tags';
import { Reflexio } from '../../root-redux/reflector';
import { ILetter } from '../interfaces/Letter.interface';
import { Text } from '../../../../__shared/ui/Text';
import { Sidebar } from '../../folders/components';
import { TextInput } from '../../../../__shared/ui/Input';
import { Search } from '../../../../__shared/ui/Svg/Search';
const tree = new Tree({
  //@ts-ignore
  makeElement: (tag) => {
    if (tag === 'svg' || tag === 'path') {
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    } else {
      return document.createElement(tag);
    }
  },
});
const tags = new Tags(tree);
const reflexio = new Reflexio<{
  letters: Array<ILetter>;
  isLoading: boolean;
}>();
export const LettersList = () => {
  const { state, trigger } = reflexio.useReflexio(
    (state: IState) => ({
      letters: state.letters.lettersList.data as Array<ILetter>,
      isLoading: state.letters.lettersList.loading as boolean,
    }),
    LettersList
  );

  return tags.root({
    onMount: () => {
      trigger('lettersList', 'init', null);
      trigger('setContent', 'init', null);
    },
    attributes: {
      class: 'lettersListContainer',
    },
    tagName: 'div',
    child: [
      tags.tag({
        child: 'New Letter',
        tagName: 'button',
        attributes: {
          class: 'lettersListButton',
        },
        eventListeners: {
          click: () => trigger('setContent', 'openWindow', { id: '-1' }),
        },
      }),
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
                w: '600px',
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
                : 'Загрузка',
          }),
        ],
      }),
    ],
  });
};
