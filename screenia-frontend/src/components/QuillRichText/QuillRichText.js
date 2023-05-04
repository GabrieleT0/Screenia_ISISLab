import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'quill-mention';
import { fetchAutocompleteCommentRichText, fetchAutocompleteInRichText, fetchAutocompleteOutRichText } from '../../api/opereApi';
import './styles.css';
import { toast } from 'react-toastify';

const formats = ["bold", "italic", "link", "list", "bullet", "mention"]

const QuillRichText = ({ 
    idOpera,
    content, 
    handleChangeContent, 
    readOnly = false,
    disabledMention = false
}) => {
  const [value, setValue] = useState('');
  const editorRef = useRef(null);

  const modules = useMemo(() => {
    let modulesOptions = {
        toolbar: [
            [{ 'header': [false] }],
            ['bold', 'italic', 'link'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }]
        ]
    }

    if(!disabledMention) {
        modulesOptions = {
            ...modulesOptions,
            mention: {
                allowedChars: () => /^[A-Za-z0-9,\s]*$/,
                linkTarget: '_blank',
                showDenotationChar: true,
                spaceAfterInsert: true,
                dataAttributes: ['name', 'refType', 'onclick'],
                renderLoading: () => ("Loading..."),
                mentionDenotationChars: ['/out', '/in', '/comment'],
                source: async (searchTerm, renderList, mentionChar) => {
                  if(mentionChar === "/in") {
                    const mentionsRenderList = await getMentions("in", searchTerm);
                    renderList(mentionsRenderList, searchTerm);
                  } else if(mentionChar === "/out") {
                      const mentionsRenderList = await getMentions("out", searchTerm);
                      renderList(mentionsRenderList, searchTerm);
                  }  else if(mentionChar === "/comment") {
                      const mentionsRenderList = await getMentions("comment", searchTerm);
                      renderList(mentionsRenderList, searchTerm);
                  }
                },
                onSelect: (item, insertItem) => {
                  if(item.refType === "comment") {
                      return insertItem({
                          id: item.id,
                          value: `${item.name};`,
                          denotationChar: "cfr_comment. ",
                          refType: item.refType,
                          link: item.link
                      });
                  }
                  
                  return insertItem({
                      id: item.id,
                      value: `${item.name};`,
                      denotationChar: "cfr. ",
                      refType: item.refType,
                      link: item.link
                  });
                }
            }
        };
    }

    return modulesOptions
  }, []);

  useEffect(() => {
    setValue(content);
  }, [content])

  const handleChange = (content, delta, source, editor) => {
    const contentToRaw = editor.getContents();
    setValue(editor.getContents());
    handleChangeContent(contentToRaw, getOnlyTextFromHTML(editor.getHTML()));
  };

  const getOnlyTextFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc.body.textContent;
  }

  const getMentions = async (typeMention = "", searchTerm = "") => {
    try {
      if(typeMention === "in") {
        const dataMention = await fetchAutocompleteInRichText(idOpera, searchTerm);
        return dataMention.data.map(
          ({ id, name, link }) => ({ 
            id: id, value: name, link: link, name: name, refType: 'in' 
        }));
      } else if(typeMention === "out") {
        const dataMention = await fetchAutocompleteOutRichText(idOpera, searchTerm);
        return dataMention.data.map(
          ({ id, name, link }) => ({ 
            id: id, value: name, link: link, name: name, refType: 'out' 
        }));
      } else if(typeMention === "comment") {
        const dataMention = await fetchAutocompleteCommentRichText(idOpera, searchTerm);
        return dataMention.data.map(
          ({ id, name, link }) => ({ 
            id: id, value: name, link: link, name: name, refType: 'comment' 
        }));
      }

      return [];
    } catch(e) {
      toast.error("Unable to retrieve reference. If the problem persists, contact the administration!");
      return [];
    }
  }

  return (
    <div>
      <ReactQuill
        ref={editorRef}
        readOnly={readOnly}
        value={value}
        modules={modules}
        formats={formats}
        onChange={!readOnly ? handleChange : null}
      />
    </div>
  );
};

export default QuillRichText;
