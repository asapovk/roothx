//import { useSelector } from 'react-redux';
import { IState } from '../../_redux/types';
import { ComposeGrid } from '../../compose/components/ComposeGrid';
//import { useReflector } from '../../../../../packages/redux-react/dist/lib';
import './styles.less';
import { Tree } from '../../root/NTree';
import { Tags } from '../../root/Tags';
import { Reflexio } from '../../root-redux/reflector';
import { ILetter } from '../interfaces/Letter.interface';

const tree = new Tree({
  makeElement: (tag) => document.createElement(tag),
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

  return tags.root(
    {
      onMount: () => {
        trigger('lettersList', 'init', null);
        trigger('setContent', 'init', null);
      },
      attributes: {
        class: 'lettersListContainer',
      },
      tagName: 'div',
      child: [
        tags.tag(
          {
            child: 'Create new',
            tagName: 'button',
            attributes: {
              class: 'lettersListButton',
            },
            eventListeners: {
              click: () => trigger('setContent', 'openWindow', { id: '-1' }),
            },
          },
          'create_new_button_key'
        ),
        tags.button('create_new_button_key', {
          className: 'lettersListButton',
          onClick: () => trigger('setContent', 'openWindow', { id: '-1' }),
          child: 'Create new',
        }),
        tags.div('grid_wrapper_key', {
          child: ComposeGrid(),
        }),
        tags.div('letters_list_wrapper_key', {
          className: 'lettersList',
          child:
            state.letters && state.letters.length
              ? state.letters.map((l) =>
                  tags.div(`${l.uid}`, {
                    child: l.subject || '',
                    className: 'lettersListItem',
                    onClick: () =>
                      trigger('setContent', 'openFromList', {
                        body: l.body,
                        subject: l.subject,
                      }),
                  })
                )
              : 'Загрузка',
        }),
      ],
    },
    'letters_list_root'
  );
};
