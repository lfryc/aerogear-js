require([ 'tmp/aerogear.core' ], function( AeroGear ) {

	test( "Core module has all expected members", function() {
        ok( AeroGear );
        ok( AeroGear.isArray );
        ok( AeroGear.extend );
        ok( AeroGear.Core );
    });

    test( "Core class can't be instantiated directly", function() {
		console.log( AeroGear );
		try {
        	new AeroGear.Core();
        	fail( "Core class can't be instantiated directly" );
	    } catch(e) {
	    	ok ( "Core class can't be instantiated directly" )
	    }
    });

});