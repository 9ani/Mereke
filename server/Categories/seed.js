const Categories = require("./Categories");

const data = [
  "Музыка",
  "Искусство и культура",
  "Спорт",
  "Бизнес",
  "Еда и напитки",
  "Образование",
  "Технологии",
  "Здоровье ",
  "Путешествия",
  "Хобби ",
];

async function writeDataCategory() {
  const length = await Categories.countDocuments();
  if (length === 0) {
    data.map((item, index) => {
      new Categories({
        name: item,
        key: index,
      }).save();
    });
  }
}

module.exports = writeDataCategory;
