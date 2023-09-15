// 'pdf/Verma.Shu6ham.pdf'
// 'SSL/certificate.pfx'
// 'Smart@pdf123'

const fs = require('fs');
const { plainAddPlaceholder, sign } = require('node-signpdf');
const p12Buffer = fs.readFileSync(
    'SSL/certificate.p12'
);
let pdfBuffer = fs.readFileSync(`pdf/Verma.Shu6ham.pdf`);
pdfBuffer = plainAddPlaceholder({
    pdfBuffer,
    reason: 'I have reviewed it.',
    signatureLength: 1612,
});
pdfBuffer = sign(pdfBuffer, p12Buffer);


