const fs = require('fs');
const wkhtmltopdf = require('wkhtmltopdf');

// Get the path to the PDF file to be signed.
const pdfPath = 'pdf/Verma.Shu6ham.pdf';

// Get the path to the PFX file.
const pfxPath = 'SSL/certificat.pfx';

// Get the password for the PFX file.
const pfxPassword = 'Smart@pdf123';

// Create a new `wkhtmltopdf` instance.
const pdf = new wkhtmltopdf();

// Set the options for the signature.
pdf.signatureOptions = {
    pfxPath: pfxPath,
    pfxPassword: pfxPassword,
};

// Sign the PDF file.
pdf.convertFile(pdfPath);
