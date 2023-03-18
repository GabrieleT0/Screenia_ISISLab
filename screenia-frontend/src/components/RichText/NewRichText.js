import 'remirror/styles/all.css';

import { useCallback, useEffect, useState } from 'react';
import { MentionAtomExtension } from 'remirror/extensions';
import { cx } from '@remirror/core';
import {
  EditorComponent,
  FloatingWrapper,
  MentionAtomNodeAttributes,
  Remirror,
  useMentionAtom,
  useRemirror,
  useKeymap
} from '@remirror/react';
import { fetchAutocompleteOutRichText } from '../../api/opereApi';

const ALL_USERS = [
  { id: 'joe', label: 'Joe' },
  { id: 'sue', label: 'Sue' },
  { id: 'pat', label: 'Pat' },
  { id: 'tom', label: 'Tom' },
  { id: 'jim', label: 'Jim' },
];

const MentionSuggestor = () => {
  const [options, setOptions] = useState([]);
  const [items, setItems] = useState([]);
  const { state, getMenuProps, getItemProps, indexIsHovered, indexIsSelected } = useMentionAtom({
    items: options,
  });

  useEffect(() => {
    searchOptions();
  }, [state]);

  const searchOptions = async () => {
    if (!state) {
      return;
    }

    const searchTerm = state.query.full.toLowerCase();

    let data = [];
    if(items.length === 0) {
        data = await fetchMentions(searchTerm);
        setItems(data);
    } else {
        data = [...items];
    }

    const filteredOptions = data.filter((user) =>
      user.label.toLowerCase().includes(searchTerm)
    )
      .sort()
      .slice(0, 5);

    setOptions(filteredOptions);
  }

  const fetchMentions = async (searchTerm) => {
    const response = await fetchAutocompleteOutRichText(searchTerm);
    return response.data;
  }

  const enabled = Boolean(state);

  return (
    <FloatingWrapper positioner='cursor' enabled={enabled} placement='bottom-start'>
      <div {...getMenuProps()} className='suggestions'>
        {enabled &&
          options.map((user, index) => {
            const isHighlighted = indexIsSelected(index);
            const isHovered = indexIsHovered(index);

            return (
              <div
                key={user.id}
                className={cx('suggestion', isHighlighted && 'highlighted', isHovered && 'hovered')}
                {...getItemProps({
                  item: user,
                  index,
                })}
              >
                <div onClick={() => setItems([])}>{user.label}</div>
              </div>
            );
          })}
      </div>
    </FloatingWrapper>
  );
};

const RichTextCustom = () => {
  const { manager, state } = useRemirror({
    extensions: () => [
      new MentionAtomExtension({
        matchers: [{ name: 'at', char: '/out', appendText: ' ' }],
      }),
    ],
    content: '<p>I love Remirror</p>',
    selection: 'start',
    stringHandler: 'html',
  });

  return (
    <div className='remirror-theme'>
      <Remirror manager={manager} initialContent={state}>
        <EditorComponent />
        <MentionSuggestor />
      </Remirror>
    </div>
  );
};

export default RichTextCustom;