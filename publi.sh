CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TEMP_BRANCH=$(date +%s.%N | md5sum | cut -d ' ' -f 1)
set -x
git checkout --orphan "$TEMP_BRANCH"
npm install
npm run build
git reset .
git add -f index.html
git commit -m gh-pages
git push -f origin HEAD:gh-pages
git checkout -f "$CURRENT_BRANCH"
git branch -D "$TEMP_BRANCH"
