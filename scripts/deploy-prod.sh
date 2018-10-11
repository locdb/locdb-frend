# Cd into project root
REPO_ROOT=$( cd $(dirname "$0"); pwd -P)/..
cd "$REPO_ROOT" && echo "Entering $PWD" || exit 1

echo "Building for Production"
ng build --base-href /extrapolate/ --prod || (echo "Failed to compile" && exit 1)
cat dist/index.html
echo "Copying files to remote web server"
scp dist/* locdb:/home/lga/www/extrapolate/
echo "Copying .htaccess to remote web server"
scp dist/.htaccess locdb:/home/lga/www/extrapolate/
