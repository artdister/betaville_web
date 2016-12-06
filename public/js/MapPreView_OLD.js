function MapPreView(city){
		console.log("leaflet Load");
		thatpreView = this;
		thisCore = new Core();
		this.ray = new Raycaster();
		this.projector = new THREE.Projector();
		this.meshArry = new Array();

		this.mousePos = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		this.directionVector = new THREE.Vector3();

		this.dbArray = new Array();


		this.intersected;
		this.dae = new THREE.Object3D();
		this.container = document.getElementById( 'glPreView' );

		this.camera = new THREE.PerspectiveCamera( 45, this.container.clientWidth/this.container.clientHeight, 0.01, 2000000 );

		this.scene = new THREE.Scene();
		this.octree = new THREE.Octree( {
				// uncomment below to see the octree (may kill the fps)
				//scene: scene,
				// when undeferred = true, objects are inserted immediately
				// instead of being deferred until next octree.update() call
				// this may decrease performance as it forces a matrix update
				undeferred: false,
				// set the max depth of tree
				depthMax: Infinity,
				// max number of objects before nodes split or merge
				objectsThreshold: 8,
				// percent between 0 and 1 that nodes will overlap each other
				// helps insert objects that lie over more than one node
				overlapPct: 0
			} );
		// Grid

		

		


		
	

		// Lights

	//	var hemiLight = new THREE.HemisphereLight( 0x00000, 0x00000, 2);
    //  	hemiLight.color.setHSL( 0.0, 0.0, 0.75 );
    //   	this.scene.add( hemiLight );
		


		this.scene.add( new THREE.AmbientLight( 0xcccccc ) );

		var dl1 = new THREE.DirectionalLight(0xeeeeee, 0.5 );
		dl1.position.x =  0;
		dl1.position.y = 10;
		dl1.position.z = -100;
		dl1.position.normalize();
		this.scene.add( dl1 );

		var dl2 = new THREE.DirectionalLight(0xeeeeee, 0.5 );
		dl2.position.x =  0;
		dl2.position.y = 10;
		dl2.position.z = 100;
		dl2.position.normalize();
		this.scene.add( dl2 );


		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( this.container.devicePixelRatio );
		this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );
		this.renderer.domElement.style.position =  "absolute";
		this.container.appendChild( this.renderer.domElement );
		
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		//this.createObjInfoSection();


	/*	var flag = 0;
		this.renderer.domElement.addEventListener( 'mousemove', thatpreView.onDocumentMouseMove, false );
	
		this.renderer.domElement.addEventListener("mousedown", function(){
		    flag = 0;
		}, false);
		this.renderer.domElement.addEventListener("mousemove", function(){
		    flag = 1;
		}, false);
		this.renderer.domElement.addEventListener("mouseup", function(e){
		    if(flag === 0){
		       thatpreView.onDocumentMouseclick(e);
		    }
		    else if(flag === 1){
		     	//on mouse hold
		    }
		}, false);
	*/

	JSZipUtils.getBinaryContent('../storage/app/'+city.hightmap, function(err,file){
	
			var zip = new JSZip(file);
			var objData = zip.file(city.name.toLowerCase()+".xyz").asText();
			thatground.terrain.load(objData, thatpreView.addTerrainToscene );
			animate();
	
		

	})
	

		
}
MapPreView.prototype.addTerrainToscene = function(){

	
	var geometry = thatground.terrain.plane.geometry;
	geometry.computeBoundingBox();
	boundingBox = geometry.boundingBox;

	var x0 = boundingBox.min.x;
	var x1 = boundingBox.max.x;
	var y0 = boundingBox.min.y;
	var y1 = boundingBox.max.y;
	var z0 = boundingBox.min.z;
	var z1 = boundingBox.max.z;


    var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;
    var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;
    var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;

    var centroidX = x0 + ( bWidth / 2 );
    var centroidY = y0 + ( bHeight / 2 );
    var centroidZ = z0 + ( bDepth / 2 );



	thatpreView.camera.position.set( centroidX, centroidY+8000, 0 );
	thatpreView.controls.target =  new THREE.Vector3(centroidX, centroidY, centroidZ);

	thatpreView.scene.add(thatground.terrain.plane);

}
MapPreView.prototype.loadJsonFromOSM = function(json, type){

	console.log(json);
	console.log(type);
	if(type == 'building'){

		this.loadBuildings(json);


	}




}

