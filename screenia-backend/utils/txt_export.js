function generate_txt(text_obj,opera_info){
    let txt_content = ''    
    let authors = ''
    for(let i = 0; i< opera_info.authors.length; i++){
        authors += opera_info.authors[i].dataValues.name + ' '
    }
    txt_content += `Opera info: ${opera_info.title} ${authors} \n \n`
    for(let i = 0; i<text_obj.length; i++){
        let tags_str = ''
        const tags = text_obj[i].tags
        for(let j = 0; j<tags.length; j++){
            tags_str += `${tags[j].title} (${tags[j].category})`
        }
        txt_content += `Book number: ${text_obj[i].number_book} Chapter number: ${text_obj[i].number_chapter} Paragraph number: ${text_obj[i].number_paragraph}\n
${text_obj[i].paraghraph.text}\n
Comment by ${text_obj[i].user.name} ${text_obj[i].user.surname}, tags: ${tags_str}.\n
${text_obj[i].flat_text}\n\n
------------------------------------------------------------------------------------------------\n\n 
`
    }

    return txt_content
}

export{
    generate_txt
}