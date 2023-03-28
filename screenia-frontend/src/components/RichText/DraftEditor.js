import React, {
    MouseEvent,
    ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
    defaultSuggestionsFilter,
    MentionData,
    MentionPluginTheme,
} from '@draft-js-plugins/mention';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton
} from '@draft-js-plugins/buttons';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import editorStyles from './CustomMentionEditor.module.css';
import mentionsStyles from './MentionsStyles.module.css';
import { fetchAutocompleteCommentRichText, fetchAutocompleteInRichText, fetchAutocompleteOutRichText } from '../../api/opereApi';
import regexMention from './regexMention';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { Link } from "react-router-dom";
import { Typography } from '@mui/material';
import { animateScroll as scroll, scroller } from 'react-scroll'
import _ from 'lodash';

function Entry(props) {
    const {
        mention,
        theme,
        searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
        isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
        ...parentProps
    } = props;

    return (
        <div {...parentProps}>
        <div className={theme?.mentionSuggestionsEntryContainer}>
            <div className={theme?.mentionSuggestionsEntryContainerLeft}>
            <div className={theme?.mentionSuggestionsEntryTitle}>
                {mention.name}
            </div>
            </div>
        </div>
        </div>
    );
}

export default function DraftEditor({ 
    editorKey = "",
    editor = null, 
    idOpera = null, 
    callbackChangeEditor = null, 
    readOnly = false,
    referenceToComment = null,
    styleOptions = null,
    disabledMension = false
}) {
    const ref = useRef(null);
    const [editorState, setEditorState] = useState(null);
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const linkPlugin = createLinkPlugin();

    useEffect(() => {
        if(!editor) return;

        setEditorState(editor);
    }, [editor])

    const { Toolbar, MentionSuggestions, plugins } = useMemo(() => {
        const mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            theme: mentionsStyles,
            mentionTrigger: ['/out', '/in', '/comment', '/comment_multiple_reference'],
            mentionRegExp: regexMention,
            supportWhitespace: true,
            mentionComponent(mentionProps) {
                if(!mentionProps || !mentionProps.mention || !mentionProps.mention.id) {
                    return null;
                }

                if(mentionProps.mention.type === 'comment') {
                    return (
                        <Link 
                            to={`/opera/${mentionProps.mention.link}`}
                            className={mentionProps.className}>
                                {`cfr_comment.`} {mentionProps.children}{`;`}
                        </Link>
                    );
                }

                if(mentionProps.mention.type === 'comment_multiple_reference') {
                    return (
                        <Link 
                            onClick={() => {
                                scroller.scrollTo(`#comment_${referenceToComment}`, {
                                    duration: 1500,
                                    delay: 100,
                                    smooth: true,
                                    containerId: 'container_comment',
                                    offset: 50
                                })
                            }}
                            className={mentionProps.className}>
                                {mentionProps.children}{`;`}
                        </Link>
                    );
                }

                return (
                    <Link 
                        to={`/opera/${mentionProps.mention.link}`}
                        className={mentionProps.className}>
                            {`cfr.`} {mentionProps.children}{`;`}
                    </Link>
                );
            }
        });

        const { MentionSuggestions } = mentionPlugin;
        const toolbarPlugin = createToolbarPlugin();
        const { Toolbar } = toolbarPlugin;

        const plugins = [mentionPlugin, toolbarPlugin, linkPlugin];
        return { plugins, MentionSuggestions, Toolbar };
    }, []);

    const onChange = useCallback((_editorState) => {
        if(callbackChangeEditor) {
            callbackChangeEditor(
                _editorState.getCurrentContent().getPlainText(),
                convertToRaw(_editorState.getCurrentContent())
            )
        }
        setEditorState(_editorState);
    }, []);

    const onOpenChange = useCallback((_open) => {
        setOpen(_open);
    }, []);

    const onSearchChange = useCallback(
        _.debounce(async ({ trigger, value }) => {
            if(trigger === "/out") {
                const dataOutMention = await fetchOutMentions(idOpera, value);
                setSuggestions(dataOutMention.map((item) => ({
                    ...item,
                    type: "out"
                })));
            } else if(trigger === "/in") {
                const dataInMention = await fetchInMentions(idOpera, value);
                setSuggestions(dataInMention.map((item) => ({
                    ...item,
                    type: "in"
                })));
            } else if(trigger === "/comment") {
                const dataComment = await fetchCommentMentions(idOpera, value);
                setSuggestions(dataComment.map((item) => ({
                    ...item,
                    type: "comment"
                })));
            }
        }, 500) // intervallo di 500ms
    , []);

    const fetchOutMentions = async (idOpera, searchTerm) => {
        const response = await fetchAutocompleteOutRichText(idOpera, searchTerm);
        return response.data;
    }

    const fetchInMentions = async (idOpera, searchTerm) => {
        const response = await fetchAutocompleteInRichText(idOpera, searchTerm);
        return response.data;
    }

    const fetchCommentMentions = async (idOpera, searchTerm) => {
        const response = await fetchAutocompleteCommentRichText(idOpera, searchTerm);
        return response.data;
    }

    return editorState && (
        <div
            className={editorStyles.editor}
            onClick={() => {
                ref.current?.focus();
            }}
            style={styleOptions ? {...styleOptions} : null}
        >
        <Editor
            editorKey={editorKey}
            editorState={editorState}
            readOnly={readOnly}
            onChange={onChange}
            plugins={plugins}
            ref={ref}
        />
        {(!disabledMension || readOnly) && 
            (<MentionSuggestions
                open={open}
                onOpenChange={onOpenChange}
                suggestions={suggestions}
                onSearchChange={onSearchChange}
                onAddMention={(item) => {
                    console.log('mention ok', item)
                }}
                entryComponent={Entry}
                popoverContainer={({ children }) => <div>{children}</div>}
            />)
        }
        {!readOnly && 
            (
                <Toolbar>
                {
                (externalProps) => (
                    <>
                        <BoldButton {...externalProps} />
                        <ItalicButton {...externalProps} />
                        <UnorderedListButton {...externalProps} />
                        <OrderedListButton {...externalProps} />
                        <linkPlugin.LinkButton {...externalProps} />
                    </>
                )
                }
                </Toolbar>)
        }
        </div>
    );
}