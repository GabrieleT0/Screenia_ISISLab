const express = require('express');
import { book, paragraph } from "../../models";
import BookService from "../../services/book";
import CommentParagraphService from "../../services/comment_paragraph";
import { to_single_list } from "../../../screenia-frontend/src/utils/utils";
import { generate_pdf } from "../../utils/pdf_export";
import fs from 'fs'
import OperaService from "../../services/opera";
const router = express.Router();


router.get('/:idOpera',
    async function (req, res) {
        const idOpera = req.params.idOpera;

        if (!idOpera) {
            return res.send(400, "Param idOpera is required!");
        }

        try {
            const books = await BookService.getAllBookByOpera(idOpera)
            let books_parsed = JSON.parse(JSON.stringify(books))
            let chapters = {}
            for (let i = 0; i < books_parsed.length; i++) {
                chapters = books_parsed[i]['chapters'];
                for (let j = 0; j < chapters.length; j++) {
                    const chapter = chapters[j]
                    const paragraphs = await paragraph.findAll({
                        where: {
                            id_opera: chapter['id_opera'],
                            number_book: chapter['number_book'],
                            number_chapter: chapter['number'],
                        },
                        order: [['number', 'ASC']]
                    })

                    const paragraphsMap = paragraphs.map(paragraph => ({
                        paragraph_id: paragraph.number,
                        label: paragraph.label
                    }))
                    chapter.paragraph = paragraphsMap
                }
            }

            const booksFiltered = books_parsed.map(book => ({
                tag: "Book",
                label: `Books ${book.number}.`,
                value: {
                    opera_id: `${parseInt(book.id_opera)}`,
                    book_id: `${book.number}`,
                },
                children: book.chapters.map(chapter => ({
                    tag: "Chapter",
                    label: `Chapter ${chapter.number}.`,
                    value: {
                        opera_id: `${parseInt(book.id_opera)}`,
                        book_id: `${parseInt(book.number)}`,
                        chapter_id: `${chapter.number}`
                    },
                    children: chapter.paragraph.map(paragraph => {
                        const isInteger = Number.isInteger(parseInt(paragraph.label));
                        return isInteger ? {
                            tag: "Paragraph",
                            label: `Paragraph ${paragraph.label}.`,
                            value: {
                                opera_id: `${parseInt(book.id_opera)}`,
                                chapter_id: `${parseInt(chapter.number)}`,
                                book_id: `${parseInt(book.number)}`,
                                paragraph_id: `${parseInt(paragraph.paragraph_id)}`,
                            }

                        } : null;
                    }).filter(Boolean)
                }))
            }))

            return res.send(booksFiltered);
        } catch (e) {
            return res.status(500).send({
                error: e,
                message: e.message
            });
        }
    }
)
//TODO: only admin can call this (another route for editor and reader)
router.post('/commentNdPar/:idOpera/',
    async function (req, res) {
        const params = { ...req.params }
        const idOpera = params.idOpera
        const editors = req.body.editors;
        const format = req.body.format;
        const tags = req.body.tags;
        const paragraphs = req.body.paragraphs;

        if (!idOpera ) {
            return res.send(400, "Param idOpera is required!");
        }
        if (!editors) {
            return res.send(400, "Param editors is required!");
        }
        if (!format) {
            return res.send(400, "Param format is required!");
        }
        if (!tags) {
            return res.send(400, "Param tags is required!");
        }
        if (paragraphs.length == 0) {
            return res.send(400, "Param paragraphs is required!");
        }

        let books_comments = []
        let chapters_comments = []
        let paragraphs_comments = []
        try{
            for(let i = 0; i<paragraphs.length; i++){
                let where_value_comments = {}
                let data;
                switch(paragraphs[i].tag){
                    case 'Book':
                        where_value_comments = {
                            id_opera: paragraphs[i].value.opera_id,
                            number_book: paragraphs[i].value.book_id,
                            parent_id: null
                        }
                        data = await CommentParagraphService.findCommentWithPar(where_value_comments, editors, [...tags]);
                        books_comments.push(data)
                        break;
                    case 'Chapter':
                        where_value_comments = {
                            id_opera: paragraphs[i].value.opera_id,
                            number_book: paragraphs[i].value.book_id,
                            number_chapter: paragraphs[i].value.chapter_id,
                            parent_id: null
                        }
                        data = await CommentParagraphService.findCommentWithPar(where_value_comments, editors, [...tags]);
                        chapters_comments.push(data)
                        break;
                    case 'Paragraph':
                        where_value_comments = {
                            id_opera: paragraphs[i].value.opera_id,
                            number_book: paragraphs[i].value.book_id,
                            number_chapter: paragraphs[i].value.chapter_id,
                            number_paragraph: paragraphs[i].value.paragraph_id,
                            parent_id: null
                        }
                        data = await CommentParagraphService.findCommentWithPar(where_value_comments, editors, [...tags]);
                        paragraphs_comments.push(data)
                        break;
                }
            }
            const all_comments = to_single_list(books_comments,chapters_comments,paragraphs_comments)
            for(let i = 0; i< all_comments.length; i++){
                const results = await paragraph.findOne({
                    where: {
                        id_opera: all_comments[i].id_opera,
                        number_book: all_comments[i].number_book,
                        number_chapter: all_comments[i].number_chapter,
                        number: all_comments[i].number_paragraph
                    },
                    order: [['number', 'ASC']],
                    raw: true
                })
                all_comments[i]['paraghraph'] = results
            }
            const opera_info = await OperaService.getOperaById(idOpera)
            switch(format){
                case 'pdf':
                    const font_size = req.body.font_size;
                    const font_family = req.body.font_family;
                    const pdfData = await generate_pdf(font_size,font_family,all_comments,opera_info.dataValues);
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'inline; filename=exported_comments.pdf',
                        'Content-Length': pdfData.length,
                    });
                res.end(pdfData);
                break;
            }

    } catch (e){
        console.log(e)
        return res.status(500).send({
            error: e,
            message: e.message
        })
    }
})

module.exports = router;
