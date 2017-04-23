/*
*	manage the gis points to load objects on it
*/
function geoPointsLoader(data = false){

	this.loader = new THREE.ColladaLoader();
	thatPointsLoader = this;


	this.mainGeometry = new THREE.Geometry();
	this.mainMaterials = new Array();
	this.objloader = new ObjectLoader();

	this.objArray = new Array;

	this.objArayTemp = new Array();

	if(typeof(data) == 'object'){
		this.keyWord = data.key;
		this.data = data.data;
		
	


		this.objLoadKeyIndex = 0;
		this.objLoadKeyArry = [];
		for(var key in this.data){
			
			this.objLoadKeyArry.push(key);

		}
	

	}


}

//call multiply times to load all models first
geoPointsLoader.prototype.prepareObjLoad = function(json){
	if(typeof(json) == 'object'){

		thatPointsLoader.json = json;

	}
	var key = thatPointsLoader.objLoadKeyArry[thatPointsLoader.objLoadKeyIndex];


	if(thatPointsLoader.objLoadKeyIndex < thatPointsLoader.objLoadKeyArry.length){
	

		thatPointsLoader.loadObjs(key, thatPointsLoader.prepareObjLoad );

	}else{
 		//if all modesl loaded
		thatPointsLoader.load(thatPointsLoader.json, preLoad.loadDataSet);

	}

	thatPointsLoader.objLoadKeyIndex++;
};

//check for double materials
geoPointsLoader.prototype.checkDoubleMats = function(mat, oM){
	var found = false;
		if(oM.length > 0){
			for(var i = 0; i < oM.length;i++){

				if(oM[i].uuid == mat.uuid){
					return i;
				}

			}
			oM.push(mat);

		}else{
			oM.push(mat);
			
		}
		return oM.length-1;
};

//load the collada models and push it to an array
geoPointsLoader.prototype.loadObjs = function(key, cb){

		

			this.loader.load(
					"../../storage/app/"+this.data[key].src,

					function(col){
						var out =  {
							obj :  new Array(),
							key : key
						}; 

						
						col.scene.traverse(function(elem){

							if(elem instanceof THREE.Mesh){
								var objElem = elem.clone();


								out.obj.push(objElem);



							}

						});

						thatPointsLoader.objArray.push(out);

						cb();


					}

				);

		

};

//load the gis point json adn create a threejs obejct
geoPointsLoader.prototype.load = function(json, loadded){
	//console.log(this.key, this.data);
	console.log(json);
	//console.log(thatPointsLoader.colObjsMuster, this.keyWord);
	var matsOut = new Array();
	//for all gis points
	for(var i = 0; i < json.features.length;i++){

		var pos = json.features[i].geometry.coordinates;
		var type = json.features[i].properties[this.keyWord];

		//for all loaded models
		for(var j = 0; j < thatPointsLoader.objArray.length; j++){

			//if the key hits the gis type
			if(thatPointsLoader.objArray[j].key == type){
				
				var geom = new THREE.Geometry();
				
				//for all points from these gis type
				for(var o = 0; o < thatPointsLoader.objArray[j].obj.length; o++ ){

						//get object copy 
						var objElem = thatPointsLoader.objArray[j].obj[o].clone();


						objElem.material.fog = false;
						objElem.material.side = THREE.DoubleSide;

						//look for double materials
						var mat = thatPointsLoader.checkDoubleMats(objElem.material, matsOut);
					
						//look for geometry types and merge it
						if(objElem.geometry.type == "BufferGeometry"){
							var geometry2 = new THREE.Geometry().fromBufferGeometry( objElem.geometry );
							geom.merge(geometry2, objElem.matrix, mat );
							//THREE.GeometryUtils.merge(geometry,geometry2, mats.length-1)
						}else if(objElem.geometry.type == "Geometry"){
							geom.merge(objElem.geometry, objElem.matrix, mat );
							//THREE.GeometryUtils.merge(geometry,objElem.geometry, mats.length-1)
						}
						





						objElem.updateMatrixWorld( true );	


				
						
							
					
				}
			

				var coord = new THREE.Vector3(pos[0],
				pos[2],
				pos[1]) ;

				//convert lat/long to 3D world coords.
				var newPos = thisCore.scaleCoordToTerrain( coord , "x/z" );

				//set the model scale
				var scale = thatPointsLoader.data[type].scale;
				geom.applyMatrix(new THREE.Matrix4().makeScale(scale, scale, scale ));

			
				//move geometry to the right positions
				var firstP = geom.vertices[0];
				geom.applyMatrix(new THREE.Matrix4().makeTranslation(newPos.x-firstP.x, newPos.y,newPos.z-firstP.z));

				//merge geometries
				thatPointsLoader.mainGeometry.merge(geom.clone());



				

			}


		}



	}
	//merge materials
	for(var i = 0; i < matsOut.length;i++){
		thatPointsLoader.mainMaterials.push(matsOut[i]);

	}
		

	thatPointsLoader.createMesh();
	loadded();
};

//create threejs mesh from geometries and materials
geoPointsLoader.prototype.createMesh = function(){

				
				
	// this.mainGeometry = new THREE.Geometry();
	// this.mainMaterials = new Array();

		var geom = thatPointsLoader.mainGeometry;
		var mat = thatPointsLoader.mainMaterials;



		console.log(mat);
		var material = new THREE.MultiMaterial(mat);


		var material2 = new THREE.MeshLambertMaterial( {
		    color: 'rgb(0,0,200)',
		    side:THREE.DoubleSide,
		    reflectivity:0,
		    refractionRatio:0,

		} );

		thatPointsLoader.mesh = new THREE.Mesh( geom, material ); 



		thatPointsLoader.mesh.updateMatrixWorld();





		
}