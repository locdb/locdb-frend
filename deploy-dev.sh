BASE_HREF=https://locdb.bib.uni-mannheim.de/extrapolate-dev/
echo "Building for $BASE_HREF"
ng build --base-href=$BASE_HREF || echo "Build failed, abort." && exit -1
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate-dev
