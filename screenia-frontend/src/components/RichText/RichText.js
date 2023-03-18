/* eslint-disable react-hooks/exhaustive-deps */
import ReactQuill from 'react-quill';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'quill-mention';
import "quill-mention/dist/quill.mention.css";
import 'react-quill/dist/quill.snow.css'; // Add css for snow theme
import { fetchAutocompleteOutRichText, fetchBooksByOpera } from '../../api/opereApi';
// import '../scss/modules/_editor.scss';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const atValues = [
  { id: 1, value: 'Fredrik Sundqvist' },
  { id: 2, value: 'Patrik Sjölin' },
];
const hashValues = [
  { id: 3, value: 'Fredrik Sundqvist 2' },
  { id: 4, value: 'Patrik Sjölin 2' },
];

const mantions = [
  { id: 1, value: 'Autore 1' },
  { id: 2, value: 'Autore 2' }
]

export default function RichText({
  onChange,
  defaultValue,
  placeholder,
  className,
  theme,
}) {
  const editor = useRef();
  const [authorMention, setAuthorMention] = useState(null);
  console.log('editor', editor)

  useEffect(() => {
    console.log('editor', editor)
    if(!editor) return;
    //editor.current.editor.getModule('mention').openMenu('-out')
    //editor.current.props.modules.mention.mentionDenotationChars=['x']
  }, [editor])

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['clean'],
    ],
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö,]*$/,
      mentionDenotationChars: ["-out", '/'],
      //selectKeys: [32],
      onSelect: function (item, insertItem) {
        console.log('this', this.values);
        handleSetAuthor(item.value)
        insertItem(item)
      },
      source: async function (searchTerm, renderList, mentionChar) {
        console.log('ci sto')
        if(mentionChar === "-out") {
          const values = await fetchMentions(searchTerm);
          this.values = values;
          renderList(values);
        }
        /*let values;

        if (mentionChar === '-out') {
          values = mantions;
        } else if(mentionChar === '-out Autore 1') {
          values = [{ id: 1, value: "Opera 1"}, { id: 2, value: "Opera 2" }];
        }

        console.log('searchTerm', searchTerm)

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }*/
      },
    },
  };

  const handleSetAuthor = useCallback((value) => {
    setAuthorMention(value);
  });

  useEffect(() => {
    if (defaultValue) {
      const delta = editor.current.editor.clipboard.convert(defaultValue);
      editor.current.editor.setContents(delta, 'silent');
    }
  }, [defaultValue]);

  const fetchMentions = async (searchTerm) => {
    console.log('searchTerm', searchTerm)
    const response = await fetchAutocompleteOutRichText(searchTerm);
    const result = [];
    for(const author of response.data) {
        let value = "";
        if(author && author.id) {

            if(author.opera_authors) {
                for(const opera of author.opera_authors) {
                    value = `${author.name}, ${opera.title}`;
                    result.push({
                      id: opera.id,
                      value: value
                    })

                    const books = opera.books;
                    if(books) {
                        for(const book of books) {
                            value = `${author.name}, ${opera.title}, ${book.number}`;
                            result.push({
                              id: value,
                              value: value
                            })

                            const chapters = book.chapters;
                            if(chapters) {
                              for(const chapter of chapters) {
                                  value = `${author.name}, ${opera.title}, ${book.number}, ${chapter.number}`;
                                  result.push({
                                    id: value,
                                    value: value
                                  })
                              }
                          }
                        }
                    }
                }
            }
        }
        console.log('res', result)
    }
    return result;
  }

  return (
    <div className={`w-100 h-full ${className}`}>
      <ReactQuill
        ref={editor}
        theme={theme}
        modules={modules}
        /*onKeyUp={(e) => {
          //console.log(e, editor);
          if (editor.current.editor) {
            const delta = editor.current.editor.getContents();
            const html = editor.current.editor.root.innerHTML;
            // onChange({ delta, html });
            //console.log({ delta, html });
          }
        }}*/
      />
    </div>
  );
}
