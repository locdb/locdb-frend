# LOCDB Fr(ont-)end

[![Travis badge](https://travis-ci.org/locdb/locdb-frend.svg?branch=master)](https://travis-ci.org/)
[![Greenkeeper badge](https://badges.greenkeeper.io/locdb/locdb-frend.svg)](https://greenkeeper.io/)
[![Docker Automated build](https://img.shields.io/docker/automated/locdb/locdb-frend.svg)](https://hub.docker.com/r/locdb/locdb-frend/)

This repository provides a guided user interface for extrapolation of new data
for the [Linked Open Citation Data Base](https://github.com/locdb/loc-db).
More specific, two views are provided:

- `FLUP` - An assistant for file upload of reference lists.
- `Extrapolite` - An assistant for linking bibliographic resources from these
  reference lists.

## Basic setup

1. Clone this repository and run `npm install` to install dependencies.
1. Run `ng serve` and access the prototype via `localhost:4200`

## Deployment on remote web server

1. Run `ng build --base-href=/<subdir>/` to deploy files into dist
1. **with care**: Copy the files to the remote web server `scp dist/* <server>:/<PATH/TO/SITE/>`

## Development setup



### Update angular-cli to the latest version

```sh
npm remove -g angular-cli
npm install -g @angular/cli@latest
```

[Source](https://github.com/angular/angular-cli#updating-angular-cli)

### Install dependencies

```sh
rm -rf node_modules dist
npm install -g typescript
npm install
```

## Rebuild back-end client

1. Go to [Swagger Code Generator](http://generator.swagger.io/)
2. Select `POST /gen/clients/{language}` 'Generates a client library' and press 'Try it out' button
3. Select `typescript-angular` as the target language for the client library and insert the following snippet as body:

  ```json
  {
    "spec": {},
    "options": {
      "modelPropertyNaming": "original",
      "ngVersion": "5.2"
    },
    "swaggerUrl": "https://locdb.bib.uni-mannheim.de/locdb-dev/swagger",
    "authorizationValue": {
      "value": "string",
      "type": "string",
      "keyName": "string"
    },
    "securityDefinition": {
      "type": "string",
      "description": "string"
    }
  }
  ```

4. Press `Execute` button and inspect the response body for the `link`.
5. Unzip the downloaded code and place `typescript-angular2-client` as subdirectory in `src/app`.


## Development Resources

- [Angular Docs](https://angular.io/docs)
- [Bootstrap 4 Introduction]([https://getbootstrap.com/docs/4.0/getting-started/introduction/)
- [Jasmine Introduction](https://jasmine.github.io/edge/introduction.html)
- [OCC Metadata Model](https://figshare.com/articles/Metadata_for_the_OpenCitations_Corpus/3443876)
