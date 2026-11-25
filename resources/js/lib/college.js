export const COLLEGES = [
    { code: 'CBA', name: 'College of Business Administration' },
    { code: 'CIC', name: 'College of Information and Computing' },
    { code: 'CAS', name: 'College of Arts and Sciences' },
    { code: 'CED', name: 'College of Education' },
    { code: 'CoE', name: 'College of Engineering' },
    { code: 'CAEc', name: 'College of Applied Economics' },
    { code: 'CT', name: 'College of Technology' },
];

const clean = (v) =>
    String(v)
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/\s+/g, ' ')
        .trim();

export function collegeCode(value) {
    if (value === null || value === undefined || value === '') return value;
    const key = clean(value);
    const hit = COLLEGES.find(
        (c) => clean(c.name) === key || c.code.toLowerCase() === key,
    );
    return hit ? hit.code : value;
}