MapPreView.prototype.loadBuildings = function(json){

	this.buildings = new geoObjectLoader();
	this.buildings.loadBuilddingsFromJSON(json, thatpreView.addTOScene, true);



}



MapPreView.prototype.addTOScene = function(){
	
	thatpreView.scene.add(thatpreView.buildings.object);
	console.log(thatpreView.buildings.object);
}

MapPreView.prototype.render = function() {

	thatpreView.scene.updateMatrixWorld();
	//thatpreView.updateObjInfoSection();

	thatpreView.controls.update();

	thatpreView.renderer.render( thatpreView.scene, thatpreView.camera );

	thatpreView.camera.updateProjectionMatrix();

	thatpreView.octree.update();
}





MapPreView.prototype.disposeNode = function(node)
{
 if (node instanceof THREE.Camera)
    {
        node = undefined;
    }
    else if (node instanceof THREE.Light)
    {
        node.dispose ();
        node = undefined;
    }
    else if (node instanceof THREE.Mesh)
    {
        if (node.geometry)
        {
            node.geometry.dispose ();
          //  node.geometry = undefined;
        }

        if (node.material)
        {
            if (node.material instanceof THREE.MeshFaceMaterial)
            {
                $.each (node.material.materials, function (idx, mtrl)
                {
                    if (mtrl.map)           mtrl.map.dispose ();
                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
                    if (mtrl.envMap)        mtrl.envMap.dispose ();

                    mtrl.dispose ();    // disposes any programs associated with the material
                 //   mtrl = undefined;
                });
            }
            else
            {
                if (node.material.map)          node.material.map.dispose ();
                if (node.material.lightMap)     node.material.lightMap.dispose ();
                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
                if (node.material.normalMap)    node.material.normalMap.dispose ();
                if (node.material.specularMap)  node.material.specularMap.dispose ();
                if (node.material.envMap)       node.material.envMap.dispose ();

                node.material.dispose ();   // disposes any programs associated with the material
                //node.material = undefined;
            }
        }

       // node = undefined;
    }

}   // disposeNode

MapPreView.prototype.disposeHierarchy = function(node, callback)
{
    for (var i = 0; i < node.children.length-1; i++)
    {	
    
    	if (node.children[i] instanceof THREE.Mesh)
    	{		
        	var child = node.children[i];
        	thatpreView.disposeHierarchy (child, callback);
        	callback (child);
    	}
    	
    }
}

