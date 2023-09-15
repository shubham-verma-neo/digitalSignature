const { SignPdf } = require('node-signpdf');
const fs = require('fs');
const { Buffer } = require('buffer');
const { plainAddPlaceholder } = require('node-signpdf/dist/helpers/index.js');

const pathSignedPdf = 'pdf/Verma.Shu6ham_signer.pdf'
const p12Buffer = fs.readFileSync('SSL/certificate.p12');
const pdfBuffer = fs.readFileSync('pdf/Verma.Shu6ham.pdf');
const pdfBufferToSign = plainAddPlaceholder({
    pdfBuffer
});
const signer = new SignPdf()
const signedPdf = signer.sign(pdfBufferToSign, p12Buffer, { passphrase: 'Smart@pdf123' });
const bufferPdf = Buffer.from(signedPdf)

fs.createWriteStream(pathSignedPdf).write(bufferPdf);