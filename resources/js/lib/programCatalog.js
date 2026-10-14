// College -> Program -> Majors. Drives the cascading dropdowns in the Programs modal.
export const PROGRAM_CATALOG = {
    'College of Information and Computing': {
        'Bachelor of Science in Information Technology': ['Information Security', 'Business Technology Management'],
        'Bachelor of Science in Computer Science': ['Data Science'],
        'Bachelor of Library and Information Science': [],
    },
    'College of Business Administration': {
        'Bachelor of Science in Business Administration': ['Financial Management'],
        'Bachelor of Science in Hospitality Management': ['Culinary Arts Management', 'Hotel Administration'],
        'Bachelor of Science in Entrepreneurship': [],
        'Bachelor of Science in Accountancy': [],
    },
    'College of Arts and Sciences': {
        'Bachelor of Arts in Literature and Cultural Studies': [],
        'Bachelor of Arts in English Language': ['Applied Linguistics'],
        'Bachelor of Science in Mathematics': [],
        'Bachelor of Science in Statistics': [],
        'Bachelor of Science in Biology': ['Animal Biology', 'Plant Biology'],
    },
    'College of Engineering': {
        'Bachelor of Science in Agricultural and Biosystems Engineering': [
            'Land and Water Resource Engineering',
            'Machinery and Power Engineering',
            'Process Engineering',
            'Structures and Environment Engineering',
        ],
        'Bachelor of Science in Civil Engineering': ['Geotechnical', 'Structural', 'Transportation'],
        'Bachelor of Science in Electrical Engineering': [],
        'Bachelor of Science in Mechanical Engineering': [],
        'Bachelor of Science in Electronics Engineering': [],
        'Bachelor of Science in Geodetical Engineering': [],
        'Bachelor of Science in Mining Engineering': [],
        'Bachelor of Science in Sanitary Engineering': [],
        'Bachelor of Science in Geology': [],
    },
    'College of Education': {
        'Bachelor of Elementary Education': [],
        'Bachelor of Early Childhood Education': [],
        'Bachelor of Special Needs Education': [],
        'Bachelor of Physical Education': [],
        'Bachelor of Technology and Livelihood Education': ['Home Economics'],
        'Bachelor of Secondary Education': ['English', 'Mathematics', 'Filipino', 'Science'],
        'Bachelor of Technical-Vocational Teacher Education': [
            'Automotive Technology',
            'Civil and Construction Technology',
            'Electrical Technology',
            'Electronics Technology',
            'Mechanical Technology',
            'HVAC Technology',
            'Computer Systems Servicing',
        ],
    },
    'College of Technology': {
        'Bachelor of Science in Industrial Technology': [
            'Electrical Technology',
            'Mechanical Technology',
            'Electronics Technology',
            'Automotive Technology',
        ],
    },
    'College of Applied Economics': {
        'Bachelor of Science in Applied Economics': [
            'Development Economics',
            'Monetary and Financial Economics',
            'Resource and Environment Economics',
        ],
    },
};

export const LEVELS = ['Bachelor', 'Master', 'Doctorate'];