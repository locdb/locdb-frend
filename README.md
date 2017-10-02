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

1. Run `ng build --base-href=<base-url>/PATH/TO/SITE/` to deploy files into dist
1. **with care**: Copy the files to the remote web server `scp dist/* <base-url>:/PATH/TO/SITE/`

## Development setup

[Source](https://github.com/angular/angular-cli#updating-angular-cli)

### Update angular-cli to the latest version

```sh
npm remove -g angular-cli
npm install -g @angular/cli@latest
```

### Install dependencies

```sh
rm -rf node_modules dist
npm install -g typescript
npm install
```

