var SourceMapGenerator = require('source-map').SourceMapGenerator;
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var util = require('util');
var fs = require('fs');

module.exports = function ( grunt ) {

    grunt.registerMultiTask('microlibMap', function() {
        var sourceFile = fs.readFileSync( 'dist/aerogear.core.amd.js.map', { encoding: 'utf8' } );
        var consumer = new SourceMapConsumer( sourceFile );

        var sourceMappingURL = '\n//# sourceMappingURL=aerogear.core.micro.js.map',
            map = new SourceMapGenerator({
                file: "aerogear.core.micro.js"
            });

        consumer.eachMapping( function( mapping) {
            map.addMapping({
                source: 'aerogear.core.amd.js',
                original: {
                    line: mapping.generatedLine,
                    column: mapping.generatedColumn
                },
                generated: {
                    line: mapping.generatedLine + 1,
                    column: mapping.generatedColumn
                }
            });
        }, null, SourceMapConsumer.GENERATED_ORDER );

        fs.writeFileSync('dist/aerogear.core.micro.js.map', map.toString());
        fs.appendFileSync('dist/aerogear.core.micro.js', sourceMappingURL);
    });
}