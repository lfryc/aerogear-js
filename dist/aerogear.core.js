define("aerogear.core", ["exports"], function(__exports__) {
  "use strict";

  function __es6_export__(name, value) {
    __exports__[name] = value;
  }

  function Core() {
    // Prevent instantiation of this base class
    if ( this instanceof Core ) {
      throw "Invalid instantiation of base class AeroGear.Core";
    }

    /**
     This function is used by the different parts of AeroGear to add a new Object to its respective collection.
     @name AeroGear.add
     @method
     @param {String|Array|Object} config - This can be a variety of types specifying how to create the object. See the particular constructor for the object calling .add for more info.
     @returns {Object} The object containing the collection that was updated
     */
    this.add = function( config ) {
      var i,
        current,
        collection = this[ this.collectionName ] || {};
      this[ this.collectionName ] = collection;

      if ( !config ) {
        return this;
      } else if ( typeof config === "string" ) {
        // config is a string so use default adapter type
        collection[ config ] = Core[ this.lib ].adapters[ this.type ]( config, this.config );
      } else if ( Array.isArray( config ) ) {
        // config is an array so loop through each item in the array
        for ( i = 0; i < config.length; i++ ) {
          current = config[ i ];

          if ( typeof current === "string" ) {
            collection[ current ] = Core[ this.lib ].adapters[ this.type ]( current, this.config );
          } else {
            if( current.name ) {

              // Merge the Module( authz, datamanger, ... )config with the adapters settings
              current.settings = AeroGear.extend( current.settings || {}, this.config );

              collection[ current.name ] = AeroGear[ this.lib ].adapters[ current.type || this.type ]( current.name, current.settings );
            }
          }
        }
      } else {
        if( !config.name ) {
          return this;
        }

        // Merge the Module( authz, datamanger, ... )config with the adapters settings
        // config is an object so use that signature
        config.settings = AeroGear.extend( config.settings || {}, this.config );

        collection[ config.name ] = AeroGear[ this.lib ].adapters[ config.type || this.type ]( config.name, config.settings );
      }

      // reset the collection instance
      this[ this.collectionName ] = collection;

      return this;
    };
    /**
     This function is used internally by datamanager, etc. to remove an Object (store, etc.) from the respective collection.
     @name AeroGear.remove
     @method
     @param {String|String[]|Object[]|Object} config - This can be a variety of types specifying how to remove the object. See the particular constructor for the object calling .remove for more info.
     @returns {Object} The object containing the collection that was updated
     */
    this.remove = function( config ) {
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

  /**
   Utility function to merge many Objects in one target Object which is the first object in arguments list.
   @private
   @method
   */
  var extend = function() {
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

  var AeroGear = {
    Core: Core,
    extend: extend
  }

  __es6_export__("Core", Core);
  __es6_export__("AeroGear", AeroGear);
  __es6_export__("extend", extend);
});

//# sourceMappingURL=aerogear.core.js.map