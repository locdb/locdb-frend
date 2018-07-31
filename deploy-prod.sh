echo "Building for Production"
ng build --base-href /extrapolate/ --prod || (echo "Failed to compile" && exit 1)
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate/
