const { Cve } = require('../mongoose');

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
  getNoOfPages: async (resultsPerPage) => {
    try {
      const result = await Cve.countDocuments();
      return Math.floor(result / resultsPerPage + 1);
    } catch (err) {
      console.log(err);
    }
  },
  getByKeyword: async (keywords) => {
    try {
      if (keywords[0].includes('CVE-')) {
        const result = await Cve.find({
          id: {
            $regex: keywords[0],
            $options: 'i',
          },
        });
        return result;
      } else {
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
      }
    } catch (err) {
      console.log(err);
    }
  },
  analysisSearch: async (body) => {
    try {
      var result = [];

      for (let i = 0; i < body.filters.length; i++) {
        var filters = body.filters[i].split(' ');

        var query = [];
        for (let i = 0; i < filters.length; i++) {
          query.push({
            'description.description_data.value': {
              $regex: filters[i],
              $options: 'i',
            },
          });
        }

        const countCurrentFilterResult = await Cve.find({
          $and: query,
          publishedDate: { $gte: body.startDate, $lte: body.endDate },
        }).countDocuments();

        const avgV3 = await Cve.aggregate([
          {
            $match: {
              $and: query,
              publishedDate: {
                $gte: new Date(body.startDate),
                $lte: new Date(body.endDate),
              },
            },
          },
          {
            $group: {
              _id: null,
              avg: { $avg: '$impact.baseMetricV3.cvssV3.baseScore' },
            },
          },
        ]);

        const avgV2 = await Cve.aggregate([
          {
            $match: {
              $and: query,
              publishedDate: {
                $gte: new Date(body.startDate),
                $lte: new Date(body.endDate),
              },
            },
          },
          {
            $group: {
              _id: null,
              avg: { $avg: '$impact.baseMetricV2.cvssV2.baseScore' },
            },
          },
        ]);

        if (avgV2.length == 0) {
          let avg = 0;
          avgV2.push(avg);
        }

        if (avgV3.length == 0) {
          let avg = 0;
          avgV3.push(avg);
        }

        result.push({
          id: body.filters[i].toUpperCase(),
          count: countCurrentFilterResult,
          avgBaseScoreV2: Number(parseFloat(avgV2[0].avg).toFixed(2)),
          avgBaseScoreV3: Number(parseFloat(avgV3[0].avg).toFixed(2)),
        });
      }

      return result;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = cve;
