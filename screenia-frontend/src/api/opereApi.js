import axios from "axios";
const service = `${process.env.REACT_APP_BACKEND_ENDPOINT}`;

const opereApi = axios.create({
    baseURL: service,
    headers: {
      'Accept': 'application/json',
      //'Authorization': 'token <your-token-here> -- https://docs.GitHub.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
    },
    withCredentials: true,
    credential: true
});

const fetchAllOpere = ({ page, forPage }) => {
    return opereApi.get(`/opera`, { params: { 
        page,
        forPage
    }});
}

const fetchOpera = async (id) => {
    return await opereApi.get(`/opera/${id}`);
}

const fetchBooksByOpera = async (idOpera = null) => {
    if(!idOpera) {
        return;
    }

    return await opereApi.get(`/book/${idOpera}`);
}

const fetchParagraph = async (idOpera, idBook, idChapter) => {
    return await opereApi.get(`/paragraph/${idOpera}/${idBook}/${idChapter}`);
}

const fetchUploadOpera = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return await opereApi.post(`/opera/uploadAllOpera`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

const fetchAllAuthorByOpera = async (idOpera = null) => {
    return await opereApi.get(`/author/list_author_of_opera/${idOpera}`);
}

const fetchAllEditionByOpera = async (idOpera = null) => {
    return await opereApi.get(`/edition/list_edition_of_opera/${idOpera}`);
}

const fetchAllComment = async (idOpera, idBook, idChapter, filter = null) => {
    return await opereApi.post(`/comment_parapragh/${idOpera}/${idBook}/${idChapter}`, {
        username: (filter && filter.user) ? filter.user : "",
        tags: (filter && Array.isArray(filter.tags) && filter.tags.length > 0) ? [...filter.tags] : []
    });
}

const postComment = async (body) => {
    return await opereApi.post(`/comment_parapragh`, body);
}

const fetchAutocompleteOutRichText = async (idOpera, search = "") => {
    return await opereApi.get(`/rich_text/out`, { params: { idOpera: idOpera, value: search } });
}

const fetchAutocompleteInRichText = async (idOpera, search = "") => {
    return await opereApi.get(`/rich_text/in`, { params: { idOpera: idOpera, value:  search} });
}

const fetchAutocompleteCommentRichText = async (idOpera, search = "") => {
    return await opereApi.get(`/rich_text/comment`, { params: { idOpera: idOpera, value:  search} });
}

const fetchTags = async (search = "") => {
    return await opereApi.get(`/tag/search`, { params: { value: search } });
}

const fetchPostComment = async (data) => {
    return await opereApi.post(`/comment_parapragh`, data)
}

const fetchPostTag = async (data) => {
    return await opereApi.post(`/tag`, data)
}

const fetchCommentsReview = async (idCurrentComment) => {
    return await opereApi.get(`/comment_paragraph_review/${idCurrentComment}`)
}

const fetchCreateRoom = async (body) => {
    return await opereApi.post(`/room`, { ...body });
}

const fetchCommentsByRoom = async (idRoom) => {
    return await opereApi.get(`/comment_parapragh/room/${idRoom}`);
}

const fetchDiscussionByRoom = async (idRoom) => {
    return await opereApi.get(`/discussion/room/${idRoom}`);
}

export {
    fetchAllOpere,
    fetchOpera,
    fetchBooksByOpera,
    fetchParagraph,
    fetchUploadOpera,
    fetchAllAuthorByOpera,
    fetchAllEditionByOpera,
    fetchAllComment,
    postComment,
    fetchAutocompleteOutRichText,
    fetchAutocompleteInRichText,
    fetchTags,
    fetchPostComment,
    fetchPostTag,
    fetchAutocompleteCommentRichText,
    fetchCommentsReview,
    fetchCreateRoom,
    fetchCommentsByRoom,
    fetchDiscussionByRoom
}