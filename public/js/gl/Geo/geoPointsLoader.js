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

geoPointsLoader.prototype.prepareObjLoad = function(json){
	if(typeof(json) == 'object'){

		thatPointsLoader.json = json;

	}

	var key = thatPointsLoader.objLoadKeyArry[thatPointsLoader.objLoadKeyIndex];



	if(thatPointsLoader.objLoadKeyIndex < thatPointsLoader.objLoadKeyArry.length){
	

		thatPointsLoader.loadObjs(key, thatPointsLoader.prepareObjLoad );

	}else{

		thatPointsLoader.load(thatPointsLoader.json, preLoad.loadDataSet);

	}

	thatPointsLoader.objLoadKeyIndex++;
};


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

						//out.geom.center();
					
						thatPointsLoader.objArray.push(out);

						cb();


					}

				);

		

};

geoPointsLoader.prototype.load = function(json, loadded){
	//console.log(this.key, this.data);
	//console.log(json);
	//console.log(thatPointsLoader.colObjsMuster, this.keyWord);
	var matsOut = new Array();
	//
	for(var i = 0; i < json.features.length;i++){

		var pos = json.features[i].geometry.coordinates;
		var type = json.features[i].properties[this.keyWord];

		
		for(var j = 0; j < thatPointsLoader.objArray.length; j++){

		
			if(thatPointsLoader.objArray[j].key == type){
				
				var geom = new THREE.Geometry();
				

				for(var o = 0; o < thatPointsLoader.objArray[j].obj.length; o++ ){


						var objElem = thatPointsLoader.objArray[j].obj[o].clone();


						objElem.material.fog = false;
						objElem.material.side = THREE.DoubleSide;

						var mat = thatPointsLoader.checkDoubleMats(objElem.material, matsOut);
					
						
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

				var newPos = thisCore.scaleCoordToTerrain( coord , "x/z" );

				var scale = thatPointsLoader.data[type].scale;
				geom.applyMatrix(new THREE.Matrix4().makeScale(scale, scale, scale ));

				//geom.center();

				var firstP = geom.vertices[0];
				geom.applyMatrix(new THREE.Matrix4().makeTranslation(newPos.x-firstP.x, newPos.y,newPos.z-firstP.z));


				thatPointsLoader.mainGeometry.merge(geom.clone());



				

			}


		}



	}
	for(var i = 0; i < matsOut.length;i++){
		thatPointsLoader.mainMaterials.push(matsOut[i]);

	}
		

	thatPointsLoader.createMesh();
	loadded();
};


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