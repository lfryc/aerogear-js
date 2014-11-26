var sourceMap = require("source-map");
var Generator = sourceMap.SourceMapGenerator;
var Consumer = sourceMap.SourceMapConsumer;

module.exports = function ( grunt ) {

  grunt.registerMultiTask('correct-sourcemap', function() {
    var data = this.data,
      origMap, toMap, resultMap;

    origMap = grunt.file.read( data.from );
    var origSMC = new Consumer( origMap );

    resultMap = new Generator();

    var lastLine = 0;
    var mappedLine = null;
    var lastOffset = null;
    var justTheShift = false;
    var lastLineMappings = [];

    origSMC.eachMapping(function (mapping) {

      if (lastLine !== mapping.originalLine) {
        if (justTheShift && lastLineMappings.length > 0) {
          var mapping = lastLineMappings[0];
          resultMap.addMapping({
            source: mapping.source,
            name : mapping.name,
            generated: {
              line: mapping.generatedLine,
              column: mapping.generatedColumn
            },
            original: {
              line: mapping.originalLine,
              column: mapping.originalColumn
            }
          });
        }
        lastLine = mapping.originalLine;
        lastOffset = null;
        justTheShift = true;
        lastLineMappings = [];
      }
      lastLineMappings.push(mapping);
      if (justTheShift !== false) {
        var offset = mapping.generatedColumn - mapping.originalColumn;
        if (mappedLine === null) {
          mappedLine = mapping.generatedLine;
          lastOffset = offset;
        } else if (mappedLine === mapping.generatedLine) {
          if (lastOffset !== offset) {
            justTheShift = false;
          }
        }
      }
    });

    if (justTheShift && lastLineMappings.length > 0) {
      var mapping = lastLineMappings[0];
      resultMap.addMapping({
        source: mapping.source,
        name : mapping.name,
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        },
        original: {
          line: mapping.originalLine,
          column: mapping.originalColumn
        }
      });
    }

    if (origSMC.sources && origSMC.sourcesContent) {
      origSMC.sourcesContent.forEach(function(sourceContent, index) {
        if (sourceContent && origSMC.sources[index]) {
          resultMap.setSourceContent(origSMC.sources[index], sourceContent);
        }
      });
    }


    grunt.file.write( data.output, resultMap );
  });
}