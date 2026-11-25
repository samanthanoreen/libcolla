import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collegeCode } from '@/lib/college';

/**
 * Generate and download an accreditation-style Collection Assessment PDF.
 */
export function downloadAssessmentReportPdf({
    program,
    summaryRows = [],
    referencesData = [],
    grandTotals,
    dateLabel,
}) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const maroon = [159, 18, 57];
    const softPink = [249, 237, 239];
    const slate = [75, 85, 99];

    // Institutional Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...maroon);
    doc.text('UNIVERSITY OF SOUTHEASTERN PHILIPPINES', pageWidth / 2, 16, {
        align: 'center',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...slate);
    doc.text('Library Collection Assessment System', pageWidth / 2, 21.5, {
        align: 'center',
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text('COLLECTION ASSESSMENT REPORT', pageWidth / 2, 28, {
        align: 'center',
    });

    // Divider
    doc.setDrawColor(...maroon);
    doc.setLineWidth(0.5);
    doc.line(14, 31.5, pageWidth - 14, 31.5);

    // Program Metadata Block
    const programTitle = `${program?.program_name || 'Program'}${
        program?.major ? ` (${program.major})` : ''
    }`;
    const generatedAt = dateLabel || new Date().toLocaleDateString();

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Academic Program:', 14, 38);
    doc.setFont('helvetica', 'normal');
    doc.text(programTitle, 48, 38);

    doc.setFont('helvetica', 'bold');
    doc.text('College:', 14, 43.5);
    doc.setFont('helvetica', 'normal');
    doc.text(collegeCode(program?.college || ''), 48, 43.5);

    doc.setFont('helvetica', 'bold');
    doc.text('Date Generated:', 14, 49);
    doc.setFont('helvetica', 'normal');
    doc.text(generatedAt, 48, 49);

    // 1. Summary Assessment Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...maroon);
    doc.text('1. SUMMARY ASSESSMENT TABLE', 14, 57);

    const totals = grandTotals || { t: 0, v: 0, d5: 0, d10: 0, d20: 0 };
    const summaryBody =
        summaryRows.length > 0
            ? summaryRows.map((row) => [
                  row.classification || 'Core',
                  row.courseName || '',
                  String(row.totalT ?? 0),
                  String(row.totalV ?? 0),
                  String(row.distinct5yr ?? 0),
                  String(row.distinct10yr ?? 0),
                  String(row.distinct20yr ?? 0),
              ])
            : [['—', 'No subjects found for this academic program.', '0', '0', '0', '0', '0']];

    autoTable(doc, {
        startY: 60,
        head: [
            [
                'Classification',
                'Course Subject Name',
                'T',
                'V',
                '<= 5 yrs',
                '<= 10 yrs',
                '<= 20 yrs',
            ],
        ],
        body: summaryBody,
        foot: [
            [
                { content: 'GRAND TOTAL', colSpan: 2, styles: { halign: 'right' } },
                String(totals.t),
                String(totals.v),
                String(totals.d5),
                String(totals.d10),
                String(totals.d20),
            ],
        ],
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 2.2,
            textColor: [31, 41, 55],
            lineColor: [229, 231, 235],
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: maroon,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center',
        },
        footStyles: {
            fillColor: [243, 244, 246],
            textColor: [17, 24, 39],
            fontStyle: 'bold',
            halign: 'center',
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 24 },
            1: { halign: 'left' },
            2: { halign: 'center', cellWidth: 12 },
            3: { halign: 'center', cellWidth: 12 },
            4: { halign: 'center', cellWidth: 16 },
            5: { halign: 'center', cellWidth: 17 },
            6: { halign: 'center', cellWidth: 17 },
        },
    });

    // 2. List of References
    const nextY = (doc.lastAutoTable?.finalY || 90) + 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...maroon);
    doc.text('2. LIST OF REFERENCES (CATALOGED BOOKS)', 14, nextY);

    const referenceBody = [];
    if (Array.isArray(referencesData) && referencesData.length > 0) {
        referencesData.forEach((group) => {
            const books = Array.isArray(group.books) ? group.books : [];
            referenceBody.push([
                {
                    content: `${group.subject || 'Subject'} (${books.length} ${
                        books.length === 1 ? 'Title' : 'Titles'
                    })`,
                    colSpan: 5,
                    styles: {
                        fillColor: softPink,
                        textColor: maroon,
                        fontStyle: 'bold',
                    },
                },
            ]);
            books.forEach((b) => {
                referenceBody.push([
                    b.callNo || '—',
                    b.title || '',
                    b.author || '—',
                    String(b.year || '—'),
                    String(b.copies ?? 1),
                ]);
            });
        });
    } else {
        referenceBody.push([
            {
                content: 'No book references currently assigned to these subjects.',
                colSpan: 5,
                styles: { halign: 'center', textColor: slate },
            },
        ]);
    }

    autoTable(doc, {
        startY: nextY + 3,
        head: [['Call Number', 'Title of Book', 'Author(s)', 'Pub Year', 'Copies']],
        body: referenceBody,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 2.2,
            textColor: [31, 41, 55],
            lineColor: [229, 231, 235],
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: maroon,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { cellWidth: 28 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 38 },
            3: { halign: 'center', cellWidth: 18 },
            4: { halign: 'center', cellWidth: 16 },
        },
    });

    // Recency Evaluation Summary Note
    const noteY = (doc.lastAutoTable?.finalY || 120) + 8;
    const pageHeight = doc.internal.pageSize.getHeight();
    const finalNoteY = noteY > pageHeight - 25 ? (doc.addPage(), 20) : noteY;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...maroon);
    doc.text('Recency Evaluation Summary:', 14, finalNoteY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slate);
    doc.text(
        `Based on accreditation standards, ${totals.d5} distinct title(s) are <= 5 years old and ${totals.d10} distinct title(s) are 6-10 years old.`,
        14,
        finalNoteY + 4.5,
    );

    // Page numbers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(
            `Page ${i} of ${totalPages}`,
            pageWidth - 14,
            pageHeight - 8,
            { align: 'right' },
        );
    }

    const safeName = (program?.program_name || 'Report').replace(
        /[^a-zA-Z0-9]/g,
        '_',
    );
    doc.save(`Collection_Assessment_${safeName}.pdf`);
}
