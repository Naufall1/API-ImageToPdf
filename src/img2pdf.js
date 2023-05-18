const fs = require('fs');
const PDFDocument = require('pdfkit');
const imageSize = require('image-size');
const PDFMerger = require('pdf-merger-js');
const merger = new PDFMerger();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class ImgtoPdf {
    constructor(fileName){
      this.imgPath = 'media/uploads/'
      this.pdfPath = 'media/pdf/';
      this.images = fileName;
      this.imgFiles = [];
      this.pdfFiles = [];
    }

    async Convert() {
        const imageDimensions = imageSize((this.imgPath + this.images)); // mendapatkan ukuran gambar

        const doc = new PDFDocument({ size: [imageDimensions.width, imageDimensions.height] }); // membuat halaman PDF dengan ukuran yang sama dengan ukuran gambar
        const pdfName = (new Date().getTime() / 1000)+'.pdf';
        this.pdfFiles.push(pdfName); // menambahkan nama file PDF ke dalam daftar pdfFiles

        doc.pipe(fs.createWriteStream((this.pdfPath + pdfName)));

        doc.image((this.imgPath + this.images), {
            x:0,y:0,
            fit: [doc.page.width, doc.page.height], // ukuran gambar disesuaikan dengan ukuran halaman PDF
            align: 'center',
            valign: 'center'
        });
        doc.end();
        await sleep(100);
        return this.pdfFiles;
    }

    async Merge() {
      await sleep(100);
      for (const file of this.pdfFiles) {
        await merger.add((this.pdfPath + file));
      }
      const fileName = (new Date().getTime() / 1000)+'.pdf';
      await merger.save(this.pdfPath + fileName);
      return fileName;
    }

}

// Contoh pemggunaan
// async function name() {
//     const PDF = new ImgtoPdf('test.png');
//     const test = await PDF.Convert();
//     console.log(test);
// }
// // PDF.Merge();
// name();
module.exports = ImgtoPdf;