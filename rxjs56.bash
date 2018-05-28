#!/bin/bash

# The generated back-end interface can be migrated from rxjs 5 to rxjs 6

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
npm i -g rxjs-tslint
rxjs-5-to-6-migrate -p "$DIR"/tsconfig.json
