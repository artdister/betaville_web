function Core(){



	thisCore = this;
	this.init = false;
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

		this.container;

		this.scene;
		this.renderer;
		this.transformToTerrain = new Array();


		



		this.convert = new UtmConverter();
		this.scene = new THREE.Scene();
		this.hemiScene = new THREE.Scene();

		this.terrainScene = new THREE.Scene();


  		new ProposalsLoad();
	    new LoadHelpers();

  		/*
  		* bre_std150
  		* bre_min150
  		* bre_med150
  		* bre_mea150
  		* bre_max150
  		* bre_dsc150
  		* Bremen/Bremen
  		*/
		/*JSZipUtils.getBinaryContent('models/build.zip', function(err, data) {
			if(err) {
				throw err; // or handle err
			}

			var zip = new JSZip(data);
			console.log(zip);
		});


		*/




}

Core.prototype.loadProposals = function(){



		if(preLoad.proposals != undefined){
			preLoad.proposals.forEach(function(obj){
				propLoader.load(obj.data, function(){} );

			});

		}
		if(preLoad.geopositions != undefined){
			preLoad.geopositions.forEach(function(obj){

				thatGeoComments.addGeoCommentToScene(obj.data);

			})
		}


}

Core.prototype.initialised = function() {
	this.init = true;
	this.mouse = new MouseObj();

	this.container = document.createElement( 'div' );
	this.container.id = 'glDIV';
	//this.container.style.width = document.body.clientWidth+"px";
	//this.container.style.height = document.body.clientHeight+"px";
	//console.log(this.container.style.width, this.container.style.height);

	document.body.appendChild( this.container );
	this.loadScreen = new LoadinScreen();



	this.scene.fog = new THREE.Fog( 0xFFFFFF, 100000, 1000000 );

	this.renderer = new THREE.WebGLRenderer( { 	alpha: true,
												antialias: true,
												logarithmicDepthBuffer: false,
												precision: "mediump"
											} );
	this.renderer.autoClear = false;
	//this.renderer.setClearColor(this.scene.fog.color);


	this.renderer.shadowMap.enabled = true;


	this.renderer.shadowMap.type = THREE.BasicShadowMap;
	this.renderer.shadowMap.cullFace = THREE.CullFaceFront;

	//this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setPixelRatio( 1 );

	this.container.appendChild( this.renderer.domElement );
	//this.renderer.domElement.style.position = 'absolute';
	//this.renderer.domElement.style.zIndex = 1;
	this.renderer.domElement.style.top = 0;

	this.renderer.sortObjects = true;
	this.renderer.autoUpdateScene = true;
	

	/*this.rendererStats   = new THREEx.RendererStats();
	this.rendererStats.domElement.style.position = 'absolute';
	this.rendererStats.domElement.style.left = '0px';
	this.rendererStats.domElement.style.bottom   = '0px';
	document.body.appendChild( this.rendererStats.domElement );
*/


	new Light();








	new ControlHandler(this.renderer.domElement);

	this.control = new THREE.TransformControls( thatControl.camera, this.renderer.domElement );
	new GUI();


	var topMheight = thatTopMenuBar.topMenuBar.offsetHeight
	this.renderer.setSize( window.innerWidth -200, window.innerHeight - topMheight );


	new Raycaster();


//console.log(thatground);

	//add the geo ground Plane
	this.terrainScene.add(thatground.terrain.plane);

	
	this.scene.add(thatground.lines.object);
	this.scene.add(thatground.objects.object);

	//add the geo data set's
	for(var i = 0;i < thatground.city.length; i++){
		this.scene.add(thatground.city[i].object);

	}
	for(var i = 0;i < thatground.buildings.length; i++){
		this.scene.add(thatground.buildings[i].object);

	}


	if( preLoad.buildingsLow){
		this.scene.add(preLoad.buildingsLow.object);
	}


	this.scene.add( thatControl.lookAtSphere );
	thatControl.addDirectionslines(this.scene);


	this.scene.add( lightLib.shadowLight );
	//this.scene.add( lightLib.shadowlightHelper);

	this.scene.add( lightLib.hemiLight);
	this.hemiScene.add( lightLib.sky.mesh);


	this.terrainScene.add( thatground.terrain.light);


	
	//console.log(objLoad.objArrayMerged);


	//testing functions
	if(typeof(thatPointsLoader) == 'object'){
/*	
		for(var i = 0;i < thatPointsLoader.objArayTemp.length;i++){

			thisCore.scene.add(thatPointsLoader.objArayTemp[i]);

		}
*/
		thisCore.scene.add(thatPointsLoader.mesh);

		

		var dummy = thatPointsLoader.mesh.geometry.vertices[0];
		thatControl.camera.position.set( dummy.x, dummy.y+2000, dummy.z+3000);
		thatControl.camLookAt =  dummy;
		
			console.log(thatPointsLoader.mesh );
	
	}







	//add STATS
	for(var i = 0; i < thatground.stats.statsObjs['obj'].length;i++){

			thisCore.scene.add(thatground.stats.statsObjs['obj'][i]);
			thatground.stats.statsObjs['obj'][i].visible = false;
	}




	// Add the Buildings
	for(var i = 0;i < objLoad.objArray["obj"].length; i++){
			this.scene.add(objLoad.objArray["obj"][i] );
	}


	var material = new THREE.MultiMaterial( objLoad.objectsMat );
	this.buildings = new THREE.Mesh( objLoad.objectsGeom,  material  );
//	this.scene.add( this.buildings );


	//Add the Proposals

	for(var i = 0;i < propLoader.propArray.length; i++){
			this.scene.add( propLoader.propArray[i] );
	}

	for(var i = 0;i < thatGeoComments.geoCommentArray.length; i++){
			this.scene.add(thatGeoComments.geoCommentArray[i]);
	}



		thatRay.addIntersectObjects(objLoad.objArray["obj"]);

		for(var i = 0; i < thatground.buildings.length;i++){

   				if( (thatground.buildings[i] instanceof geoObjectLoader) == true){
		    		thatRay.addIntersectObject( thatground.buildings[i].object );
		    	}
		    	
	    }

		thatRay.addIntersectObjects(propLoader.propArray);
		thatRay.addIntersectObjects(thatGeoComments.geoCommentArray);

		thatRay.addIntersectObjects([thatground.terrain.plane]);


	window.addEventListener( 'resize', onWindowResize, false );
	window.ondragstart = function() { return false; } 
	//this.renderer.domElement.addEventListener( 'click' , , false);

	this.renderer.domElement.addEventListener("webglcontextlost", function(event) {
	    event.preventDefault();
	}, false);


	var flag = 0;
	this.renderer.domElement.addEventListener("mousedown", function(){
	    flag = 0;

	}, false);
	this.renderer.domElement.addEventListener("mousemove", function(e){
	    flag = 1;

	    thatControl.camera.updateMatrix();
	    thisCore.mouse.mouseMove(e);
	    thatRay.proposalHoverHandle(e);
	    thatRay.geoPositionHoverHandle(e);

	}, false);
	this.renderer.domElement.addEventListener("mouseup", function(e){
	    if(flag === 0){

	    /*	for(var i = 0; i < thatground.city.length;i++){

   				if( (thatground.city[i] instanceof geoObjectLoader) == true){
		    		thatground.city[i].onclickAction(e,flag);
		    	}
		    	
	    	}
	 	*/	
	 		thisCore.mouse.mouseClick(e, flag);
	 		
	    	if(thatground.stats.statsOnScene == true){
	    		thatground.stats.onclickAction(e,flag);

	    	}else{
	    			thatRay.onclickAction(e, flag, thatControl.camera);

				if( preLoad.buildingsLow){
					preLoad.buildingsLow.onclickAction(e, flag);
				}
	    	}

	    }
	    else if(flag === 1){
	     	//on mouse hold
	    }
	}, false);

	//lightLib.calcSunPos();
/*
    background-color: #f8f8f8;
    border-color: #e7e7e7;
*/
}


Core.prototype.render = function() {



	thatControl.render();
	motions.rendereCompass();



	this.renderer.clear();




	this.hemiScene.updateMatrixWorld();
	this.terrainScene.updateMatrixWorld();
	this.scene.updateMatrixWorld();
	
	lightLib.render();



	thatTopMenuBar.rendere();



	this.renderer.render(this.hemiScene, thatControl.camera );

	this.renderer.clearDepth();
	this.renderer.render(this.terrainScene, thatControl.camera);


	this.renderer.clearDepth();
	this.renderer.render(this.scene, thatControl.camera );


	thatControl.camera.updateProjectionMatrix();
	thisCore.eventsControl;
	thisCore.control.update();

	this.mouse.render();


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
	var newX = (newPOS[0] - thatground.transformToOrigin.x) ;
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

Core.prototype.setUser = function(user){

	thisCore.user = user;
}
