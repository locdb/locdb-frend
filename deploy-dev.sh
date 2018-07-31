echo "Building for Development"
ng build --base-href "/extrapolate-dev/"
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate-dev/
echo "Copying .htaccess to remote web server"
scp dist/.htaccess locdb:/home/lga/www/extrapolate-dev/
