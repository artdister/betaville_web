/*
*	manage the gis polygones and create low def. buildings
*/
function geoObjectLoader(){

	this.loadedObjs = new Array();
	this.raycaster = new THREE.Raycaster();
	this.mainGeom = new THREE.Geometry();
	this.faceRun = 0;

	this.objArray = new Array();
	this.hideList = new Array();
	this.objectFaces = function(){
		this.min = 0;
		this.max = 0;
		this.userData = {};
		this.height = 0;
	};
	this.loadingObj = {
		'construct' : false
	};
	this.selected = "";
	this.defColor = 'rgb(100,100,100)'
	this.selColor = 0xFFFF00;
}

//load from geojson
geoObjectLoader.prototype.loadJSON = function(elem, id){

	this.loadingObj = {
		'construct' : true,
		'data' : preLoad.onLoadDataSet.objects[elem.getAttribute('idint')],
		'length' : preLoad.onLoadDataSet.objects[elem.getAttribute('idint')].length,
		'id': id

	}


	var data = preLoad.onLoadDataSet.objects[elem.getAttribute('idint')];

	thisCore.loadScreen.showLoading();
	ajax.get('../../storage/app/'+data.src,
		'json',
		function(i){
			thisCore.loadScreen.setMergeMsg();

			
			var json = JSON.parse(i);
			if(data.type == "buildings"){
				
				thatground.objects.loadBuilddingsFromJSON(json);

			}

			thisCore.loadScreen.hideLoading();
		},
		true
	);


}
//load polygons from DB
geoObjectLoader.prototype.loadFromDB = function(geom, data, height){


	//var geom = data; //JSON.parse(data.geom);




	var extrudeSettings = {
							amount: height*10*-1,
							bevelEnabled: true,
							bevelSegments: 1,
							steps: 1,
							bevelSize: 1,
							bevelThickness: 1
						};




	if(geom != null){


		for(var i = 0; i < geom.coordinates.length; i++){

			var prts = new Array();

			for(var j = 0;j < geom.coordinates[i].length-1;j++){
				if(geom.coordinates[i] != null){
					var coord = new THREE.Vector3(	geom.coordinates[i][j][0],
													0,
													geom.coordinates[i][j][1]) ;

					var sceneCoords = thisCore.scaleCoordToTerrain( coord , "x/z" );
					var coordsVec2 = new THREE.Vector2(sceneCoords.x, sceneCoords.z);


					for(var p = 0; p < prts.length;p++){
						if(prts[p].x == coordsVec2.x && prts[p].y == coordsVec2.y){

							coordsVec2.x += 0.1;
							coordsVec2.y += 0.1;
						}


					}
					prts.push( coordsVec2 );
				}
			}

			var shape = new THREE.Shape(prts);

			var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );


			
			//geometry.applyMatrix(new THREE.Matrix4().makeRotationY( Math.PI ));

			geometry.applyMatrix(new THREE.Matrix4().makeRotationX( Math.PI / 2 ));
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, geom.coordinates[0][0][2] , 0));
			geometry.colorsNeedUpdate = true;

			for( var i = 0; i < geometry.faces.length; i++ ) {


					geometry.faces[ i ].vertexColors[ 0 ] = new THREE.Color( data.color );
					geometry.faces[ i ].vertexColors[ 1 ] = new THREE.Color( data.color );
					geometry.faces[ i ].vertexColors[ 2 ] = new THREE.Color( data.color );
				


			}
			geometry.colorsNeedUpdate = true;


			this.mainGeom.merge(geometry.clone());

			faces = new this.objectFaces();
			faces.min = this.faceRun;
			this.faceRun += geometry.faces.length;
			faces.max = this.faceRun;

			this.objArray.push( faces );



		}



	}


}

