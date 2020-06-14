const { Cve } = require('../mongoose');
const { query } = require('express');

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
              avg: { $avg: '$impact.baseMetricV3.impactScore' },
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
              avg: { $avg: '$impact.baseMetricV2.impactScore' },
            },
          },
        ]);

        var resultJson = {
          filter: body.filters[i].toUpperCase(),
          noOfCVEs: countCurrentFilterResult,
          avgImpactScoreV2: parseFloat(avgV2[0].avg).toFixed(2),
          avgImpactScoreV3: parseFloat(avgV3[0].avg).toFixed(2),
        };
        result.push(resultJson);
      }

      return result;
    } catch (err) {
      console.log(err);
    }

    // try {
    //   var result = [];
    //   console.log(body.filters);
    //   for (let i = 0; i < body.filters.length; i++) {
    //     var filterRegxp = '';
    //     const filters = body.filters[i].split(' ');

    //     for (let i = 0; i < filters.length; i++) {
    //       filterRegxp += '(?=.*?\\b' + filters[i] + ')';
    //     }

    //     filterRegxp += '^.*$';

    //     console.log(filterRegxp);

    //     const countCurrentFilterResult = await Cve.find({
    //       'description.description_data.value': {
    //         $regex: filterRegxp,
    //         $options: 'i',
    //       },
    //       publishedDate: { $gte: body.startDate, $lte: body.endDate },
    //     }).countDocuments();

    //     console.log(countCurrentFilterResult);

    //     const avgV3 = await Cve.aggregate([
    //       {
    //         $match: {
    //           $and: [
    //             {
    //               'description.description_data.value': {
    //                 $regex: filterRegxp,
    //                 $options: 'i',
    //               },
    //             },
    //             {
    //               publishedDate: {
    //                 $gte: new Date(body.startDate),
    //                 $lte: new Date(body.endDate),
    //               },
    //             },
    //           ],
    //         },
    //       },
    //       {
    //         $group: {
    //           _id: null,
    //           avg: { $avg: '$impact.baseMetricV3.impactScore' },
    //         },
    //       },
    //     ]);

    //     const avgV2 = await Cve.aggregate([
    //       {
    //         $match: {
    //           'description.description_data.value': {
    //             $regex: filterRegxp,
    //             $options: 'i',
    //           },
    //           publishedDate: {
    //             $gte: new Date(body.startDate),
    //             $lte: new Date(body.endDate),
    //           },
    //         },
    //       },
    //       {
    //         $group: {
    //           _id: null,
    //           avg: { $avg: '$impact.baseMetricV2.impactScore' },
    //         },
    //       },
    //     ]);

    //     var resultJson = {
    //       filter: body.filters[i].toUpperCase(),
    //       noOfCVEs: countCurrentFilterResult,
    //       avgImpactScoreV2: parseFloat(avgV2[0].avg).toFixed(2),
    //       avgImpactScoreV3: parseFloat(avgV3[0].avg).toFixed(2),
    //     };
    //     result.push(resultJson);
    //   }

    //   return result;
    // } catch (err) {
    //   console.log(err);
    // }
  },
};

module.exports = cve;
