// 'pdf/Verma.Shu6ham.pdf'
// 'SSL/certificate.pfx'
// 'Smart@pdf123'

const fs = require('fs');
const pdfSigner = require('pdf-signer');

async function signPdfWithPfx() {
    try {
        // Load the PDF file to be signed
        const pdfBuffer = fs.readFileSync('pdf/Verma.Shu6ham.pdf');

        // Load the PFX certificate
        const pfxBuffer = fs.readFileSync('SSL/certificate.pfx');

        // Password for the PFX certificate
        const pfxPassword = 'Smart@pdf123';

        // Create a new signer instance
        const pdfSignerInstance = new pdfSigner();

        // Load the PDF document
        pdfSignerInstance.load(pdfBuffer);

        // Sign the PDF using the PFX certificate
        pdfSignerInstance.sign(pfxBuffer, pfxPassword);

        // Get the signed PDF buffer
        const signedPdfBuffer = pdfSignerInstance.toBuffer();

        // Save the signed PDF file
        fs.writeFileSync('path/to/signed.pdf', signedPdfBuffer);

        console.log('PDF successfully signed and saved as signed.pdf');
    } catch (error) {
        console.error('Error:', error);
    }
}

signPdfWithPfx();


// const fs = require('fs');
// const pdfSigner = require('pdf-signer');

// async function signPdfWithPfx() {
//     try {
//         // Load the PDF file to be signed
//         const pdfBuffer = fs.readFileSync('pdf/Verma.Shu6ham.pdf');

//         // Load the PFX or P12 certificate
//         const pfxBuffer = fs.readFileSync('SSL/certificate.pfx');

//         // Password for the PFX or P12 certificate
//         const pfxPassword = 'Smart@pdf123';

//         // Create a new signer instance
//         const pdfSignerInstance = new pdfSigner();

//         // Sign the PDF using the PFX or P12 certificate
//         pdfSignerInstance.load(pdfBuffer);
//         pdfSignerInstance.sign(pfxBuffer, pfxPassword);

//         // Get the signed PDF buffer
//         const signedPdfBuffer = pdfSignerInstance.toBuffer();

//         // Save the signed PDF file
//         fs.writeFileSync('pdf/Shu6ham.pdf', signedPdfBuffer);

//         console.log('PDF successfully signed and saved as signed.pdf');
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// signPdfWithPfx();
