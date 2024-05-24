import epub from 'epub-gen' 
import fs from 'fs';

async function generate_epub(font_size,font_family,text_obj,opera_info){
    const temp_path = './exported_comments.epub'
    let authors = ''
    let content = []
    for(let i = 0; i< opera_info.authors.length; i++){
        authors += opera_info.authors[i].dataValues.name + ' '
    }

    for(let i = 0; i<text_obj.length; i++){
        const tags = text_obj[i].tags
        let tags_str = ''
        for(let j = 0; j<tags.length; j++){
            tags_str += `${tags[j].title} (${tags[j].category})`
        }
        const paragraph = {
            title: `Book number ${text_obj[i].number_book}`,
            data: `
                <b>Chapter number ${text_obj[i].number_chapter} <br> Paragraph number ${text_obj[i].number_paragraph}<br></b>
                ${text_obj[i].paraghraph.text}
                <br><br>
                <b>Comment by ${text_obj[i].user.name} ${text_obj[i].user.surname}, tags: ${tags_str}. </b> <br>
                ${text_obj[i].flat_text}
            `
        }
        content.push(paragraph)
    }

    const options = {
        title: opera_info.title,
        author: authors,
        output: temp_path,
        tocTitle: 'Index',
        css: `
            * {font-family: '${font_family}';  font-size: ${font_size}};
        }
        `,
        content: content
    };
    await new epub(options).promise
    const epub_buffer = fs.readFileSync(temp_path)
    fs.unlinkSync(temp_path)
    
    return epub_buffer
}

export{
    generate_epub
}