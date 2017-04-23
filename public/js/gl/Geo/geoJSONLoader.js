/*
* manage the gis lines and create threejs objects
*/
function geoJSONLineLoader(data = false){
	this.color = "";
	this.widthData = "";
	if(data != false){
		this.datatype = data.type;
		this.color = data.data.color;
		this.widthData = data.data.width;
		this.index = data.index;
	}

	this.object;	
	this.lastElem = false;
	this.mainGeometry = new THREE.Geometry();
}

//load vectors from geojson file
geoJSONLineLoader.prototype.load = function(json, loadded){



	var tempMask = new THREE.Matrix3();
	var geometry;
	var streetsArr = json.features;
	this.linewidth = 0.00002; // def. default line width

	for(var i = 0; i < streetsArr.length; i++){

		for(obj in this.widthData){
			//  obj == streetsArr[i].properties.type
			if(obj == streetsArr[i].properties.highway || obj == streetsArr[i].properties.type){
				
				this.linewidth = this.widthData[obj];

				break;
			}

		}

		this.loadMesh(streetsArr[i].geometry);

	}

	

	var material = new THREE.MeshBasicMaterial( {
													vertexColors: THREE.VertexColors,
													side: THREE.DoubleSide,
													depthWrite: false,
													polygonOffset: false,
													polygonOffsetUnits: 1,
													polygonOffsetFactor: -100 - (this.index*1) // more in front
											} );
	
//	this.mainGeometry.mergeVertices();

	this.object = new THREE.Mesh( this.mainGeometry, material );
	//this.plane.position.y = 5;

	this.object.userData.type = this.datatype;
	this.object.userData.defMat = material;

	loadded(this.object);
	//thisCore.scene.add( this.plane );



}

//load vectors from DB
geoJSONLineLoader.prototype.loadJSONfromDB = function(json, width){


	var tempMask = new THREE.Matrix3();
	var geometry;

	this.linewidth = 0.00002;
	for(obj in this.widthData){

		if(obj == width){
			
			this.linewidth = this.widthData[obj];

			break;
		}
	
	}


	this.loadMesh(json);



//	this.mainGeometry.mergeVertices();
	
	
	//this.plane.position.y = 5;


}
//create the Mesh 
geoJSONLineLoader.prototype.createMesh = function(){
		var material = new THREE.MeshBasicMaterial( {
												side: THREE.DoubleSide,
												depthWrite: false,
												polygonOffset: false,
												polygonOffsetUnits: 1,
												vertexColors: THREE.VertexColors,
												polygonOffsetFactor: -100 - (this.index*1) // more in front
										} );


	this.object = new THREE.Mesh( this.mainGeometry, material );


	this.object.userData.type = this.datatype;
	this.object.userData.defMat = material;


}
//load the Mesh, create geometries from vector data
geoJSONLineLoader.prototype.loadMesh = function(sa){
		//console.log(typeof(sa.coordinates), typeof(sa.geometry) );

		if(typeof(sa.geometry) != 'undefined'){
			var streetArr = sa.geometry.coordinates;
		}else
		if(typeof(sa.coordinates) != 'undefined'){
			var streetArr = sa.coordinates;
		}
		
		this.lastElem = false;
		geometry = new THREE.Geometry(); 

		

		var sp = new THREE.Vector3();
		var np = new THREE.Vector3();
		var ab = new THREE.Vector3();
		var ac = new THREE.Vector3();
		var normalV = new THREE.Vector3();

		var upV = new THREE.Vector3();
		

		//if lines length is more than 1
		if(streetArr.length > 1){


			for(var j = 0 ; j < streetArr.length; j++){
				var lastElem = false;
				
				//prepare the second point calculation
				sp.set( streetArr[j][0],  streetArr[j][2], streetArr[j][1] );
				upV.set(sp.x, sp.y+1, sp.z);


				if(streetArr[j + 1]){
				    np.set(
				                 streetArr[j + 1][0], 
				                 streetArr[j + 1][2], 
				                 streetArr[j + 1][1]);

				}else{
					this.lastElem = true;
				    np.set(
				                 streetArr[j - 1][0], 
				                 streetArr[j - 1][2], 
				                 streetArr[j - 1][1] );

				}


				ab.subVectors(np,sp).normalize();
				ac.subVectors(upV,sp).normalize();

				normalV = this.calcSecPoint(ac, ab);
				normalV.setLength(this.linewidth);
				
				

				normalV.divideScalar(2);
				sp.sub(normalV);
				normalV.multiplyScalar(2);
				normalV.add(sp);

				//transform first point from lat/long to 3D
				sp = thisCore.scaleCoordToTerrain(sp,"x/z");
				//sp.y = thatground.getHight([sp.x, sp.z]);
				
				//transform second point from lat/long to 3D
				normalV = thisCore.scaleCoordToTerrain(normalV,"x/z");
				//normalV.y = sp.y;

				geometry.vertices.push(sp.clone() );
				geometry.vertices.push(normalV.clone());


			/*
				var sgeometry = new THREE.SphereGeometry( 0.2, 32, 32 ); 
				sgeometry.translate(sp.x,sp.y,sp.z);
				var material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
				var sphere = new THREE.Mesh( sgeometry, material ); 
				thisCore.scene.add( sphere );

				var s2geometry = new THREE.SphereGeometry( 0.2, 32, 32 ); 
				s2geometry.translate(normalV.x,normalV.y,normalV.z);
				var material2 = new THREE.MeshBasicMaterial( {color: 0xCC9900} ); 
				var sphere = new THREE.Mesh( s2geometry, material2 ); 
				thisCore.scene.add( sphere );
			*/

			}
			//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-thatground.transformToOrigin.x, 0 , -thatground.transformToOrigin.z));
		}

		//mask to merge vertices into triangles
		var faceMaskArr = [0,1,2,1,3,2];
		for(var f = 1; f < streetArr.length ; f++){

			geometry.faces.push( new THREE.Face3( faceMaskArr[0], faceMaskArr[1], faceMaskArr[2] ) ); 
			geometry.faces.push( new THREE.Face3( faceMaskArr[3], faceMaskArr[4], faceMaskArr[5] ) ); 

			faceMaskArr[0] = faceMaskArr[0]+2;
			faceMaskArr[1] = faceMaskArr[1]+2;
			faceMaskArr[2] = faceMaskArr[2]+2;
			faceMaskArr[3] = faceMaskArr[3]+2;
			faceMaskArr[4] = faceMaskArr[4]+2;
			faceMaskArr[5] = faceMaskArr[5]+2;

		}

		var color = new THREE.Color( this.color );

		
		for(var f = 0; f < geometry.faces.length;f++){

			geometry.faces[f].vertexColors[0] = color;
			geometry.faces[f].vertexColors[1] = color;
			geometry.faces[f].vertexColors[2] = color;
		}
		
		//merge temp geometry to class geometry
		this.mainGeometry.merge(geometry.clone());
}

//function to calc a second point
geoJSONLineLoader.prototype.calcSecPoint = function(ac,ab, direct){
	var temVec = new THREE.Vector3();
	if(this.lastElem === false){
		temVec.crossVectors(ac,ab); 
	}else{
		temVec.crossVectors(ab,ac); 
	}
	return temVec;

}
geoJSONLineLoader.prototype.getNextPoint = function(elem){


}
