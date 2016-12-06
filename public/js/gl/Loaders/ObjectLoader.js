function ObjectLoader(){
	objLoad = this;

	this.totalGeometry = new THREE.Geometry();
	this.jloader = new THREE.ObjectLoader();
	this.firstElem = "";
	this.meshArry = new Array();
	this.objArray = new Array();
	this.objArray["obj"] = new Array();
	this.objArray["bbox"] = new Array();

	this.proposalObj = new Array();
	this.proposalObj['obj'] = new Array();
	this.proposalObj['bbox'] = new Array();

	this.faceRun = 0;
	this.objectFaces = function(){
		this.min = 0;
		this.max = 0;
		this.data = {};
	};
	this.objArrayMerged = new Array();


	this.hiddenObj = new Array();
	this.proposalLoaded = false;
	this.addProposalObj = new Array();
	
	this.hiddenObjList = new Array();

	this.objectsMat = new Array();
	this.objectsGeom = new THREE.Geometry();


}

ObjectLoader.prototype.loadObj = function(obj, cb){


		JSZipUtils.getBinaryContent('../../storage/app/'+obj.url, function(err, data) { 
									if(err) {
										throw err; // or handle err
									}	
									
			var object3d = objLoad.objToScene(data, obj);
			object3d.updateMatrix();
			object3d.geometry.computeBoundingBox();

			var box = new THREE.BoxHelper( object3d.clone() ); 


			var bbox = new THREE.Box3();
			bbox.setFromObject(object3d);


			objLoad.objArray["bbox"].push(bbox);
  			objLoad.objArray["obj"].push(object3d.clone());



			cb(object3d);

		});

		
}

ObjectLoader.prototype.loadProposal = function(obj){


		if(obj.hiddenbuildings.length > 0){
			for(var i = 0; i < obj.hiddenbuildings.length;i++){
				this.hideListCheckedfromID(obj.hiddenbuildings[i]);

			}
	
		}

		if(obj.hiddenbuildingsLow.length > 0){
			for(var i = 0; i < obj.hiddenbuildingsLow.length;i++){


				for(var j = 0; j < thatground.buildings.length;j++){

					if( (thatground.buildings[j] instanceof geoObjectLoader) == true){

							thatground.buildings[j].hideBuildngById(obj.hiddenbuildingsLow[i]);

			    	}
						    	
				}


			}
	
		}


		JSZipUtils.getBinaryContent('../../storage/app/'+obj.url, function(err, data) { 
									if(err) {
										throw err; // or handle err
									}	
					
		var object3d = objLoad.objToScene(data, obj);
		object3d.userData.parentID = obj.proposal_id;

		//objLoad.addProposalObj["obj"] = object3d.clone();
		objLoad.proposalObj['obj'].push( object3d.clone() );
/*
		var bbox = new THREE.Box3();
		bbox.setFromObject(objLoad.addProposalObj["obj"]);
		objLoad.addProposalObj["bbox"] = bbox;
		objLoad.addProposalObj["type"] = "pickedProposal";
*/

		var addproposalBBox =  new THREE.BoundingBoxHelper( objLoad.proposalObj['obj'][objLoad.proposalObj['obj'].length-1], 0xffcc00 );


		objLoad.proposalObj["bbox"].push(addproposalBBox);
		objLoad.proposalObj["bbox"][objLoad.proposalObj["bbox"].length-1].name = obj.name;
		objLoad.proposalObj["bbox"][objLoad.proposalObj["bbox"].length-1].update();

		
		objLoad.addProposalObj["type"] = "pickedProposal";

		thisCore.scene.add(objLoad.proposalObj["bbox"][objLoad.proposalObj["bbox"].length-1]);
		thisCore.scene.add(objLoad.proposalObj['obj'][objLoad.proposalObj['obj'].length-1]);
		//objLoad.proposalLoaded = true;
	
		thatRay.addIntersectObject(objLoad.proposalObj['obj'][objLoad.proposalObj['obj'].length-1]);
		thatGUI.proposalSec.loadProposalComments(objLoad.proposalObj['obj'][objLoad.proposalObj['obj'].length-1]);
	

	});


}
ObjectLoader.prototype.checkDoubleMats = function(mat){
	var found = false;
		if(this.objectsMat.length > 0){
			for(var i = 0; i < this.objectsMat.length;i++){

				if(this.objectsMat[i].uuid == mat.uuid){
					return i;
				}

			}
			this.objectsMat.push(mat);

		}else{
			this.objectsMat.push(mat);
		}
		return this.objectsMat.length-1;
}


