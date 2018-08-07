echo "Building for Demo"
ng build --base-href /demo-frontend/ -c demo || exit 1
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/demo/
echo "Copying .htaccess to remote web server"
scp dist/.htaccess locdb:/home/lga/www/demo/
