#!/usr/bin/env bash


# Cd into project root
REPO_ROOT=$( cd $(dirname "$0"); pwd -P)/..
cd "$REPO_ROOT" && echo "Entering $PWD" || exit 1

# The relative path under which the front-end will be accessible (including trailing slash)
BASE_HREF="/extrapolate-tue/"

# Relies on locdb registered as a host (including trailing slash)
REMOTE_PATH="locdb:/home/lga/www/extrapolate-tue/"

# Refers to a valid configurations of angular.json
BUILD_CONFIG="tue"





echo "Building for $REMOTE_PATH ($BASE_HREF) with config $BUILD_CONFIG"
ng build --base-href $BASE_HREF -c $BUILD_CONFIG || exit 1

# Print index.html to verify things like base href
cat dist/index.html

echo "Copying files to remote web server"
scp dist/* "$REMOTE_PATH"
echo "Copying .htaccess to remote web server"
scp dist/.htaccess "$REMOTE_PATH"
