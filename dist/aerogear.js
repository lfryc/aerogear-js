var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
      callback = mod.callback,
      reified = [],
      exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();


(function(globals) {
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

//
define(
    "aerogear.ajax",
    ["aerogear.core", "exports"],
    function(aerogear$core$$, __exports__) {
        "use strict";

        function __es6_export__(name, value) {
            __exports__[name] = value;
        }

        var extend;
        extend = aerogear$core$$["extend"];

        /**
            The AeroGear.ajax is used to perform Ajax requests.
            @status Experimental
            @param {Object} [settings={}] - the settings to configure the request
            @param {String} [settings.url] - the url to send the request to
            @param {String} [settings.type="GET"] - the type of the request
            @param {String} [settings.dataType="json"] - the data type of the recipient's response
            @param {String} [settings.accept="application/json"] - the media types which are acceptable for the recipient's response
            @param {String} [settings.contentType="application/json"] - the media type of the entity-body sent to the recipient
            @param {Object} [settings.headers] - the HTTP request headers
            @param {Object} [settings.params] - contains query parameters to be added in URL in case of GET request or in request body in case of POST and application/x-www-form-urlencoded content type
            @param {Object} [settings.data] - the data to be sent to the recipient
            @returns {Object} An ES6 Promise - the object returned will look like:

            {
                data: dataOrError, - the data or an error
                statusText: statusText, - the status of the response
                agXHR: request - the xhr request object
            };

            @example

                var es6promise = AeroGear.ajax({
                    type: "GET",
                    params: {
                        param1: "val1"
                    },
                    url: "http://SERVER:PORT/CONTEXT"
                });
        */
        var ajax = function( settings ) {
            return new Promise( function( resolve, reject ) {
                settings = settings || {};

                var request = new XMLHttpRequest(),
                    that = this,
                    requestType = ( settings.type || "GET" ).toUpperCase(),
                    responseType = ( settings.dataType || "json" ).toLowerCase(),
                    accept = ( settings.accept || "application/json" ).toLowerCase(),
                    // TODO: compare contentType by checking if it starts with some value since it might contains the charset as well
                    contentType = ( settings.contentType || "application/json" ).toLowerCase(),
                    header,
                    name,
                    urlEncodedData = [],
                    url = settings.url,
                    data = settings.data;

                if ( settings.params ) {
                    // encode params
                    if( requestType === "GET" || ( requestType === "POST" && contentType === "application/x-www-form-urlencoded" ) ) {
                        for( name in settings.params ) {
                            urlEncodedData.push( encodeURIComponent( name ) + "=" + encodeURIComponent( settings.params[ name ] || "" ) );
                        }
                    // add params in request body
                    } else if ( contentType === "application/json" ) {
                        data = data || {};
                        data.params = data.params || {};
                        extend( data.params,  settings.params );
                    }
                }

                if ( contentType === "application/x-www-form-urlencoded" ) {
                    if ( data ) {
                        for( name in data ) {
                            urlEncodedData.push( encodeURIComponent( name ) + '=' + encodeURIComponent( data[ name ] ) );
                        }
                    }
                    data = urlEncodedData.join( "&" );
                }

                // if is GET request & URL params exist then add them in URL
                if( requestType === "GET" && urlEncodedData.length > 0 ) {
                    url += "?" + urlEncodedData.join( "&" );
                }

                request.open( requestType, url, true, settings.username, settings.password );

                request.responseType = responseType;
                request.setRequestHeader( "Content-Type", contentType );
                request.setRequestHeader( "Accept", accept );

                if( settings.headers ) {
                    for ( header in settings.headers ) {
                        request.setRequestHeader( header, settings.headers[ header ] );
                    }
                }

                // Success and 400's
                request.onload = function() {
                    var status = ( request.status < 400 ) ? "success" : "error",
                        promiseValue = _createPromiseValue( request, status );

                    if( status === "success" ) {
                        return resolve( promiseValue );
                    }

                    return reject( promiseValue );
                };

                // Network errors
                request.onerror = function() {
                    var status = "error";

                    reject( _createPromiseValue( request, status ) );
                };

                // create promise arguments
                function _createPromiseValue( request, status ) {
                    var statusText = request.statusText || status,
                        dataOrError = ( responseType === 'text' || responseType === '') ? request.responseText : request.response;

                    return {
                        data: dataOrError,
                        statusText: statusText,
                        agXHR: request
                    };
                };

                request.send( data );
            });
        };

        __es6_export__("default", ajax);
    }
);

//
define(
    "aerogear.authz",
    ["aerogear.core", "exports"],
    function(aerogear$core$$, __exports__) {
        "use strict";

        function __es6_export__(name, value) {
            __exports__[name] = value;
        }

        var AeroGear;
        AeroGear = aerogear$core$$["AeroGear"];
        var Core;
        Core = aerogear$core$$["Core"];

        /**
            The AeroGear.Authorization namespace provides an authentication API.
            @status Experimental
            @class
            @param {String|Array|Object} [config] - A configuration for the service(s) being created along with the authorizer. If an object or array containing objects is used, the objects can have the following properties:
            @param {String} config.name - the name that the module will later be referenced by
            @param {String} [config.type="OAuth2"] - the type of module as determined by the adapter used
            @param {Object} [config.settings={}] - the settings to be passed to the adapter. For specific settings, see the documentation for the adapter you are using.
            @returns {Object} The created authorizer containing any authz services that may have been created
            @example
            // Create an empty authorizer
            var authz = AeroGear.Authorization();
         */
        function Authorization ( config ) {
            // Allow instantiation without using new
            if ( !( this instanceof Authorization ) ) {
                return new Authorization( config );
            }

            // Super constructor
            Core.call( this );

            this.lib = "Authorization";
            this.type = config ? config.type || "OAuth2" : "OAuth2";

            /**
                The name used to reference the collection of service instances created from the adapters
                @memberOf AeroGear.Authorization
                @type Object
                @default services
             */
            this.collectionName = "services";

            this.add( config );
        }

        Authorization.prototype = Core;
        Authorization.constructor = Core.Authorization;

        /**
            The adapters object is provided so that adapters can be added to the AeroGear.Authorization namespace dynamically and still be accessible to the add method
            @augments AeroGear.Authorization
         */
        Authorization.adapters = {};

        AeroGear.Authorization = Authorization;

        __es6_export__("Authorization", Authorization);
    }
);

//
define(
    "oauth2",
    ["aerogear.core", "aerogear.ajax", "aerogear.authz", "exports"],
    function(aerogear$core$$, aerogear$ajax$$, aerogear$authz$$, __exports__) {
        "use strict";

        function __es6_export__(name, value) {
            __exports__[name] = value;
        }

        var extend;
        extend = aerogear$core$$["extend"];
        var ajax;
        ajax = aerogear$ajax$$["default"];
        var Authorization;
        Authorization = aerogear$authz$$["Authorization"];


        /**
            The OAuth2 adapter is the default type used when creating a new authorization module. It uses AeroGear.ajax to communicate with the server.
            This constructor is instantiated when the "Authorizer.add()" method is called
            @status Experimental
            @constructs AeroGear.Authorization.adapters.OAuth2
            @param {String} name - the name used to reference this particular authz module
            @param {Object} settings={} - the settings to be passed to the adapter
            @param {String} settings.clientId - the client id/ app Id of the protected service
            @param {String} settings.redirectURL - the URL to redirect to
            @param {String} settings.authEndpoint - the endpoint for authorization
            @param {String} [settings.validationEndpoint] - the optional endpoint to validate your token.  Not in the Spec, but recommend for use with Google's API's
            @param {String} settings.scopes - a space separated list of "scopes" or things you want to access
            @returns {Object} The created authz module
            @example
            // Create an empty Authenticator
            var authz = AeroGear.Authorization();

            authz.add({
                name: "coolThing",
                settings: {
                    clientId: "12345",
                    redirectURL: "http://localhost:3000/redirector.html",
                    authEndpoint: "http://localhost:3000/v1/authz",
                    scopes: "userinfo coolstuff"
                }
            });
         */
        Authorization.adapters.OAuth2 = function( name, settings ) {
            // Allow instantiation without using new
            if ( !( this instanceof Authorization.adapters.OAuth2 ) ) {
                return new Authorization.adapters.OAuth2( name, settings );
            }

            settings = settings || {};

            // Private Instance vars
            var state = uuid(), //Recommended in the spec,
                clientId = settings.clientId, //Required by the spec
                redirectURL = settings.redirectURL, //optional in the spec, but doesn't make sense without it,
                validationEndpoint = settings.validationEndpoint, //optional,  not in the spec, but recommend to use with Google's API's
                scopes = settings.scopes, //Optional by the spec
                accessToken,
                localStorageName = "ag-oauth2-" + clientId,
                authEndpoint = settings.authEndpoint + "?" +
                    "response_type=token" +
                    "&redirect_uri=" + encodeURIComponent( redirectURL ) +
                    "&scope=" + encodeURIComponent( scopes ) +
                    "&state=" + encodeURIComponent( state ) +
                    "&client_id=" + encodeURIComponent( clientId );

            // Privileged Methods
            /**
                Returns the value of the private settings var
                @private
                @augments OAuth2
             */
            this.getAccessToken = function() {
                if( localStorage[ localStorageName ] ) {
                    accessToken = JSON.parse( localStorage[ localStorageName ] ).accessToken;
                }

                return accessToken;
            };

            /**
                Returns the value of the private settings var
                @private
                @augments OAuth2
             */
            this.getState = function() {
                return state;
            };

            /**
                Returns the value of the private settings var
                @private
                @augments OAuth2
             */
            this.getClientId = function() {
                return clientId;
            };

            /**
                Returns the value of the private settings var
                @private
                @augments OAuth2
             */
            this.getLocalStorageName = function() {
                return localStorageName;
            };

            /**
                Returns the value of the private settings var
                @private
                @augments OAuth2
             */
            this.getValidationEndpoint = function() {
                return validationEndpoint;
            };

            /**
                Enrich the error response with authentication endpoint URL and re-throw the error
                @private
                @augments OAuth2
             */
            this.enrichErrorAndRethrow = function( err ) {
                err = err || {};
                throw extend( err, { authURL: authEndpoint } );
            };

            /**
                Returns the value of a parsed query string
                @private
                @augments OAuth2
             */
            this.parseQueryString = function( locationString ) {
                // taken from https://developers.google.com/accounts/docs/OAuth2Login
                // First, parse the query string
                var params = {},
                    queryString = locationString.substr( locationString.indexOf( "#" ) + 1 ),
                    regex = /([^&=]+)=([^&]*)/g,
                    m;
                while ( ( m = regex.exec(queryString) ) ) {
                    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                }
                return params;
            };
        };

        /**
            Validate the Authorization endpoints - Takes the querystring that is returned after the "dance" unparsed.
            @param {String} queryString - The returned query string to be parsed
            @returns {Object} The ES6 promise (exposes AeroGear.ajax response as a response parameter; if an error is returned, the authentication URL will be appended to the response object)
            @example
            // Create the Authorizer
            var authz = AeroGear.Authorization();

            authz.add({
                name: "coolThing",
                settings: {
                    clientId: "12345",
                    redirectURL: "http://localhost:3000/redirector.html",
                    authEndpoint: "http://localhost:3000/v1/authz",
                    scopes: "userinfo coolstuff"
                }
            });

            // Make the call.
            authz.services.coolThing.execute({url: "http://localhost:3000/v1/authz/endpoint", type: "GET"})
                .then( function( response ){
                    ...
                })
                .catch( function( error ) {
                    // an error happened, so take the authURL and do the "OAuth2 Dance",
                });
            });

            // After a successful response from the "OAuth2 Dance", validate that the query string is valid, If all is well, the access_token will be stored.
            authz.services.coolThing.validate( responseFromAuthEndpoint )
                .then( function( response ){
                    ...
                })
                .catch( function( error ) {
                    ...
                });

         */
        Authorization.adapters.OAuth2.prototype.validate = function( queryString ) {

            var that = this,
                parsedQuery = this.parseQueryString( queryString ),
                state = this.getState(),
                promise;

            promise = new Promise( function( resolve, reject ) {

                // Make sure that the "state" value returned is the same one we sent
                if( parsedQuery.state !== state ) {
                    // No Good
                    reject( { error: "invalid_request", state: state, error_description: "state's do not match"  } );
                    return;
                }

                if( that.getValidationEndpoint() ) {
                    ajax({ url: that.getValidationEndpoint() + "?access_token=" + parsedQuery.access_token })
                        .then( function( response ) {
                            // Must Check the audience field that is returned.  This should be the same as the registered clientID
                            // This value is a JSON object that is in xhr.response
                            if( that.getClientId() !== response.agXHR.response.audience ) {
                                reject( { "error": "invalid_token" } );
                                return;
                            }
                            // Perhaps we can use crypt here to be more secure
                            localStorage.setItem( that.getLocalStorageName(), JSON.stringify( { "accessToken": parsedQuery.access_token } ) );
                            resolve( parsedQuery );
                        })
                        .catch( function( err ) {
                            reject( { "error": "invalid_token" } );
                        });
                } else {
                    // The Spec does not specify that you need to validate the token
                    reject( parsedQuery );
                }
            });

            return promise
                .catch( this.enrichErrorAndRethrow );
        };

        /**
            @param {Object} options={} - Options to pass to the execute method
            @param {String} [options.type="GET"] - the type of the request
            @param {String} [options.url] - the url of the secured endpoint you want to access
            @returns {Object} The ES6 promise (exposes AeroGear.ajax response as a response parameter; if an error is returned, the authentication URL will be appended to the response object)
            @example
            // Create the Authorizer
            var authz = AeroGear.Authorization();

            authz.add({
                name: "coolThing",
                settings: {
                    clientId: "12345",
                    redirectURL: "http://localhost:3000/redirector.html",
                    authEndpoint: "http://localhost:3000/v1/authz",
                    scopes: "userinfo coolstuff"
                }
            });


            // Make the authorization call.
            authz.services.coolThing.execute()
                .then( function( response ){
                    ...
                })
                .catch( function( error ) {
                    ...
                });
         */
        Authorization.adapters.OAuth2.prototype.execute = function( options ) {
            options = options || {};
            var url = options.url + "?access_token=" + this.getAccessToken(),
                contentType = "application/x-www-form-urlencoded";

            return ajax({
                    url: url,
                    type: options.type,
                    contentType: contentType
                })
                .catch( this.enrichErrorAndRethrow );
        };

        __es6_export__("default", Authorization.adapters.OAuth2);
    }
);

//
// expose global AeroGear
globals.AeroGear = requireModule("aerogear.core")['AeroGear'];
// load all modules that we want to leverage (they will load dependencies transitively)
requireModule("oauth2");

})(window);


//# sourceMappingURL=aerogear.js.map