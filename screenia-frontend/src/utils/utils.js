function to_single_list(books_comments,chapters_comments,paragraphs_comments){
    let comments_and_paragraphs = []
    for(let i = 0; i<books_comments.length; i++){
        let result = books_comments[i]
        for(let j = 0; j<result.length; j++){
            comments_and_paragraphs.push(result[j])
        }     
    }
    for(let i = 0; i<chapters_comments.length; i++){
        let result = chapters_comments[i]
        for(let j = 0; j<result.length; j++){
            comments_and_paragraphs.push(result[j])
        }   
    }
    for(let i = 0; i<paragraphs_comments.length; i++){
        let result = paragraphs_comments[i]
        for(let j = 0; j<result.length; j++){
            comments_and_paragraphs.push(result[j])
        }   
    }
    return comments_and_paragraphs
}
export{
    to_single_list
}