ObjectLoader.prototype.objToScene = function(data, obj){



			var spliturl = obj.url.split(".");
			var filetype = spliturl[spliturl.length-1];
			var filename = spliturl[0].split("/")[spliturl[0].split("/").length-2];


			var wkt = new Wkt.Wkt();
			var latlng = wkt.read(obj.position);

			//obj.position.coordinates
			var pos = new THREE.Vector3(latlng.components[0].x, 0 , latlng.components[0].y);
			var newPos = thisCore.scaleCoordToTerrain(pos,"x/z");


			var mats = new Array();
			var zip = new JSZip(data);
			var geometry = new THREE.Geometry();
		
			var objData = zip.file(filename+".json").asText();
			//var mtlData = zip.file("office-building_01.mtl").asText();
			var jdata = JSON.parse(objData);
			var object3D = objLoad.jloader.parse(jdata); 
			
			object3D.position.x = 0;
			object3D.position.y = 0;
			object3D.position.z = 0;

			object3D.traverse(function(elem){

				if(elem instanceof THREE.Mesh){
					var objElem = elem.clone();
		
			
					//objLoad.meshArry.push(objElem.clone());
					objElem.material.fog = false;
					objElem.material.side = THREE.DoubleSide;

					var mat = objLoad.checkDoubleMats(objElem.material);
		
					
					if(objElem.geometry.type == "BufferGeometry"){
						var geometry2 = new THREE.Geometry().fromBufferGeometry( objElem.geometry );
						geometry.merge(geometry2, objElem.matrix, mat );
						//THREE.GeometryUtils.merge(geometry,geometry2, mats.length-1)
					}else if(objElem.geometry.type == "Geometry"){
						geometry.merge(objElem.geometry, objElem.matrix, mat );
						//THREE.GeometryUtils.merge(geometry,objElem.geometry, mats.length-1)
					}
					
					objElem.updateMatrixWorld( true );	
				}
			});
			

			geometry.computeBoundingBox();
			geometry.center();


			//objLoad.totalGeometry.merge(geometry, object3D.matrix);
			var material = new THREE.MultiMaterial(objLoad.objectsMat);
	
/*	var material = new THREE.MeshLambertMaterial( {
	    vertexColors: THREE.VertexColors,
	    lights:true,
	    shading : THREE.SmoothShading,
	    side:THREE.DoubleSide
	} );
*/
	
			var total = new THREE.Mesh(geometry, material);
			total.castShadow = true;
			total.receiveShadow = true;

			var tempGeom = geometry.clone();
	
						
			total.applyMatrix(new THREE.Matrix4().makeScale(parseFloat(obj.scale),parseFloat(obj.scale),parseFloat(obj.scale) ));
			tempGeom.applyMatrix(new THREE.Matrix4().makeScale(parseFloat(obj.scale),parseFloat(obj.scale),parseFloat(obj.scale) ));
					
	/*
			//var euler = new THREE.Euler( obj.rotation[0], obj.rotation[1], obj.rotation[2], 'XYZ' );
			total.rotateX(obj.rotation[0]);
			total.rotateY(obj.rotation[1]);
			total.rotateZ(obj.rotation[2]);

		*/	


			var euler = new THREE.Euler( obj.rotation[0], obj.rotation[1], obj.rotation[2], 'XYZ' );
			total.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(euler));
			tempGeom.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(euler));	
		/*	
			total.applyMatrix(new THREE.Matrix4().makeRotationX(obj.rotation[0]));
			total.applyMatrix(new THREE.Matrix4().makeRotationY(obj.rotation[1]));
			total.applyMatrix(new THREE.Matrix4().makeRotationZ(obj.rotation[2]));
*/
			total.quaternion.w = obj.quaternion[0];
			total.quaternion.x = obj.quaternion[1];
			total.quaternion.y = obj.quaternion[2];
			total.quaternion.z = obj.quaternion[3];


			


			total.applyMatrix(new THREE.Matrix4().makeTranslation(newPos.x, parseFloat(obj.atli),newPos.z));	
			tempGeom.applyMatrix(new THREE.Matrix4().makeTranslation(newPos.x, parseFloat(obj.atli),newPos.z));
		
			total.updateMatrix();
			
			if(obj.hiddenbuildings){
				var hidden = obj.hiddenbuildings;
			}else{
				var hidden = [];
			}

			if(obj.hiddenbuildingsLow){
				var hiddenLow = obj.hiddenbuildingsLow;
			}else{
				var hiddenLow = [];
			}

  			total.name = obj.name;
  			total.userData = { 
  					'id':obj.id,
  					'city_id': obj.city_id,
  					'hidden': hidden,
  					'hiddenLow': hiddenLow

  			}


  			total.up = new THREE.Vector3(0,1,0);

  			//this.objectsGeom.merge(tempGeom);

  			faces = new this.objectFaces();

			faces.min = this.faceRun;
			this.faceRun += tempGeom.faces.length;
			faces.max = this.faceRun;
			faces.data = {
				'id':obj.id,
				'city_id': obj.city_id,
  				'hidden': hidden

			};

			//this.objArrayMerged.push( faces );



  			return total;
}





