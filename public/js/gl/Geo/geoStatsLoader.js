function geoStatsLoader(){
	

	this.statsObjs = new Array();
	this.statsObjs['obj'] = new Array();
	this.statsObjs['area'] = new Array();
	this.statsObjs['center'] = new Array();
	this.statsObjs['stats'] = new Array();
	this.statsList = new Array();
	this.pickedOBJ = new Array();
	this.selectColor = 'rgb(255,255,255)';
	this.statsOnScene = false;
	this.openLiElement = '';
	this.extrudeSettings = { 	amount: 10, 
								bevelEnabled: false, 
								bevelSegments: 1, 
								steps: 2, 
								bevelSize: 1, 
								bevelThickness: 1 
							};

	this.raycaster = new THREE.Raycaster();



	this.mainGeometry = new THREE.Geometry();

	this.createMeta();

}
geoStatsLoader.prototype.loadJSON = function(elem){

	this.loadingObj = {
		'index' : preLoad.onLoadDataSet.dataStats[elem.getAttribute('idint')],
		'length' : preLoad.onLoadDataSet.dataStats[elem.getAttribute('idint')].length

	}

	var data = preLoad.onLoadDataSet.dataStats[elem.getAttribute('idint')];
	
	thisCore.loadScreen.showLoading();
	ajax.get('../../storage/app/'+data.src,
		'json',
		function(i){
		
			var json = JSON.parse(i);
			thisCore.loadScreen.setMergeMsg();
			

			for(var i = 0;i < json.features.length;i++){

		
				var state = json.features[i];
	
				thatground.stats.createStatsGeometry(state, data, i);
				//thatground.stats.createStatsGeometry(state.geometry, 'lines');
				thatground.stats.addState(state.properties, data, i);


			}


		//	thatground.terrain.plane.visible = false;
			
			for(var i = 0; i < thatground.stats.statsObjs['obj'].length;i++){

				thisCore.scene.add(thatground.stats.statsObjs['obj'][i]);
				thisCore.scene.add(thatground.stats.statsObjs['area'][i]);

			}

			for(var i = 0; i < thatground.stats.statsObjs['stats'].length; i++){

				thisCore.scene.add(thatground.stats.statsObjs['stats'][i]);

			}
			thatground.stats.statsOnScene = true;
			thisCore.loadScreen.hideLoading();
		},
		true
	);




}

