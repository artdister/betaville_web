THREE.BoundingBoxHelper = function ( object, hex ) {

    var color = hex || 0x888888;

    this.object = object;

    this.box = new THREE.Box3();

    THREE.Mesh.call( this, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: color, wireframe: true } ) );

};

THREE.BoundingBoxHelper.prototype = Object.create( THREE.Mesh.prototype );

THREE.BoundingBoxHelper.prototype.update = function () {

    this.box.setFromObject( this.object );

    this.box.size( this.scale );

    this.box.center( this.position );

};

    
// Computes the world-axis-aligned bounding box of an object (including its children),
// accounting for both the object's, and childrens', world transforms

THREE.Box3.prototype.setFromObject = ( function() {

    var v1 = new THREE.Vector3();

    return function( object ) {

        var scope = this;

        object.updateMatrixWorld( true );

        this.makeEmpty();

        object.traverse( function ( node ) {

            if ( node.geometry !== undefined && node.geometry.vertices !== undefined ) {

                var vertices = node.geometry.vertices;

                for ( var i = 0, il = vertices.length; i < il; i++ ) {

                    v1.copy( vertices[ i ] );

                    v1.applyMatrix4( node.matrixWorld );

                    scope.expandByPoint( v1 );

                }

            }

        } );

        return this;

    };

}());