geoObjectLoader.prototype.createMeshFromMainGeom = function(){
//MeshPhongMaterial
	var material = new THREE.MeshLambertMaterial( {
	    vertexColors: THREE.VertexColors,
	    side:THREE.DoubleSide,
	    reflectivity:0,
	    refractionRatio:0,

	} );



	this.object = new THREE.Mesh( this.mainGeom,  material  );

	this.object.castShadow = true;
	this.object.receiveShadow = true;


}
geoObjectLoader.prototype.getPrtsArray = function(c ,prts){

		//c= aktueller punkt , prts = array vorhandener punkte

	if(c != null){


			for(var j = 0;j < c.length;j++){
				
					if(c[j].length > 3 && typeof(c[j]) != "number"){
						var p = this.getPrtsArray(c[j], prts);
						var mergertP = prts.concat(p);
						return mergertP;

					}else{

						var coord = new THREE.Vector3(c[j][0],
													0,
													c[j][1]) ;

						var sceneCoords = thisCore.scaleCoordToTerrain( coord , "x/z" );
						var coordsVec2 = new THREE.Vector2(sceneCoords.x, sceneCoords.z);


						for(var p = 0; p < prts.length;p++){
							if(prts[p].x == coordsVec2.x && prts[p].y == coordsVec2.y){

								coordsVec2.x += 1;
							}


						}
						this.mainPrts.push([c[j][0],c[j][1]]);
						prts.push( coordsVec2 );



					}


				
			}


	}

	return prts;
}


geoObjectLoader.prototype.mergePrtsToGeom = function( prts, bhight){

	var extrudeSettings = {
						amount: bhight,
						bevelEnabled: true,
						bevelSegments: 1,
						steps: 1,
						bevelSize: 1,
						bevelThickness: 1
					};








	var shape = new THREE.Shape(prts);

	var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );


	
	//geometry.applyMatrix(new THREE.Matrix4().makeRotationY( Math.PI / 2 ));
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX( Math.PI / 2 ));
	//
	//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 100, 0));
	geometry.colorsNeedUpdate = true;

	for( var i = 0; i < geometry.faces.length; i++ ) {
		if( this.loadingObj.construct == true ){
			geometry.faces[ i ].vertexColors[ 0 ] = new THREE.Color( this.loadingObj.data.data.color );
			geometry.faces[ i ].vertexColors[ 1 ] = new THREE.Color( this.loadingObj.data.data.color );
			geometry.faces[ i ].vertexColors[ 2 ] = new THREE.Color( this.loadingObj.data.data.color );
		}else{
			geometry.faces[ i ].vertexColors[ 0 ] = new THREE.Color( this.defColor );
			geometry.faces[ i ].vertexColors[ 1 ] = new THREE.Color( this.defColor );
			geometry.faces[ i ].vertexColors[ 2 ] = new THREE.Color( this.defColor );
		}


	}
	geometry.colorsNeedUpdate = true;

	return geometry;


}

//create mesh from json vector data
geoObjectLoader.prototype.loadBuilddingsFromJSON = function(json, cb, calcHeights = false){
	var mainGeom = new THREE.Geometry();
	var faceRun = 0;
	
	for(var e = 0; e < json.features.length;e++){
		var elem = json.features[e];

		//if properties.heigh is defined else set to 1
		var bhight = (elem.properties.height == null ? bhight = 1 : -elem.properties.height*10 );

		//if high def. buildings available, look for low def. buildings to hide
		if(loadingData['models']){
			if(loadingData['models']['buildings']){
				
				for(var i = 0; i < loadingData['models']['buildings']['high'].length;i++){
					for(var j = 0; j < loadingData['models']['buildings']['high'][i].hiddenBuildData.length;j++){

						if(loadingData['models']['buildings']['high'][i].hiddenBuildData[j] == elem.id){
							
							bhight = 1;
							break;
						}

					}
				}

			}
		}

		//convert GIS vectors to threejs objects
		if(elem.geometry != null){
			if(elem.geometry.type == 'Polygon' || elem.geometry.type == 'MultiPolygon'){
				
				this.mainPrts = new Array();
				for(var i = 0; i < elem.geometry.coordinates.length; i++){
						
						var prts = new Array();

						var prts = this.getPrtsArray(elem.geometry.coordinates[i], prts);
						
						var geometry = this.mergePrtsToGeom(prts, bhight);

					}

					//if properties.Z is defined else get the center and calculate the hight by def false and set to 100
					if(elem.properties.Z){
						geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, elem.properties.Z*10, 0));
					}else{

						if(calcHeights == true){
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

						    var high = thatground.getHight([centroidX, centroidZ]);
						    
						    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, high, 0));

							var dbValues = new Object();
						    dbValues['id'] = elem.id;
						    dbValues['tags'] = elem.properties.tags;
						    dbValues['geom'] = this.mainPrts;
						    dbValues['elemZ'] = high;
						    thatpreView.dbArray.push(dbValues);
						  //  console.log(high, elem.properties.id);
						}else{
							geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 100, 0));
						}	
				
					
					//merge temp geometry with main geometry
					mainGeom.merge(geometry.clone());

					//create a new objectFaces object
					faces = new this.objectFaces();
					faces.min = faceRun;
					faceRun += geometry.faces.length;
					faces.max = faceRun;
					faces.height = bhight*(-1);
					faces.userData = this.setDataObject( elem );


					this.objArray.push( faces );



				}


			}
		}

		


	}



	//create material
	var material = new THREE.MeshLambertMaterial( {
	    vertexColors: THREE.VertexColors,
	    lights: true,
	    shading : THREE.SmoothShading,
	    side:THREE.DoubleSide

	} );


	//create mesh
	this.object = new THREE.Mesh( mainGeom,  material  );
	this.object.name = "buildingsLow:";
	if( this.loadingObj.construct == true ){
		this.object.userData = {
			id: this.loadingObj.id
		};
	}

	//shadow setup
	this.object.castShadow = true;
	this.object.receiveShadow = true;


	this.object.updateMatrix();
	this.loadedObjs.push( this.object.clone() );

	this.mainPrts = new Array();;

	//if callback is a function run it, else add object to scene
	if(typeof(cb) == 'function' ){
		cb();
	}else{
		thisCore.scene.add( this.loadedObjs[this.loadedObjs.length-1] );
	}


}