geoStatsLoader.prototype.createStatsGeometry = function(elem, data, elemID){
	//var json = JSON.parse(elem.geom);
	var json = elem;

	if(json.geometry != null){
		for(var i = 0; i < json.geometry.coordinates.length; i++){

			var prts = new Array();

			for(var j = 0;j < json.geometry.coordinates[i][0].length-1;j++){

					var coord = new THREE.Vector3(	json.geometry.coordinates[i][0][j][0], 
													30,
													json.geometry.coordinates[i][0][j][1]) ;

					var sceneCoords = thisCore.scaleCoordToTerrain( coord , "x/z" );
					var coordsVec2 = new THREE.Vector2(sceneCoords.x, sceneCoords.z);
						

					for(var p = 0; p < prts.length;p++){
						if(prts[p].x == coordsVec2.x && prts[p].y == coordsVec2.y){

							coordsVec2.x += 0.1;
						}


					}
					prts.push(coordsVec2 );

			}

			var shape = new THREE.Shape(prts);
		
			

			var mesh = this.createLines(shape);
			var meshObj = this.createArea(shape);

		

			mesh.geometry.computeBoundingBox();
			boundingBox = mesh.geometry.boundingBox;

			var x0 = boundingBox.min.x;
			var x1 = boundingBox.max.x;
			var y0 = boundingBox.min.y;
			var y1 = boundingBox.max.y;
			var z0 = boundingBox.min.z;
			var z1 = boundingBox.max.z;


		    var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;
		    var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;
		    var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;

		    var centroidX = x0 + ( bWidth / 2 ) + mesh.position.x;
		    var centroidY = y0 + ( bHeight / 2 )+ mesh.position.y;
		    var centroidZ = z0 + ( bDepth / 2 ) + mesh.position.z;


		    meshObj.position.set( 0, parseFloat(thatground.waterlevel.max), 0 );
		    meshObj.updateMatrix();
		    meshObj.name = "post_area"
		    meshObj.castShadow = false;
			meshObj.receiveShadow = false;
		    meshObj.userData = {
				post_code : json.properties.CFSAUID ,
				id: elemID

			};
			var borderH = parseFloat(thatground.waterlevel.max)+10;

			mesh.position.set( 0, borderH , 0 );
			mesh.name = 'statsTerrain';
			mesh.updateMatrix();

			mesh.castShadow = false;
			mesh.receiveShadow = false;
			mesh.userData = {
				post_code : json.properties.CFSAUID ,
				id : elemID 

			};

		
			this.statsObjs['obj'].push(mesh.clone());
			this.statsObjs['center'].push({ x : centroidX, y : centroidY, z : centroidZ } );
		
		}
	}


}
geoStatsLoader.prototype.addState = function(elem, data, id){

	var location = this.statsObjs['center'][this.statsObjs['center'].length-1];
	var group = new THREE.Object3D();
	var algin = 0;


	for(var i = 0;i < data.data.length; i++){

		if(elem[data.data[i].name] != 0){
			algin += 1;
			var scaleSize = 0;
			if(elem[data.data[i].name] == 0 && typeof(data.scale) != "number"){
				scaleSize = elem[data.data[i].name]*1000;
			}else{
				scaleSize = elem[data.data[i].name]*data.scale;
			}
			

			var geometry = new THREE.BoxGeometry( 500, scaleSize, 500 );
			
			var material = new THREE.MeshBasicMaterial({	color: data.data[i].color,
															polygonOffset: true,
															polygonOffsetUnits: 2,
															polygonOffsetFactor: -10  });
			var mesh = new THREE.Mesh( geometry, material );

			


			
			mesh.updateMatrix();
			mesh.geometry.computeBoundingBox();
			boundingBox = mesh.geometry.boundingBox;
			var bboxdif = boundingBox.max.y - boundingBox.min.y


			mesh.position.set(location.x + (algin*500) * 1.8,  location.y + bboxdif/2  , location.z);
		
			mesh.userData = {
				'name':data.data[i].name,
				'color':data.data[i].color,
				'value': elem[data.data[i].name]

			};


			mesh.updateMatrix();

		
			this.statsList.push( mesh.clone() );
			group.add(mesh.clone() );
			

		}

	}

	group.userData['id'] = id;
	group.userData['post_id'] = elem['CFSAUID'];
	group.userData['post_name'] = elem['PRNAME'];

	for(var i = 0; i < data.data.length;i++){

		group.userData[data.data[i].name] = elem[data.data[i].name];

	}
		

		this.statsObjs['stats'].push(group.clone());


}




geoStatsLoader.prototype.removeStats = function(){

	this.statsOnScene = false;
	this.metaDiv.style.display = 'none';

	for(var i = 0;i < this.statsObjs['obj'].length;i++){

		if(this.statsObjs['obj'][i]){
			thisCore.scene.remove( this.statsObjs['obj'][i] );
			disposeHierarchy(this.statsObjs['obj'][i], disposeNode);
		}

		if(this.statsObjs['area'][i]){
			thisCore.scene.remove( this.statsObjs['area'][i] );
			disposeHierarchy(this.statsObjs['area'][i], disposeNode);
		}

	}
	for(var i = 0;i < this.statsObjs['stats'].length;i++){
		if(this.statsObjs['stats'][i]){

			thisCore.scene.remove( this.statsObjs['stats'][i] );
			disposeHierarchy(this.statsObjs['stats'][i], disposeNode);
		}
			
	}

	this.statsObjs['obj'] = new Array();
	this.statsObjs['center'] = new Array();
	this.statsObjs['stats'] = new Array();

	

//	thatground.terrain.plane.visible = true;
}





