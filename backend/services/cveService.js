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
  getCvesByMonth: async (body) => {
    try {
      const FIRST_MONTH = 1;
      const LAST_MONTH = 12;
      const MONTHS_ARRAY = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      let TODAY = new Date();
      let YEAR_BEFORE = new Date(new Date().setFullYear(new Date().getFullYear() - 1));

      const result = await Cve.aggregate([
        {
          $match: {
            publishedDate: { $gte: YEAR_BEFORE, $lte: TODAY },
          },
        },
        {
          $group: {
            _id: { year_month: { $substrCP: ['$publishedDate', 0, 7] } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year_month': 1 },
        },
        {
          $project: {
            _id: 0,
            count: 1,
            month_year: {
              $concat: [
                {
                  $arrayElemAt: [
                    MONTHS_ARRAY,
                    {
                      $subtract: [
                        { $toInt: { $substrCP: ['$_id.year_month', 5, 2] } },
                        1,
                      ],
                    },
                  ],
                },
                '-',
                { $substrCP: ['$_id.year_month', 0, 4] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            data: { $push: { k: '$month_year', v: '$count' } },
          },
        },
        {
          $addFields: {
            start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
            end_year: { $substrCP: [TODAY, 0, 4] },
            months1: {
              $range: [
                { $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } },
                { $add: [LAST_MONTH, 1] },
              ],
            },
            months2: {
              $range: [
                FIRST_MONTH,
                { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] },
              ],
            },
          },
        },
        {
          $addFields: {
            template_data: {
              $concatArrays: [
                {
                  $map: {
                    input: '$months1',
                    as: 'm1',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [
                          { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ['$$m1', 1] }] },
                          '-',
                          '$start_year',
                        ],
                      },
                    },
                  },
                },
                {
                  $map: {
                    input: '$months2',
                    as: 'm2',
                    in: {
                      count: 0,
                      month_year: {
                        $concat: [
                          { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ['$$m2', 1] }] },
                          '-',
                          '$end_year',
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $addFields: {
            data: {
              $map: {
                input: '$template_data',
                as: 't',
                in: {
                  k: '$$t.month_year',
                  v: {
                    $reduce: {
                      input: '$data',
                      initialValue: 0,
                      in: {
                        $cond: [
                          { $eq: ['$$t.month_year', '$$this.k'] },
                          { $add: ['$$this.v', '$$value'] },
                          { $add: [0, '$$value'] },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            data: { $arrayToObject: '$data' },
            _id: 0,
          },
        },
      ]);

      const resultArray = Object.entries(result[0].data).map((object) => ({
        ['date']: object[0].replace('-', ' '),
        ['count']: object[1],
      }));

      return resultArray;
    } catch (err) {
      console.log(err);
    }
  },
  getLatestHighScoreCves: async (skip) => {
    const noCvesToSkip = skip && /^\d+$/.test(skip) ? Number(skip) : 0;

    const result = await Cve.find({
      'impact.baseMetricV2.cvssV2.baseScore': { $gt: 7.5 },
    })
      .sort('-publishedDate')
      .skip(noCvesToSkip)
      .limit(10);

    return result;
  },
};

module.exports = cve;
