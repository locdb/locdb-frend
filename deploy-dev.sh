echo "Building for Development"
ng build --base-href "/extrapolate-dev/"
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate-dev/
