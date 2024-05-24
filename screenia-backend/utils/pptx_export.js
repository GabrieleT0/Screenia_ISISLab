import PPTX from 'nodejs-pptx'
import fs from 'fs';

async function generate_pptx(font_size,font_family,text_obj,opera_info){
    let pptx = new PPTX.Composer();
    
    const tmp_path = './exported_comments.pptx'
    await pptx.compose(pres => {
        pres
        .title('Screenia')
        .author('Screenia')
        pres.addSlide(slide => {
          slide.addText(text => {
            text
            .value('Screenia\n Test')
            .fontFace(font_family)
            .fontSize(20)
            .textVerticalAlign('center')
            .x(310)
            .y(50)
          });
        });
      });
    await pptx.save(tmp_path);
    const pptx_buffer = fs.readFileSync(tmp_path)
    fs.unlinkSync(tmp_path)

    return pptx_buffer
}

export{
    generate_pptx
}