geoStatsLoader.prototype.createLines = function(shape){
		shape.autoClose = false;

		var spacedPoints = shape.createPointsGeometry( );
		spacedPoints.applyMatrix(new THREE.Matrix4().makeRotationX( Math.PI / 2 ));

		var mesh = new THREE.Line( spacedPoints, 
						new THREE.LineBasicMaterial( { 	color: 0xFFFF00, 
														side: THREE.DoubleSide } ) );
		
		mesh.geometry.buffersNeedUpdate = true;
		mesh.geometry.uvsNeedUpdate = true;
		return mesh;
				
}
geoStatsLoader.prototype.createArea = function(shape){

		var geometry = new THREE.ExtrudeGeometry( shape, this.extrudeSettings  );
		geometry.applyMatrix(new THREE.Matrix4().makeRotationX( Math.PI / 2 ));

		var mesh = new THREE.Mesh( geometry, 
						new THREE.MeshLambertMaterial ( { 	color: 0xFFFFFF, 
														side: THREE.DoubleSide,
														opacity: 0,
														transparent: true,
														depthWrite: false,
														polygonOffset: true,
														polygonOffsetUnits: 1,
														polygonOffsetFactor: -1 } ) );
		
		return mesh;
				
}

geoStatsLoader.prototype.onclickAction = function(event,flag){


	if(this.pickedOBJ.length > 0){
				
		this.unhightlightObj(this.pickedOBJ);
	}


    var intersects = thisCore.mouse.raycaster.intersectObjects(this.statsObjs['stats'] ,true);

	if(intersects.length > 0 && thisCore.mouse.button == "left"){
		var elem = intersects[0].object;
		
		this.hightlightObj(elem);
		this.pickedOBJ.push(elem);


	/*	for(var i = 0; i < this.statsObjs['obj'].length;i++){


			


			if(this.statsObjs['obj'][i].userData.post_code == elem.userData.post_code){
					
			
					
					
					this.hightlightObj(this.statsObjs['obj'][i]);


				
				
					for(var s = 0;s < this.statsObjs['stats'].length;s++){
					
						if(this.statsObjs['stats'][s].userData.id ==  elem.userData.id){


							this.updateMeta(this.statsObjs['stats'][s]);
							break;
						}


					}
					
			

			} 
		}*/



	}

}
geoStatsLoader.prototype.hightlightObj = function(obj){

	obj.material.color = new THREE.Color(this.selectColor);	
	this.updateMeta(obj);
	/*obj.material.color = new THREE.Color( 0xffffff );
	obj.material.polygonOffset = true;
	obj.material.polygonOffsetUnits = 1;
	obj.material.polygonOffsetFactor = -10;
	obj.material.needsUpdate = true;
	obj.translateY(100);
*/
}
geoStatsLoader.prototype.unhightlightObj = function(obj){
	
	this.metaDiv.style.display = 'none';

console.log(obj);
	

	for(var i = 0; i < obj.length;i++){
		obj[i].material.color = new THREE.Color(obj[i].userData.color);
		/*
		obj[i].material.color = new THREE.Color( 0xFFFF00 );
		obj[i].material.polygonOffset = false;
		obj[i].material.polygonOffsetUnits = 1;
		obj[i].material.polygonOffsetFactor = -10;
		obj[i].material.needsUpdate = true;
		obj[i].translateY(-100);
		*/
	}

	this.pickedOBJ = new Array();
	
}



geoStatsLoader.prototype.createMeta = function(){

	this.metaDiv = document.createElement('div');
	this.metaDiv.id = "statsDiv";
	this.metaDiv.style.display = 'none';
	var metaTable = document.createElement('table');


	var nameTR = document.createElement('td');
	var valueTR = document.createElement('td');


	metaTable.appendChild(nameTR);
	metaTable.appendChild(valueTR);
	this.metaDiv.appendChild(metaTable);	







}

geoStatsLoader.prototype.updateMeta = function(elem){

	for(var i = 0; i < this.metaDiv.children[0].children.length;i++){

		this.metaDiv.children[0].children[i].innerHTML = "";
	}
	var runVar = 0;

	for(key in elem.userData){
		if(key != 'id' && key != 'color'){
			
		
			
			var nameTD = document.createElement('tr');
			nameTD.innerHTML = '<p>'+key+'</p>';
			console.log(nameTD);

			var valueTD = document.createElement('tr');
			valueTD.innerHTML = '<p>'+elem.userData[key]+'</p>';

			this.metaDiv.children[0].children[0].appendChild(nameTD);
			this.metaDiv.children[0].children[1].appendChild(valueTD)
		
			if(key == 'post_name' || key == 'post_id'){
				nameTD.style.color = 'black';

			}else{
				var r = elem.material.color.getHexString();
			
				//nameTD.style.color = '#'+r;
				runVar++;
			}

			

		}
	}


	this.metaDiv.style.display = 'block';

	

}
