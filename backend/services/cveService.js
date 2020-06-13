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
      if (keywords[0].includes('CVE-')) {
        const result = await Cve.find({ id: keywords });
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
        const countFilterResult = await Cve.find({
          'description.description_data.value': {
            $regex: body.filters[i],
            $options: 'i',
          },
          publishedDate: { $gte: body.startDate, $lte: body.endDate },
        }).countDocuments();

        const avgImpactScoreV3 = await Cve.aggregate([
          {
            $match: {
              $and: [
                {
                  'description.description_data.value': {
                    $regex: body.filters[i],
                    $options: 'i',
                  },
                },
                {
                  publishedDate: {
                    $gte: new Date(body.startDate),
                    $lte: new Date(body.endDate),
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: null,
              avg: { $avg: '$impact.baseMetricV3.impactScore' },
            },
          },
        ]);

        const avgImpactScoreV2 = await Cve.aggregate([
          {
            $match: {
              'description.description_data.value': {
                $regex: body.filters[i],
                $options: 'i',
              },
              publishedDate: {
                $gte: new Date(body.startDate),
                $lte: new Date(body.endDate),
              },
            },
          },
          {
            $group: {
              _id: null,
              avg: { $avg: '$impact.baseMetricV2.impactScore' },
            },
          },
        ]);

        var resultJson = {
          filter: body.filters[i].toUpperCase(),
          noOfCVEs: countFilterResult,
          avgImpactScoreV2: parseFloat(avgImpactScoreV2[0].avg.toFixed(2)),
          avgImpactScoreV3: parseFloat(avgImpactScoreV3[0].avg.toFixed(2)),
        };
        result.push(resultJson);
      }

      console.log(result);

      return result;
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = cve;
