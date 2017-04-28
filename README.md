# LOCDB Fr(ont-)end

[![Travis badge](https://travis-ci.org/locdb/locdb-frend.svg?branch=master)](https://travis-ci.org/)
[![Greenkeeper badge](https://badges.greenkeeper.io/locdb/locdb-frend.svg)](https://greenkeeper.io/)
[![Docker Automated build](https://img.shields.io/docker/automated/locdb/locdb-frend.svg)](https://hub.docker.com/r/locdb/locdb-frend/)

This repository provides a guided user interface for extrapolation of new data for the [Linked Open Citation Data Base](https://github.com/locdb/loc-db).
More specific, two views are provided:

- `FLUP` - An assistant for file upload of reference lists.
- `Extrapolite` - An assistant for linking bibliographic resources from these reference lists.

## Branch policy

The `master` branch contains the most recent stable version of the front-end.
The `dev` branch contains nightly builds.


## Basic setup as local service

1. Clone this repository and run `npm install` to install dependencies.
2. Run `ng serve` and access the prototype via `localhost:4200`

## Deployment on remote web server

1. Run `ng build --base-href=<base-url>` to deploy files into dist
2. WITH CARE: Copy the files to the remote webserver `scp dist/* <web-server-url>:~/public_html/`
