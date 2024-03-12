import PDFDocument from 'pdfkit'
import fs from 'fs'

function generate_pdf(font_size,font_familty,text_obj){
    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument();
        pdf.fontSize(font_size)
        pdf.font(font_familty)

        for(let i = 0; i<text_obj.length; i++){
            pdf.text(`Paragraph:${text_obj[i].paraghraph.text}`)
            pdf.text(`Comment:${text_obj[i].flat_text}`)
        }
        pdf.text('PDF Test');

        const buffers = [];
        pdf.on('data', (buffer) => buffers.push(buffer));
        pdf.on('end', () => resolve(Buffer.concat(buffers)));
        pdf.end();
    });
}   

export {
    generate_pdf
}
