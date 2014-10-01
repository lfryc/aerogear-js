var SourceMapGenerator = require('source-map').SourceMapGenerator;
var util = require('util');
var fs = require('fs');

module.exports = function ( grunt ) {

    grunt.registerMultiTask('microlibMap', function() {
        var sourceMappingURL = '\n//# sourceMappingURL=aerogear.core.micro.js.map',
            map = new SourceMapGenerator({
                file: "aerogear.core.micro.js"
            });

        map.addMapping({
            generated: {
               line: 2,
               column: 1
            },
            source: 'aerogear.core.amd.js',
            original: {
                line: 1,
                column: 1
            }
        });

        fs.writeFileSync('dist/aerogear.core.micro.js.map', map.toString());
        fs.appendFileSync('dist/aerogear.core.micro.js', sourceMappingURL);
    });
}