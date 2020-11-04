# AACVE: Automated Analysis of Existing Vulnerabilities

AACVE is a web app that aims to act as a database for CVEs, but also provide different statistics based on the user's prefrences. The back-end of the application acts as a REST API that connects to a MongoDB, and populates it with CVEs provided by the [NVD data feeds](https://nvd.nist.gov/vuln/data-feeds).

## Example
[![Netlify Status](https://api.netlify.com/api/v1/badges/335d32a5-0a83-4f00-a12e-4e2df9a1bd4b/deploy-status)](https://app.netlify.com/sites/aacve/deploys)

[Live preview of the front-end](https://aacve.netlify.app/)

The back-end for the preview is hosted using [Heroku](https://www.heroku.com/).

## Installation

Use npm to install the required packages for the front-end and the back-end.

```bash
npm install
```

In order to use the back-end of the application you need a connection to either a local MongoDB or a cloud one.

Use the cveProvider and the cvePopulator to populate your database.

```bash
node cveProvider.js
node cvePopulator.js
```
Change the API_URL environment variable from the front-end to the address of your back-end.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0/)
