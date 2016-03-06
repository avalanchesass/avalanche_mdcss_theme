var ejs  = require('ejs');
var ext  = require('object-assign');
var fs   = require('fs');
var path = require('path');

module.exports = function (themeopts) {
    // set theme options object
    themeopts = Object(themeopts);

    // set theme logo
    themeopts.logo = themeopts.logo || 'mdcss-logo.png';

    // set theme title
    themeopts.title = themeopts.title || 'Style Guide';

    // set theme css
    themeopts.css = themeopts.css || ['style.css'];

    // set theme css
    themeopts.js = themeopts.js || [];

    // set example conf
    themeopts.examples = ext({
        base:    '',
        target:  '_self',
        css:     ['style.css'],
        js:      [],
        bodyjs:  [],
        htmlcss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;padding:0;position:static;width:auto',
        bodycss: 'background:none;border:0;clip:auto;display:block;height:auto;margin:0;padding:16px;position:static;width:auto'
    }, themeopts.examples);

    var orderDocs = function (docs) {
        docs.forEach(function (value, index) {
            // Make the source order the default order.
            // Because there are problems when sorting values with a default
            // order of 0 we set the index (=source order) as default order.
            // That way items with a explicitly set order could be lower ranked
            // than other items with no order (default 0) so we add a big
            // numnber to the explicitly set order to ensure it is higher than
            // the source order index.
            value.order = value.order ? value.order + 999999 : index;
        });
        docs.sort(function (a, b) {
            if (a.order < b.order)
                return -1;
            else if (a.order > b.order)
                return 1;
            else
                return 0;
        });
    };

    var orderDocsRecursive = function (docs) {
        orderDocs(docs);
        docs.forEach(function (doc) {
            if (doc.children) {
                orderDocsRecursive(doc.children);
            }
        });
    };

    // return theme
    return function (docs) {
        // set assets directory and template
        docs.assets   = path.join(__dirname, 'assets');
        docs.template = path.join(__dirname, 'template.ejs');

        // set theme options
        docs.themeopts = themeopts;

        // return promise
        return new Promise(function (resolve, reject) {
            // read template
            fs.readFile(docs.template, 'utf8', function (error, contents) {
                // throw if template could not be read
                if (error) reject(error);
                else {
                    // set examples options
                    docs.opts = ext({}, docs.opts, docs.themeopts);
                    orderDocsRecursive(docs.list);
                    // set compiled template
                    docs.template = ejs.compile(contents)(docs);

                    // resolve docs
                    resolve(docs);
                }
            });
        });
    };
};

module.exports.type = 'mdcss-theme';
