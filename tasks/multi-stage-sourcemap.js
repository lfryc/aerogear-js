var transfer = require("multi-stage-sourcemap").transfer;

module.exports = function ( grunt ) {

    grunt.registerMultiTask('multi-stage-sourcemap', function() {
        //var concatToMicro = grunt.file.read('dist/aerogear.core.concat.js.map');
        //var microToAmd = grunt.file.read('dist/aerogear.core.micro.js.map');
        //var amdToSource = grunt.file.read('dist/aerogear.core.amd.js.map');
        //
        //var concatToAmd = transfer({ fromSourceMap: concatToMicro, toSourceMap: microToAmd });
        //var concatToSource = transfer({ fromSourceMap: concatToAmd, toSourceMap: amdToSource });
        //
        ////grunt.file.write('dist/aerogear.core.min.map', concatToAmd);
        //console.log( concatToMicro );

        var bMap = grunt.file.read('dist/aerogear.core.micro.js.map');
        var cMap = grunt.file.read('dist/aerogear.core.concat.js.map');

        var cToAMap = transfer({fromSourceMap: cMap, toSourceMap: bMap});
        console.log(cToAMap);
    });
}