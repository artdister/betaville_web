/**
 * @author Bjorn Sandvik / http://thematicmapping.org/
 */

THREE.WcsTerrainLoader = function ( manager ) {

    this.ground = new Array();
    this.ground["x"] = new Array();
    this.ground["y"] = new Array();
    this.ground["z"] = new Array();
    thatTerrainLoader = this;
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.WcsTerrainLoader.prototype = {

    constructor: THREE.TerrainLoader,

    load: function ( url, onLoad, onProgress, onError ) {

        var scope = this;
        var request = new XMLHttpRequest();

        if ( onLoad !== undefined ) {

            request.addEventListener( 'load', function ( event ) {
             
                onLoad( event.target.response.split( "\n" ).map( function( value ) {
                    var ground = new Array();
                    ground.push(parseFloat( value.split( ' ' )[0])); //push X
                    ground.push(parseFloat( value.split( ' ' )[2])); //push Y
                    ground.push(parseFloat( value.split( ' ' )[1])); //push z
             
                    return ground;
                } ) );

                scope.manager.itemEnd( url );

            }, false );

        }

        if ( onProgress !== undefined ) {

            request.addEventListener( 'progress', function ( event ) {

                onProgress( event );

            }, false );

        }

        if ( onError !== undefined ) {

            request.addEventListener( 'error', function ( event ) {

                onError( event );

            }, false );

        }

        if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;

        request.open( 'GET', url, true );

        request.send( null );

        scope.manager.itemStart( url );

    },

    parse: function ( url, onLoad, onProgress, onError ) {

        var scope = this;
        var request = new XMLHttpRequest();

        if ( onLoad !== undefined ) {

        
        
                onLoad( url.split( "\n" ).map( function( value ) {
                    
                    if(value == ""){
                        return "empty";
                    }else{
                        var ground = new Array();
                        ground.push(parseFloat( value.split( ' ' )[0])); //push X
                        ground.push(parseFloat( value.split( ' ' )[2])); //push Y
                        ground.push(parseFloat( value.split( ' ' )[1])); //push z

                        return ground;                        
                    }
                    
                }));

                scope.manager.itemEnd( url );

       

        }

        if ( onProgress !== undefined ) {

         

                onProgress( event );

       

        }

        if ( onError !== undefined ) {



                onError( event );

     

        }



        scope.manager.itemStart( url );

    },
    setCrossOrigin: function ( value ) {

        this.crossOrigin = value;

    }

};