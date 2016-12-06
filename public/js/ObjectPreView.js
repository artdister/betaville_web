function ObjectPreView(){
		
		thatpreView = this;

		this.ray = new Raycaster();
		this.projector = new THREE.Projector();
		this.meshArry = new Array();

		this.mousePos = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		this.directionVector = new THREE.Vector3();


		this.intersected;
		this.dae = new THREE.Object3D();
		this.container = document.getElementById( 'glPreView' );

		this.camera = new THREE.PerspectiveCamera( 45, this.container.clientWidth/this.container.clientHeight, 0.01, 2000 );
		this.camera.position.set( 2, 2, 3 );
		this.camLookAt =  new THREE.Vector3(0, 0, 0);
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

			console.log(this.container.getAttribute("city"));

		
		var size = 1400, step = 1;

		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

		for ( var i = - size; i <= size; i += step ) {

			geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
			geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

			geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
			geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

		}

		this.line = new THREE.Line( geometry, material, THREE.LinePieces );
		this.scene.add( this.line );

		
	

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

		thatpreView.animate();
	
}

ObjectPreView.prototype.render = function() {

	thatpreView.scene.updateMatrixWorld();
	//thatpreView.updateObjInfoSection();

	thatpreView.controls.update();

	thatpreView.renderer.render( thatpreView.scene, thatpreView.camera );

	thatpreView.camera.updateProjectionMatrix();

	thatpreView.octree.update();
}

ObjectPreView.prototype.createObjInfoSection = function(){
	this.infoBody = document.createElement('div');
	this.infoBody.id = 'Info-Body';
	this.infoBody.style.position =  "absolute";
	this.infoBody.style.zIndex = "1";
	this.infoBody.style.right = "0";
	this.infoBody.style.backgroundColor = "red";

	this.longlatDiv = document.createElement('div');
	this.longlatDiv.id = "longlangDiv";
	this.infoBody.appendChild(this.longlatDiv);


	this.atliInfo = document.createElement('div');
	this.atliInfo.id = "atliInfo";
	this.infoBody.appendChild(this.atliInfo);

	document.getElementById('glPreView').appendChild(this.infoBody);
}

ObjectPreView.prototype.updateObjInfoSection = function(){

	this.longlatDiv.innerHTML = "Latitude / Longitude<br>";
	this.longlatDiv.innerHTML += "X: "+thatpreView.dae.position.x+" <br> Z: "+thatpreView.dae.position.z+"<br>";


	this.atliInfo.innerHTML = "atliInfo";


}

