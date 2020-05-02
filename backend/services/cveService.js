const Cve = require('../mongoose');

const cve = {
  getLatest10: async () => {
    try {
      const result = await Cve.find().sort('-publishedDate').limit(10);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  getAll: async (pageNo, resultsPerPage) => {
    try {
      const result = await Cve.find()
        .sort('-publishedDate')
        .skip(resultsPerPage * pageNo - resultsPerPage)
        .limit(resultsPerPage);
      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  getNoOfPages: async () => {
    try {
      const result = await Cve.countDocuments();
      return Math.floor(result / 10 + 1);
    } catch (err) {
      console.log(err);
    }
  },
  getByKeyword: async (keywords) => {
    try {
      var query = [];
      for (let i = 0; i < keywords.length; i++) {
        query.push({
          'description.description_data.value': {
            $regex: keywords[i],
            $options: 'i',
          },
        });
      }

      const result = await Cve.find({ $and: query }).sort('-publishedDate');
      return result;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = cve;
