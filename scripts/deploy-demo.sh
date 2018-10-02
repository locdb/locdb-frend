# Cd into project root
REPO_ROOT=$( cd $(dirname "$0"); pwd -P)/..
cd "$REPO_ROOT" && echo "Entering $PWD" || exit 1

echo "Building for Demo"
ng build --base-href /demo-frontend/ -c demo || exit 1
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/demo/
echo "Copying .htaccess to remote web server"
scp dist/.htaccess locdb:/home/lga/www/demo/