//set the userData in the obejctFace
geoObjectLoader.prototype.setDataObject = function(options){

	var out = new Array();

	for(var key in options.properties){
		if(options.properties[key] != null){

			if(key != 'length'){
			//console.log(typeof(out[key]), typeof(options[key]), typeof(key) );
			//console.log(out[key], options[key], key);
				out[key] = options.properties[key];
			}
	

		}
	}
	out['id'] = options.id

	return out
}

//remove the building from scene 
geoObjectLoader.prototype.removeObjById = function(id){

	for(var i = 0; i < this.loadedObjs.length; i++){
		if(this.loadedObjs[i].userData.id == id){

			thisCore.scene.remove( this.loadedObjs[i] );
			disposeHierarchy(this.loadedObjs[i] , disposeNode);

			this.loadedObjs.clean( this.loadedObjs[i] );
		}
	}
}

//handle onclick actions, change color of a picked object
geoObjectLoader.prototype.onclickAction = function(i, button){

	var intersects = i;

	var facesIndices = ["a","b","c"];
	
	this.deselectObj();



	if(typeof(intersects) == 'object' && button == "left"){
		var elem = intersects.object;
		var faceIndex = intersects.faceIndex;
		var obj = intersects.object;
		var geom = obj.geometry;
		var faces = obj.geometry.faces;

		for(var i = 0; i < this.objArray.length; i++){

			if(faceIndex >= this.objArray[i].min &&
				faceIndex <= this.objArray[i].max){

					this.selected = this.objArray[i];

					break;



				}

		}


		if(typeof(this.selected) == 'object' ){

			
			for(var i = this.selected.min; i < this.selected.max ; i++){

				faces[ i ].vertexColors[ 0 ].set( this.selColor );
				faces[ i ].vertexColors[ 1 ].set( this.selColor );
				faces[ i ].vertexColors[ 2 ].set( this.selColor );

				facesIndices.forEach(function(indices){

				        //geom.vertices[faces[i][indices]].setZ(-10);


				});

			}
			geom.colorsNeedUpdate = true;
			elem.updateMatrix();

			thatTopMenuBar.updateBuildingsInfo(this.selected);
		}

		geom.verticesNeedUpdate = true;



	}

}
//restore the default objects color
geoObjectLoader.prototype.deselectObj = function(){

		if(this.selected != ""){
		var faces = this.object.geometry.faces;

		for(var i = this.selected.min; i <= this.selected.max; i++){

			faces[ i ].vertexColors[ 0 ].set( this.defColor );
			faces[ i ].vertexColors[ 1 ].set( this.defColor );
			faces[ i ].vertexColors[ 2 ].set( this.defColor );

		}

		thatTopMenuBar.updateBuildingsInfo("");
		this.object.geometry.colorsNeedUpdate = true;
		this.object.updateMatrix();
		this.object.verticesNeedUpdate = true;
		this.selected = "";

	}
}
//add objects to the 'hide' list
geoObjectLoader.prototype.hideBuildings = function(obj, button){

	var intersects = obj;

	var facesIndices = ["a","b","c"];
	
	this.deselectObj();


	if(typeof(intersects) == 'object' && button == "left"){
		var elem = intersects.object;
		var faceIndex = intersects.faceIndex;
		var obj = intersects.object;
		var geom = obj.geometry;
		var faces = obj.geometry.faces;

		for(var i = 0; i < this.objArray.length; i++){

			if(faceIndex >= this.objArray[i].min &&
				faceIndex <= this.objArray[i].max){
			
					thatGUI.proposalSec.appendToHidenList(this.objArray[i], 'buildingsLow');
					this.hideList.push(this.objArray[i].userData.id);
					break;



				}

		}

		//move the selected geometry far up
		var h = this.objArray[i].height;
		for(var j = this.objArray[i].min; j < this.objArray[i].max ; j++){

			facesIndices.forEach(function(indices){
				
					//if(elem.geometry.vertices[faces[j][indices]].y >= 100){
					//	console.log(geom.vertices[faces[j][indices]].y, h);
						elem.geometry.vertices[faces[j][indices]].y += (10000000) ;
					//}
			        


			});

		}

	 	elem.updateMatrix();
	 	elem.geometry.verticesNeedUpdate = true;

	 	//this.hiddenObjList.push(this.objArrayMerged[i].data.id);

		geom.verticesNeedUpdate = true;



	}
	

}

