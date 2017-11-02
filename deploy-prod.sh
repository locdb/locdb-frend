BASE_HREF=https://locdb.bib.uni-mannheim.de/extrapolate/
echo "Building for $BASE_HREF"
ng build --base-href="$BASE_HREF"
sed -ie "s#<base href='/'>#<base href='$BASE_HREF'>#" dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate/
