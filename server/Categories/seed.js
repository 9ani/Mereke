const Categories = require('./Categories');

const data = [
    'Музыка',
    'Искусство и культура',
    'Спорт',
    'Бизнес и профессиональное развитие',
    'Еда и напитки',
    'Образование',
    'Технологии',
    'Здоровье и благополучие',
    'Путешествия и активный отдых',
    'Хобби и особые интересы',
];

async function writeDataCategory() {
    const length = await Categories.countDocuments();
    if (length === 0) {
        data.map((item, index) => {
            new Categories({
                name: item,
                key: index
            }).save();
        });
    }
}

module.exports = writeDataCategory;
