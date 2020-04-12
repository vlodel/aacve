const fs = require('fs');
const mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const database = 'aacve';

const async = require('async');

mongoose
  .connect(`mongodb://${server}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('MongoDB connection successful.');

    let docsArray = [];

    fs.readdir('../cves', async (err, files) => {
      if (err) {
        console.log(`Unable to read directory: ` + err);
      } else {
        files.forEach((filePath) => {
          fs.readFile('../cves/' + filePath, (err, data) => {
            let jsonFile = JSON.parse(data);
            var cveArray = jsonFile.CVE_Items;

            for (const cveItem of cveArray) {
              if (
                !cveItem.cve.description.description_data[0].value.includes(
                  '** REJECT **'
                )
              ) {
                let optimizedCve = new cveModel({
                  id: cveItem.cve.CVE_data_meta.ID,
                  references: cveItem.cve.references,
                  description: cveItem.cve.description,
                  impact: cveItem.impact,
                  publishedDate: cveItem.publishedDate,
                  lastModifiedDate: cveItem.lastModifiedDate,
                });
                cveModel.findOneAndUpdate(
                  { id: optimizedCve.id },
                  optimizedCve,
                  { upsert: true, useFindAndModify: false },
                  (err, doc) => {
                    if (err) console.log(err);
                  }
                );
              }
            }
            console.log(filePath + ' read.');
          });
        });
      }
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err}`);
  });

let cveSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
    },
    references: {
      reference_data: [
        {
          url: {
            type: String,
            required: false,
            unique: false,
          },
        },
      ],
    },
    description: {
      description_data: [
        {
          value: {
            type: String,
            required: false,
            unique: false,
          },
        },
      ],
    },
    impact: {
      baseMetricV3: {
        cvssV3: {
          vectorString: {
            type: String,
            required: false,
            unique: false,
          },
          attackVector: {
            type: String,
            require: false,
            unique: false,
          },
          attackComplexity: {
            type: String,
            require: false,
            unique: false,
          },
          privilegesRequired: {
            type: String,
            require: false,
            unique: false,
          },
          userInteraction: {
            type: String,
            require: false,
            unique: false,
          },
          scope: {
            type: String,
            require: false,
            unique: false,
          },
          confidentialityImpact: {
            type: String,
            require: false,
            unique: false,
          },
          integrityImpact: {
            type: String,
            require: false,
            unique: false,
          },
          availabilityImpact: {
            type: String,
            require: false,
            unique: false,
          },
          baseScore: {
            type: Number,
            require: false,
            unique: false,
          },
          baseSeverity: {
            type: String,
            require: false,
            unique: false,
          },
        },
        exploitabilityScore: {
          type: Number,
          require: false,
          unique: false,
        },
        impactScore: {
          type: Number,
          require: false,
          unique: false,
        },
      },
      baseMetricV2: {
        cvssV2: {
          vectorString: {
            type: String,
            require: false,
            unique: false,
          },
          accessVector: {
            type: String,
            require: false,
            unique: false,
          },
          accessComplexity: {
            type: String,
            require: false,
            unique: false,
          },
          authentication: {
            type: String,
            require: false,
            unique: false,
          },
          confidentialityImpact: {
            type: String,
            require: false,
            unique: false,
          },
          integrityImpact: {
            type: String,
            require: false,
            unique: false,
          },
          availabilityImpact: {
            type: String,
            require: false,
            unique: false,
          },
          baseScore: {
            type: Number,
            require: false,
            unique: false,
          },
        },
        severity: {
          type: String,
          required: false,
          unique: false,
        },
        exploitabilityScore: {
          type: Number,
          require: false,
          unique: false,
        },
        impactScore: {
          type: Number,
          require: false,
          unique: false,
        },
        acInsufInfo: {
          type: Boolean,
          require: false,
          unique: false,
        },
        obtainAllPrivilege: {
          type: Boolean,
          require: false,
          unique: false,
        },
        obtainUserPrivilege: {
          type: Boolean,
          require: false,
          unique: false,
        },
        obtainOtherPrivilege: {
          type: Boolean,
          require: false,
          unique: false,
        },
        userInteractionRequired: {
          type: Boolean,
          require: false,
          unique: false,
        },
      },
    },
    publishedDate: {
      type: Date,
      require: false,
      unique: false,
    },
    lastModifiedDate: {
      type: Date,
      require: false,
      unique: false,
    },
  },
  { _id: false }
);

var cveModel = mongoose.model('cve', cveSchema);
