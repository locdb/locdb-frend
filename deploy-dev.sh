DEPLOY_URL=https://locdb.bib.uni-mannheim.de/extrapolate-dev/
echo "Building for $DEPLOY_URL"
# ng build --deploy-url "$DEPLOY_URL" --base-href /extrapolate-dev/
ng build --base-href /extrapolate-dev/
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate-dev/
