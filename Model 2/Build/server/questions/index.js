const numerical = require('./numerical');
const dataInterpretation = require('./data-interpretation');
const logical = require('./logical');

const allQuestions = [...numerical, ...dataInterpretation, ...logical];

module.exports = {
  numerical,
  dataInterpretation,
  logical,
  allQuestions,
  getByCategory: function(category) {
    return allQuestions.filter(q => q.category === category);
  },
  getById: function(id) {
    return allQuestions.find(q => q.id === id);
  },
  getByDifficulty: function(difficulty) {
    return allQuestions.filter(q => q.difficulty === difficulty);
  },
  stats: {
    total: allQuestions.length,
    nr: numerical.length,
    di: dataInterpretation.length,
    lr: logical.length
  }
};
