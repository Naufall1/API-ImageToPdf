const express = require('express');
const multer = require('multer');
const { createHash } = require('node:crypto');
const ImgtoPdf = require('./img2pdf')
const app = express();
const port = 3000;


function md5(content) {
    return createHash('md5').update(content).digest('hex')
}

async function Convert(fileName, res){
    const PDF = new ImgtoPdf(fileName);
    const test = await PDF.Convert();
    const filePath = `${__dirname}/media/pdf/${test}`;
    res.sendFile(filePath);
    return test[0];
}

// Middleware multer untuk menangani upload file
const upload = multer({ dest: 'media/uploads/'});

// Endpoint untuk upload file
app.post('/api/img2pdf', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;
  console.log(uploadedFile);
  if (!uploadedFile) {
    res.status(400).send('Tidak ada file yang diunggah.');
    return;
  }
  Convert(uploadedFile.filename, res);
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
