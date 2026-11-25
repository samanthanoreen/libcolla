import * as XLSX from 'xlsx';
import { collegeCode } from '@/lib/college';

/**
 * Generate and download a Collection Assessment Excel (.xlsx) workbook
 * with Summary and List of References sheets.
 */
export function downloadAssessmentReportExcel({
    program,
    summaryRows = [],
    referencesData = [],
    grandTotals,
    dateLabel,
}) {
    const totals = grandTotals || { t: 0, v: 0, d5: 0, d10: 0, d20: 0 };
    const programTitle = `${program?.program_name || 'Program'}${
        program?.major ? ` (${program.major})` : ''
    }`;
    const generatedAt = dateLabel || new Date().toLocaleDateString();

    const summarySheetRows = [
        ['UNIVERSITY OF SOUTHEASTERN PHILIPPINES'],
        ['Library Collection Assessment System'],
        ['COLLECTION ASSESSMENT REPORT'],
        [],
        ['Academic Program', programTitle],
        ['College', collegeCode(program?.college || '')],
        ['Date Generated', generatedAt],
        [],
        [
            'Classification',
            'Course Subject Name',
            'Total Titles (T)',
            'Total Volumes (V)',
            '<= 5 yrs',
            '<= 10 yrs',
            '<= 20 yrs',
        ],
        ...summaryRows.map((row) => [
            row.classification || 'Core',
            row.courseName || '',
            Number(row.totalT) || 0,
            Number(row.totalV) || 0,
            Number(row.distinct5yr) || 0,
            Number(row.distinct10yr) || 0,
            Number(row.distinct20yr) || 0,
        ]),
        [
            '',
            'GRAND TOTAL',
            totals.t,
            totals.v,
            totals.d5,
            totals.d10,
            totals.d20,
        ],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetRows);
    summarySheet['!cols'] = [
        { wch: 16 },
        { wch: 48 },
        { wch: 16 },
        { wch: 18 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
    ];

    const referenceSheetRows = [
        [
            'Course Subject',
            'Call Number',
            'Title of Book',
            'Author(s)',
            'Pub Year',
            'Copies',
        ],
    ];

    if (Array.isArray(referencesData) && referencesData.length > 0) {
        referencesData.forEach((group) => {
            const books = Array.isArray(group.books) ? group.books : [];
            books.forEach((b) => {
                referenceSheetRows.push([
                    group.subject || 'Subject',
                    b.callNo || '—',
                    b.title || '',
                    b.author || '—',
                    b.year || '—',
                    Number(b.copies) || 1,
                ]);
            });
        });
    }

    const referencesSheet = XLSX.utils.aoa_to_sheet(referenceSheetRows);
    referencesSheet['!cols'] = [
        { wch: 36 },
        { wch: 18 },
        { wch: 44 },
        { wch: 28 },
        { wch: 12 },
        { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(
        workbook,
        referencesSheet,
        'List of References',
    );

    const safeName = (program?.program_name || 'Report').replace(
        /[^a-zA-Z0-9]/g,
        '_',
    );
    XLSX.writeFile(workbook, `Collection_Assessment_${safeName}.xlsx`);
}
