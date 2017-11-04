DEPLOY_URL=https://locdb.bib.uni-mannheim.de/extrapolate/
echo "Building for $DEPLOY_URL"
ng build -e prod --deploy-url "$DEPLOY_URL"
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate/