ObjectPreView.prototype.load = function(jString, li){
	
		if (typeof jString === 'string') {
    		var json = JSON.parse(jString);
		}else{
			var json = jString;
		}
	
		var url = json.url;



		elemId = ""
		var existModel = thatpreView.scene.getObjectByName(thatpreView.dae.name);
		if(existModel != undefined){		
			thatpreView.scene.remove(existModel);
			thatpreView.disposeHierarchy (existModel, thatpreView.disposeNode);	
		}

		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;

		var jloader = new THREE.ObjectLoader();

		var spliturl = url.split(".");
		var filetype = spliturl[spliturl.length-1];
		var filename = spliturl[0].split("/")[spliturl[0].split("/").length-2];
		if(filetype == "zip"){
			//console.log('../storage/app/'+url, filename);
			JSZipUtils.getBinaryContent('../storage/app/'+url, function(err, data) { 
							if(err) {
								throw err; // or handle err
							}	
								thatpreView.ray.clearIntersectObjects();
								thatpreView.meshArry = new Array();
								var mats = new Array();
								var zip = new JSZip(data);
								var geometry = new THREE.Geometry();
								var objData = zip.file(filename+".json").asText();
								//var mtlData = zip.file("office-building_01.mtl").asText();
								var jdata = JSON.parse(objData);
								var object3D = jloader.parse(jdata); 




								object3D.traverse(function(elem){
							/*		elem.rotation.x = -Math.PI / 2;

									elem.scale.x = 0.001;	
									elem.scale.y = 0.001;	
									elem.scale.z = 0.001;	
									elem.updateMatrix();

*/
									if(elem instanceof THREE.Mesh){
										var obj = elem;
										obj.geometry.applyMatrix(new THREE.Matrix4().makeScale(0.001,0.001,0.001));
										//obj.geometry.applyMatrix(new THREE.Matrix4().makeRotationX( -Math.PI / 2));

										thatpreView.octree.add(obj.clone());
										thatpreView.meshArry.push(obj.clone());


										mats.push(obj.material);
										if(obj.geometry.type == "BufferGeometry"){
											var geometry2 = new THREE.Geometry().fromBufferGeometry( obj.geometry );
											geometry.merge(geometry2, obj.matrix, mats.length-1 );
											//THREE.GeometryUtils.merge(geometry,geometry2, mats.length-1)
										}else if(obj.geometry.type == "Geometry"){
											geometry.merge(obj.geometry, obj.matrix, mats.length-1 );
											//THREE.GeometryUtils.merge(geometry,objElem.geometry, mats.length-1)
										}
									}
								});
									
								thatpreView.ray.addIntersectObjects(thatpreView.meshArry);
								

								geometry.center();


								var material = new THREE.MeshFaceMaterial(mats);
					  			var total = new THREE.Mesh(geometry, material);
					  			total.name = "model";
					  			total.userData = { 
					  					'id':li.getAttribute("buildID"),
					  					'parentID': li.getAttribute("cityID") 
					  			}

								thatpreView.dae = total.clone();
							
						
								thatpreView.scene.add(thatpreView.dae);
								
			});
		}else if( filetype == "dae"){

			
			loader.load( '../storage/app/'+url, function ( collada, mat ) {

				dae = collada.scene.children[0];

	

				dae.scale.x = dae.scale.y = dae.scale.z = 0.001;
	
				
				dae.updateMatrix();
				dae.name = "model";
		
			
				thatpreView.dae = dae.clone();
				thatpreView.scene.add(thatpreView.dae);


			} );

		}else if( filetype == "json"){


			// load a resource
			jloader.load(
				// resource URL
				 '../storage/app/'+url,
				// Function when resource is loaded
				function ( obj ) {

					obj.scale.x = obj.scale.y = obj.scale.z = 0.001;
					obj.name = "model";
					thatpreView.dae = obj.clone();
					thatpreView.scene.add(thatpreView.dae);
	
					
				}
			);
		}


}
ObjectPreView.prototype.loadFromJsonDOM = function(json){

		var existModel = thatpreView.scene.getObjectByName(thatpreView.dae.name);
		if(existModel != undefined){		
			thatpreView.scene.remove(existModel);
			thatpreView.disposeHierarchy (existModel, thatpreView.disposeNode);	
		}
		

		var jloader = new THREE.ColladaLoader();
		jloader.options.convertUpAxis = true;

		var object3D = jloader.parse(json).scene; 

		object3D.scale.x = object3D.scale.y = object3D.scale.z = 0.001;
		object3D.name = "model";
		thatpreView.dae = object3D.clone();
		thatpreView.scene.add(thatpreView.dae);

}


ObjectPreView.prototype.disposeNode = function(node)
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

ObjectPreView.prototype.disposeHierarchy = function(node, callback)
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
ObjectPreView.prototype.toggleEdit = function(btn){
	var cityList = document.getElementById('cityObjList');
	var editOption = document.getElementById('editOption');
	console.log(btn.checked);
	if(btn.checked){
		cityList.style.display = "none";
		editOption.style.display = "block";
	}else
	if(!btn.checked){
		cityList.style.display = "block";
		editOption.style.display = "none";
	}

}
ObjectPreView.prototype.onDocumentMouseclick = function( event , flag){
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
ObjectPreView.prototype.onDocumentMouseMove = function( event ) {

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
ObjectPreView.prototype.animate = function() {
	requestAnimationFrame( thatpreView.animate );

	thatpreView.render();


}
