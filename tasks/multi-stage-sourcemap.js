var transfer = require("multi-stage-sourcemap").transfer;
var shell = require('shelljs');

module.exports = function ( grunt ) {

    grunt.registerMultiTask('multi-stage-sourcemap', function() {
        //var concatToMicro = grunt.file.read('dist/aerogear.core.concat.js.map');
        //var microToAmd = grunt.file.read('dist/aerogear.core.micro.js.map');
        //var amdToSource = grunt.file.read('dist/aerogear.core.amd.js.map');
        //
        //var concatToAmd = transfer({ fromSourceMap: concatToMicro, toSourceMap: microToAmd });
        //var concatToSource = transfer({ fromSourceMap: concatToAmd, toSourceMap: amdToSource });
        ////
        //////grunt.file.write('dist/aerogear.core.min.map', concatToAmd);
        ////console.log( concatToSource );
        //grunt.file.write('dist/aerogear.core.result.map', concatToSource);

        //var bMap = grunt.file.read('dist/aerogear.core.micro.js.map');
        //var cMap = grunt.file.read('dist/aerogear.core.concat.js.map');
        //
        //var cToAMap = transfer({fromSourceMap: cMap, toSourceMap: bMap});
        //console.log(cToAMap);



        var uglyToAmd = grunt.file.read('dist/aerogear.core.ugly.js.map');
        var amdToEs6 = grunt.file.read('dist/aerogear.core.amd.js.map');

        var uglyToEs6 = transfer({ fromSourceMap: uglyToAmd, toSourceMap: amdToEs6 });

        shell.mv('dist/aerogear.core.ugly.js.map', 'dist/aerogear.core.ugly.js.map.temp');
        grunt.file.write('dist/aerogear.core.ugly.js.map', uglyToEs6);
    });
}