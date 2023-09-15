const fs = require('fs');
const signer = require('node-signpdf');
const {
    PDFDocument,
    PDFName,
    PDFNumber,
    PDFHexString,
    PDFString,
} = require('pdf-lib');

// Custom code to add Byterange to PDF
const PDFArrayCustom = require('./PDFArrayCustom');

// The PDF we're going to sign
const pdfBuffer = fs.readFileSync('pdf/Verma.Shu6ham.pdf');

// The p12 certificate we're going to sign with
const p12Buffer = fs.readFileSync('SSL/certificate.p12');

const SIGNATURE_LENGTH = 4540;

(async () => {


    // Create a PDFDocument object
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Get the pages
    const pages = pdfDoc.getPages();


    const ByteRange = PDFArrayCustom.withContext(pdfDoc.context);
    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));

    // Create a signatureDict object
    const signatureDict = pdfDoc.context.obj({
        Type: 'Sig',
        Filter: 'Adobe.PPKLite',
        SubFilter: 'adbe.pkcs7.detached',
        ByteRange,
        Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
        Reason: PDFString.of('We need your signature for reasons...'),
        M: PDFString.fromDate(new Date()),
    });
    const signatureDictRef = pdfDoc.context.register(signatureDict);


    // Create a widgetDict object
    const widgetDict = pdfDoc.context.obj({
        Type: 'Annot',
        Subtype: 'Widget',
        FT: 'Sig',
        Rect: [
            pages[pages.length - 1].getWidth() - 100,
            pages[pages.length - 1].getHeight() - 100,
            pages[pages.length - 1].getWidth(),
            pages[pages.length - 1].getHeight(),
        ],
        V: signatureDict,
        DA: PDFString.of('/Tx BMC /GS gs BT 0.5 0.5 0.5 rg /F1 12 Tf 0 -12 Td (Shubham Verma) Tj ET EMC'),
    });
    const widgetDictRef = pdfDoc.context.register(widgetDict);
    
    // Add the signature widget to the last page
    pages[pages.length - 1].node.set(PDFName.of('Annots'), pdfDoc.context.obj([widgetDictRef]));

    // Create an AcroForm object containing the signature widget
    pdfDoc.catalog.set(
        PDFName.of('AcroForm'),
        pdfDoc.context.obj({
            SigFlags: 3,
            Fields: [widgetDict],
        }),
    );

    // Save the modified PDF document
    const modifiedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

    // Sign the modified PDF document
    const signObj = new signer.SignPdf();
    const signedPdfBuffer = signObj.sign(modifiedPdfBuffer, p12Buffer, {
        passphrase: 'Smart@pdf123',
    });

    // Write the signed PDF document
    fs.writeFileSync('pdf/signed.pdf', signedPdfBuffer);
})();