//hide high def. building
geoObjectLoader.prototype.hideBuildngById = function(id){

			for(var j = 0; j < this.objArray.length; j++){

				if(this.objArray[j].userData.id == id){
					var facesIndices = ["a","b","c"];
					var faces = this.object.geometry.faces;
					var geom = this.object.geometry;
					var h = this.objArray[j].height;
		
					for(var k = this.objArray[j].min; k < this.objArray[j].max ; k++){

						facesIndices.forEach(function(indices){
								//if(geom.vertices[faces[j][indices]].y >= 100 ){

								//	console.log(geom.vertices[faces[j][indices]].y, h);
						        	geom.vertices[faces[k][indices]].y += (10000000);
						        //

						});

					}	
					this.object.updateMatrix();
		 			this.object.geometry.verticesNeedUpdate = true;

				}

			}

}

//restor hidden building
geoObjectLoader.prototype.showBuildingById = function(id){

	for(var j = 0; j < this.objArray.length; j++){

				if(this.objArray[j].userData.id == id){
					var facesIndices = ["a","b","c"];
					var faces = this.object.geometry.faces;
					var geom = this.object.geometry;
					var h = this.objArray[j].height;
		
					for(var k = this.objArray[j].min; k < this.objArray[j].max ; k++){

						facesIndices.forEach(function(indices){
								//if(geom.vertices[faces[j][indices]].y >= 100 ){

								//	console.log(geom.vertices[faces[j][indices]].y, h);
						        	geom.vertices[faces[k][indices]].y -= (10000000);
						        //

						});

					}	
					this.object.updateMatrix();
		 			this.object.geometry.verticesNeedUpdate = true;

				}

			}
}

//restore hiden buildings
geoObjectLoader.prototype.showBuilding = function(id){

	//console.log("here we must rise "+id);
	//console.log(this.hideList, this.hideList.length );

	for(var i = 0; i < this.hideList.length; i++){
		//console.log( this.hideList[i] == id , this.hideList[i], id);
		//console.log(this.hideList[i].userData.id == id);
		if(this.hideList[i] == id){

			


			for(var j = 0; j < this.objArray.length; j++){

				if(this.objArray[j].userData.id == id){
					var facesIndices = ["a","b","c"];
					var faces = this.object.geometry.faces;
					var geom = this.object.geometry;
					var h = this.objArray[j].height;
		
					for(var k = this.objArray[j].min; k < this.objArray[j].max ; k++){

						facesIndices.forEach(function(indices){
								//if(geom.vertices[faces[j][indices]].y >= 100 ){

								//	console.log(geom.vertices[faces[j][indices]].y, h);
						        	geom.vertices[faces[k][indices]].y -= (10000000);
						        //

						});

					}	
					this.object.updateMatrix();
		 			this.object.geometry.verticesNeedUpdate = true;

				}

			}

			
		}

	}




}

//remove restored building from hide list
geoObjectLoader.prototype.removeFromULLIst = function(id){

	var index = this.hideList.indexOf(id);
	this.hideList.splice(index, 1);

}