MapPreView.prototype.onDocumentMouseclick = function( event , flag){
		var x = ( event.layerX  / thatpreView.container.clientWidth ) * 2 - 1;
		var y = -( event.layerY / thatpreView.container.clientHeight ) * 2 + 1;

		thatpreView.directionVector.set(x, y, 1);
		thatpreView.projector.unprojectVector(thatpreView.directionVector, thatpreView.camera);
		
		// Substract the vector representing the camera position
		thatpreView.directionVector.sub(thatpreView.camera.position);

		    // Normalize the vector, to avoid large numbers from the
		    // projection and substraction
		    thatpreView.directionVector.normalize();
		     
		    // Now our direction vector holds the right numbers!
		    thatpreView.raycaster.set(thatpreView.camera.position, thatpreView.directionVector);
		
		    var intersects = thatpreView.raycaster.intersectObjects(thatpreView.meshArry, true);
			 	
				if(intersects.length > 0){
					
					
					console.log(intersects);
				}
				

}
MapPreView.prototype.onDocumentMouseMove = function( event ) {

		var x = ( event.layerX  / thatpreView.container.clientWidth ) * 2 - 1;
		var y = -( event.layerY / thatpreView.container.clientHeight ) * 2 + 1;

// thatpreView.container.clientWidth / thatpreView.container.clientHeight
// window.innerWidth / window.innerHeight

		thatpreView.directionVector.set(x, y, 1);
		thatpreView.projector.unprojectVector(thatpreView.directionVector, thatpreView.camera);
		
		// Substract the vector representing the camera position
		thatpreView.directionVector.sub(thatpreView.camera.position);

		    // Normalize the vector, to avoid large numbers from the
		    // projection and substraction
		    thatpreView.directionVector.normalize();
		
		     thatpreView.raycaster.set(thatpreView.camera.position, thatpreView.directionVector);
		    // Now our direction vector holds the right numbers!


var octreeResults = thatpreView.octree.search( thatpreView.raycaster.ray.origin, thatpreView.raycaster.ray.far, true, thatpreView.raycaster.ray.direction )
var intersections = thatpreView.raycaster.intersectOctreeObjects( octreeResults );

			//var intersections = thatpreView.raycaster.intersectObjects(thatpreView.meshArry);
			if ( intersections.length > 0 ) {

				if ( thatpreView.intersected != intersections[ 0 ].object ) {

					if ( thatpreView.intersected ) thatpreView.intersected.material.color.setHex( 0x333333 );

					thatpreView.intersected = intersections[ 0 ].object;
					thatpreView.intersected.material.color.setHex( 0x00D66B );

				}

				document.body.style.cursor = 'pointer';

			}
			else if ( thatpreView.intersected ) {

				thatpreView.intersected.material.color.setHex( 0x333333 );
				thatpreView.intersected = null;

				document.body.style.cursor = 'auto';

			}

		
		
}
function animate() {
	requestAnimationFrame( animate );

	thatpreView.render();


}
function Core(){

}
Core.prototype.scaleCoordToTerrain = function(pos, type){
	var temPos = new THREE.Vector3();

	if(type == "Long/Lat"){
		/*temPos.set(
				parseFloat((pos.longitude + this.transformToTerrain["x"]) * (this.transformToTerrain["s"])),
				pos.y*10,
				parseFloat((pos.latitude - this.transformToTerrain["z"]) * (this.transformToTerrain["s"]*1.66))
		);*/

		var newPOS = merc.px( [ pos.longitude, pos.latitude ] , thatground.worldScale);

	}else if(type == "x/z"){
		/*temPos.set(
				parseFloat((pos.x + this.transformToTerrain["x"]) * (this.transformToTerrain["s"])),
				parseFloat(pos.y)*10,
				parseFloat((pos.z - this.transformToTerrain["z"]) * (this.transformToTerrain["s"]*1.66))
		);*/

		var newPOS = merc.px( [ pos.x, pos.z ] , thatground.worldScale);
	}
	var newX = (newPOS[0] - thatground.transformToOrigin.x);
	var newZ = (newPOS[1] - thatground.transformToOrigin.z);
	temPos.set( newX,
				pos.y*10,
				newZ
		);

	return temPos;
}
Core.prototype.scaleTerrainTocoord = function(pos){
	var temPos = new THREE.Vector3();


	/*
	temPos.set(
			parseFloat((pos.x / (this.transformToTerrain["s"]) ) + (this.transformToTerrain["x"]))*(-1),
			pos.y/10,
			parseFloat((pos.z / (this.transformToTerrain["s"])/1.66 ) + this.transformToTerrain["z"])
	);
*/

	var newX = (pos.x + thatground.transformToOrigin.x);
	var newZ = (pos.z + thatground.transformToOrigin.z);
	var newPOS = merc.ll([ newX, newZ ], thatground.worldScale);
	temPos.set( newPOS[0],
				pos.y/10,
				newPOS[1]
		);
	return temPos;
}
