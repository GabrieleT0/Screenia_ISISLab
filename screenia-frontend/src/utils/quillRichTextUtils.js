import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { scroller } from 'react-scroll';

const getHtmlComment = (ops) => {
    const converter = new QuillDeltaToHtmlConverter(ops);
  
    converter.renderCustomWith(function(customOp, contextOp){
        if (customOp.insert.type === 'mention') {
            const { id, value, link, denotationChar, refType } = customOp.insert.value;

            if(refType === "comment_multiple_reference") {
                const handleClick = (event) => {
                    scroller.scrollTo(`comment_${link}`, {
                        duration: 1500,
                        delay: 100,
                        smooth: true,
                        containerId: 'container_comment',
                        offset: 0
                    })
                }

                window.handleClickReferComment = handleClick;

                return `<a id="${id}" onclick="return handleClickReferComment()" style="cursor: pointer;">${denotationChar}${value}</a>`
            }

            return `<a id="${id}" href="${link}" target="_blank">${denotationChar}${value}</a>`
        } else {
            return '';
        }
    });
  
    const html = converter.convert();
    return html;
}

export {
    getHtmlComment
}