ObjectLoader.prototype.addLastElemToscene = function(){
	thatGUI.proposalSec.removeAddedObject(objLoad.addProposalObj["obj"],objLoad.addProposalObj['bbox']);
	thisCore.scene.add(objLoad.objArray["obj"][objLoad.objArray["obj"].length-1]);
	thatRay.addIntersectObject(objLoad.objArray["obj"][objLoad.objArray["obj"].length-1]);
	
}

ObjectLoader.prototype.showObjs = function(ids){


	for(var i = 0; i < this.objArray["obj"].length;i++){
		for(var j = 0; j < ids.length;j++){
			if(ids[j] == this.objArray['obj'][i].userData.id){
				if(this.objArray['obj'][i].visible == false){

						this.objArray['obj'][i].visible = true;

						var index = this.hiddenObjList.indexOf(ids[j]);
						this.hiddenObjList.splice(index, 1);

				}
			}
		}
	}

/*
	for(var i = 0; i < this.objArrayMerged.length;i++){
		for(var k = 0; k < ids.length; k++){
			if(this.objArrayMerged[i].data.id == ids[k]){


				var facesIndices = ["a","b","c"];
				var faces = thisCore.buildings.geometry.faces;

				for(var j = this.objArrayMerged[i].min; j < this.objArrayMerged[i].max ; j++){

					facesIndices.forEach(function(indices){
					
					        thisCore.buildings.geometry.vertices[faces[j][indices]].y -= (10000000);


					});

				}

			 	thisCore.buildings.updateMatrix();
			 	thisCore.buildings.geometry.verticesNeedUpdate = true;
			 
			 	var index = this.hiddenObjList.indexOf(ids[k]);
				this.hiddenObjList.splice(index, 1);
				
				console.log(this.hiddenObjList);
			}
		}	
	}	
*/
}

ObjectLoader.prototype.hideListCheckedfromID = function(id){

	for(var i = 0; i < this.objArray["obj"].length;i++){
		if(this.objArray['obj'][i].userData.id == id){

				this.objArray['obj'][i].visible = false;
				this.hiddenObjList.push(this.objArray['obj'][i].userData.id);
		
		
		}

	}

/*	for(var i = 0; i < this.objArrayMerged.length;i++){
		if(this.objArrayMerged[i].data.id == id){


			var facesIndices = ["a","b","c"];
			var faces = thisCore.buildings.geometry.faces;

			for(var j = this.objArrayMerged[i].min; j < this.objArrayMerged[i].max ; j++){

				facesIndices.forEach(function(indices){
				
				        thisCore.buildings.geometry.vertices[faces[j][indices]].y += (10000000);


				});

			}

		 	thisCore.buildings.updateMatrix();
		 	thisCore.buildings.geometry.verticesNeedUpdate = true;
	
		 	this.hiddenObjList.push(this.objArrayMerged[i].data.id);
		}

	}	
*/
}

ObjectLoader.prototype.showAll = function(){
	for(var i = 0; i < this.objArray["obj"].length;i++){
		this.objArray['obj'][i].visible = true;
		this.hiddenObjList = [];
	}
}


/*
*
*
*TRASH
*


ObjectLoader.prototype.collisionDetect = function(){
	if(typeof objLoad.addProposalObj["obj"] == "object" && objLoad.proposalLoaded == true){
	//	objLoad.addProposalObj["bbox"].update();
		for(var i = 0; i < objLoad.objArray["bbox"].length ; i++){

			if(objLoad.addProposalObj["type"] == "addedProposal"){

				var collision = objLoad.objArray["bbox"][i].isIntersectionBox(objLoad.addProposalObj["bbox"].box);
				
				if(collision == true){
					objLoad.hiddenObj.push(i);
					objLoad.objArray["obj"][i].visible = false;

				}else if(collision == false){

					objLoad.objArray["obj"][i].visible = true;

				}



			}else if(objLoad.addProposalObj["type"] == "pickedProposal"){

				var collision = objLoad.objArray["bbox"][i].isIntersectionBox(objLoad.addProposalObj["bbox"]);
			
				if(collision == true){
					
					objLoad.hiddenObj.push(i);
					objLoad.objArray["obj"][i].visible = false;

				}else if(collision == false){

					//this.objArray["obj"][i].visible = true;

				}

				
			}


			collision = false;
		}
	}

}

*/