// Cities and Zip Codes for Chihuahua, Mexico
// Major cities included

export const CHIHUAHUA_CITIES = [
    { name: 'Chihuahua', value: 'Chihuahua' },
    { name: 'Ciudad Juárez', value: 'Ciudad Juárez' },
    { name: 'Delicias', value: 'Delicias' },
    { name: 'Cuauhtémoc', value: 'Cuauhtémoc' },
    { name: 'Hidalgo del Parral', value: 'Hidalgo del Parral' },
    { name: 'Nuevo Casas Grandes', value: 'Nuevo Casas Grandes' },
    { name: 'Camargo', value: 'Camargo' },
    { name: 'Jiménez', value: 'Jiménez' },
    { name: 'Ojinaga', value: 'Ojinaga' },
    { name: 'Meoqui', value: 'Meoqui' },
    { name: 'Aldama', value: 'Aldama' },
    { name: 'Guachochi', value: 'Guachochi' }
];

// Simplified mapping of major zip codes per city for dropdown demo
// In production, this would be a much larger dataset or API
export const CHIHUAHUA_ZIP_CODES: Record<string, string[]> = {
    'Chihuahua': ['31000', '31020', '31060', '31100', '31109', '31120', '31160', '31200', '31203', '31210', '31215', '31216', '31217', '31230', '31250', '31300', '31313', '31320', '31350', '31370', '31375', '31380', '31384', '31390'],
    'Ciudad Juárez': ['32000', '32030', '32050', '32100', '32130', '32150', '32200', '32250', '32300', '32300', '32310', '32315', '32317', '32320', '32330', '32340', '32349', '32350', '32370', '32380', '32390', '32400', '32414', '32419', '32437', '32459', '32460', '32500', '32520', '32530', '32538', '32540', '32543', '32550', '32563', '32575', '32590', '32598', '32599', '32600', '32618', '32660', '32670', '32680', '32690', '32694', '32695', '32696'],
    'Delicias': ['33000', '33010', '33019', '33038', '33070', '33080', '33083'],
    'Cuauhtémoc': ['31500', '31510', '31520', '31530', '31540', '31550', '31560', '31570', '31580', '31590'],
    'Hidalgo del Parral': ['33800', '33810', '33815', '33820', '33825', '33830', '33838', '33840', '33850', '33855', '33856', '33857', '33860', '33870', '33875', '33879', '33880', '33890'],
    'Nuevo Casas Grandes': ['31700', '31710', '31740', '31750', '31760', '31770', '31780'],
    'Camargo': ['33700', '33710', '33720', '33730', '33740', '33750'],
    'Jiménez': ['33980', '33981', '33982', '33990'],
    'Ojinaga': ['32880', '32881', '32882', '32883', '32884', '32885', '32886'],
    'Meoqui': ['33130', '33131', '33132'],
    'Aldama': ['32900', '32901', '32902', '32910'],
    'Guachochi': ['33180']
};
