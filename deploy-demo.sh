echo "Building for Production"
ng build --base-href /demo/frontend/ --env=demo
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/demo/
