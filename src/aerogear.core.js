export var AeroGear = {};

AeroGear.isArray = function( obj ) {
  return Array.isArray( obj );
};

AeroGear.extend = function() {
  var name, i, source,
    target = arguments[ 0 ];
  for( i=1; i<arguments.length; i++ ) {
    source = arguments[ i ];
    for( name in source ) {
      target[ name ] = source[ name ];
    }
  }
  return target;
};



export class Core {
  constructor() {
    throw "Core can't be instantiated directly";
  }

  add( config ) {
    var i,
      current,
      collection = this[ this.collectionName ] || {};
    this[ this.collectionName ] = collection;

    if ( !config ) {
      return this;
    } else if ( typeof config === "string" ) {
      // config is a string so use default adapter type
      collection[ config ] = AeroGear[ this.lib ].adapters[ this.type ]( config, this.config );
    } else if ( Array.isArray( config ) ) {
      // config is an array so loop through each item in the array
      for ( i = 0; i < config.length; i++ ) {
        current = config[ i ];

        if ( typeof current === "string" ) {
          collection[ current ] = AeroGear[ this.lib ].adapters[ this.type ]( current, this.config );
        } else {
          if( current.name ) {

            // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
            current.settings = AeroGear.extend( current.settings || {}, this.config );

            collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings );
          }
        }
      }
    } else {
      if( !config.name ) {
        return this;
      }

      // Merge the Module( pipeline, datamanger, ... )config with the adapters settings
      // config is an object so use that signature
      config.settings = AeroGear.extend( config.settings || {}, this.config );

      collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings );
    }

    // reset the collection instance
    this[ this.collectionName ] = collection;

    return this;
  };

  remove( config ) {
    var i,
      current,
      collection = this[ this.collectionName ] || {};

    if ( typeof config === "string" ) {
      // config is a string so delete that item by name
      delete collection[ config ];
    } else if ( Array.isArray( config ) ) {
      // config is an array so loop through each item in the array
      for ( i = 0; i < config.length; i++ ) {
        current = config[ i ];

        if ( typeof current === "string" ) {
          delete collection[ current ];
        } else {
          delete collection[ current.name ];
        }
      }
    } else if ( config ) {
      // config is an object so use that signature
      delete collection[ config.name ];
    }

    // reset the collection instance
    this[ this.collectionName ] = collection;

    return this;
  };


}

AeroGear.Core = Core;