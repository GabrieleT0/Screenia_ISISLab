import PDFDocument from 'pdfkit'

function generate_pdf(font_size,font_familty,text_obj, opera_info){
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument();

        // Pdf document title
        pdf.font('Helvetica-Bold').fontSize(24);
        const title = 'Screenia'
        const title_width = pdf.widthOfString(title)
        let x = (pdf.page.width - title_width) / 2
        let y = 100
        pdf.text(title,x,y)

        const page_width = pdf.page.width
        const page_height = pdf.page.height
        x = (page_width - pdf.widthOfString(opera_info.title)) / 2
        y = (page_height - pdf.currentLineHeight()) /2
        pdf.text(opera_info.title,x,y)

        pdf.font('Helvetica').fontSize(12);
        const editions = opera_info.editions
        for(let i = 0; i<editions.length; i++){
            if(i>0){
                y = 3
            }

            const series_name = editions[i].dataValues.series
            x = (page_width - pdf.widthOfString(series_name)) / 2
            let y2 = y + pdf.heightOfString(opera_info.title) + 12
            pdf.text(series_name,x,y2,{align: 'left'})

            const place_and_date = editions[i].dataValues.place + ' ' + editions[i].dataValues.date
            x = (page_width - pdf.widthOfString(place_and_date)) / 2
            let y3 = y2 + pdf.heightOfString(series_name) + 4
            pdf.text(place_and_date ,x,y3)

            const publisher = editions[i].dataValues.publisher
            x = (page_width - pdf.widthOfString(publisher)) / 2
            let y4 = y3 + pdf.heightOfString(place_and_date) + 4
            pdf.text(publisher ,x,y4)

            const isbn = 'ISBN: ' + editions[i].dataValues.ISBN
            x = pdf.page.width - pdf.widthOfString(isbn) - 72
            let y5 = pdf.page.height - 100
            pdf.text(isbn,x,y5)
        }

        pdf.addPage()
        pdf.fontSize(font_size)
        pdf.font(font_familty)
        for(let i = 0; i<text_obj.length; i++){
            console.log(text_obj[i])
            pdf.text(`Book number ${text_obj[i].number_book}`)
            pdf.text(`Chapter number ${text_obj[i].number_chapter}`)
            pdf.text(`Paragraph number ${text_obj[i].paraghraph.label}`)
            pdf.text(`${text_obj[i].paraghraph.text}`,{align: 'justify'})
            pdf.moveDown()
            pdf.moveDown()
            pdf.text(`Comment by ${text_obj[i].user.name} ${text_obj[i].user.surname}`)
            const tags = text_obj[i].tags
            let tags_str = ''
            for(let j = 0; j<tags.length; j++){
                tags_str += `${tags[j].title} (${tags[j].category})`
            }
            pdf.text(`Tags used: ${tags_str}`)
            pdf.text(`${text_obj[i].flat_text}`,{
                align: 'left',
            })
            pdf.addPage()
        }
        const buffers = [];
        pdf.on('data', (buffer) => buffers.push(buffer));
        pdf.on('end', () => resolve(Buffer.concat(buffers)));
        pdf.end();
    });
}   

export {
    generate_pdf
}
