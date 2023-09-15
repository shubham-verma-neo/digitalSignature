// 'pdf/Verma.Shu6ham.pdf'
// 'SSL/certificate.pfx'
// 'Smart@pdf123'

const fs = require('fs').promises;
const { PDFDocument, rgb } = require('pdf-lib');

async function signPdfWithPfx() {
    try {
        // Load the PDF file to be signed
        const pdfBuffer = await fs.readFile('pdf/Verma.Shu6ham.pdf');

        // Load the PFX or P12 certificate
        const pfxBuffer = await fs.readFile('SSL/certificate.pfx');

        // Password for the PFX or P12 certificate
        const pfxPassword = 'Smart@pdf123';

        // Create a PDF document
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        // Sign the PDF using the PFX or P12 certificate
        pdfDoc.addSignature({
            reason: 'Test',
            email: 'your-email@example.com',
            location: 'Your Location',
            signerName: 'Your Name',
            signatureCoordinates: { x: 100, y: 100 },
            signatureSize: { width: 200, height: 100 },
            signatureColor: rgb(0, 0, 0),
            appearanceOptions: {
                fontSize: 12,
                fontFamily: 'Helvetica',
                textColor: rgb(0, 0, 0),
            },
            image: pfxBuffer,
            imageTransparent: false,
            imagePadding: 5,
            password: pfxPassword,
        });

        // Serialize the signed PDF
        const modifiedPdfBuffer = await pdfDoc.save();

        // Save the signed PDF file
        await fs.writeFile('pdf/Shu6ham.pdf', modifiedPdfBuffer);

        console.log('PDF successfully signed and saved as signed.pdf');
    } catch (error) {
        console.error('Error:', error);
    }
}

signPdfWithPfx();