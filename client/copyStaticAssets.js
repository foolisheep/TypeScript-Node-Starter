const cp = require("shelljs").cp;

cp("-R", "public/js/lib", "build/static/js/");
cp("-R", "public/fonts", "build/static/");
cp("-R", "public/images", "build/static/");
