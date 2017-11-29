echo "Building for Production"
ng build --base-href /extrapolate/ -prod
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate/
