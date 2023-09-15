require("dotenv").config();

const fs = require('fs');
const signer = require('node-signpdf');
const {
    PDFDocument,
    PDFName,
    PDFNumber,
    PDFHexString,
    PDFString,
    PDFImage
} = require('pdf-lib');


// Custom code to add Byterange to PDF
const PDFArrayCustom = require('./PDFArrayCustom');

// The PDF we're going to sign
const pdfBuffer = fs.readFileSync('pdf/Shubham_Verma.pdf');
// console.log('pdfBuffer: ', pdfBuffer)

// The p12 certificate we're going to sign with
const p12Buffer = fs.readFileSync('SSL/certificates/certificate.p12');

const SIGNATURE_LENGTH = 4540;

(async () => {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();

    const ByteRange = PDFArrayCustom.withContext(pdfDoc.context);
    ByteRange.push(PDFNumber.of(0));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));
    ByteRange.push(PDFName.of(signer.DEFAULT_BYTE_RANGE_PLACEHOLDER));

    const signatureDict = pdfDoc.context.obj({
        Type: 'Sig',
        Filter: 'Adobe.PPKLite',
        SubFilter: 'adbe.pkcs7.detached',
        ByteRange,
        Contents: PDFHexString.of('A'.repeat(SIGNATURE_LENGTH)),
        Reason: PDFString.of('We need your signature for reasons...'),
        Name: PDFString.of('Shubham Verma'),
        M: PDFString.fromDate(new Date()),
    });
    const signatureDictRef = pdfDoc.context.register(signatureDict);

    let signOnPageNo = pages.length - 1;


    const widgetDict = pdfDoc.context.obj({
        Type: 'Annot',
        Subtype: 'Widget',
        FT: 'Sig',
        //Invisible
        // Rect: [0, 0, 0, 0],

        //visible
        Rect: [
            pages[signOnPageNo].getWidth() - 200,   // Start Width
            100,                                        // End Height
            pages[signOnPageNo].getWidth() - 50,    // End Width
            50,                                         // Start Height
        ],

        V: signatureDictRef,
        T: PDFString.of('SignatureTest'),
        F: 4,
        P: pages[signOnPageNo].ref,
        DA: PDFString.of('/Tx BMC /GS gs BT 0.5 0.5 0.5 rg /F1 12 Tf 0 -12 Td (Shubham Verma) Tj ET EMC'),
        // AP: pdfDoc.context.obj({
        //     N: pdfDoc.context.obj({
        //         Resources: pdfDoc.context.obj({
        //             XObject: pdfDoc.context.obj({
        //                 Im1: signatureImage,
        //             }),
        //         }),
        //         Do: PDFName.of('Im1'),
        //     }),
        //     BS: PDFName.of('S'),
        //     W: 2,
        //     H: 2,
        // }),
    });
    const widgetDictRef = pdfDoc.context.register(widgetDict);

    // console.log(widgetDict, widgetDictRef);

    // Add our signature widget to the first page
    pages[signOnPageNo].node.set(PDFName.of('Annots'), pdfDoc.context.obj([widgetDictRef]));

    // Create an AcroForm object containing our signature widget
    pdfDoc.catalog.set(
        PDFName.of('AcroForm'),
        pdfDoc.context.obj({
            SigFlags: 3,
            Fields: [widgetDictRef],
        }),
    );

    // // Create a visible appearance for the signature field
    // const defaultAppearance = PDFString.of('/Tx BMC /GS gs BT 0.5 0.5 0.5 rg /F1 12 Tf 0 -12 Td (Signature) Tj ET EMC');
    // widgetDict.set(PDFName.of('DA'), defaultAppearance);

    const modifiedPdfBytes = await pdfDoc.save({ useObjectStreams: false });
    const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);

    // console.log('modifiedPdfBuffer: ', modifiedPdfBuffer);
    // fs.writeFileSync('pdf/modifiedPdf.pdf', modifiedPdfBuffer);

    const signObj = new signer.SignPdf();
    const signedPdfBuffer = signObj.sign(modifiedPdfBuffer, p12Buffer, {
        passphrase: process.env.passphrase,
    });


    // Write the signed file
    fs.writeFileSync('pdf/signed.pdf', signedPdfBuffer);

})();