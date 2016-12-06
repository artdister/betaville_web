function LoadHelpers(){

		loadToScene = this;
		this.objectsMat = new Array();


}

LoadHelpers.prototype.JSON = function(objURL, objName, posVec, type){
	var loader = new THREE.ObjectLoader();

	var geometry = new THREE.Geometry();
	var mats = new Array();

	loader.load(objURL, function(jobj){
	
			loadToScene.addProposalObjSRC = jobj.toJSON();
			loadToScene.placeToScene(jobj, objName, posVec, type);

	});

};


LoadHelpers.prototype.collada = function(objURL, objName, posVec, type){
	loadToScene.loader = new THREE.ColladaLoader();
	var jloader = new THREE.ObjectLoader();

	this.loader.options.convertUpAxis = true;
	loadToScene.loader.options.upAxis = "Y";

	
	loadToScene.loader.load(objURL, function(col){
			//thisCore.scene.add(col.scene);

			var jobj = col.scene.toJSON();
			var obj = jloader.parse(jobj);
			loadToScene.addProposalObjSRC = jobj;
			loadToScene.placeToScene(obj, objName, posVec, type);
			
	})

};
LoadHelpers.prototype.checkDoubleMats = function(mat){
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


LoadHelpers.prototype.placeToScene = function(obj, name, pos, type){

		var geometry = new THREE.Geometry();
		var mats = new Array();

		obj.traverse(function(child){

				if(child instanceof THREE.Mesh){
				
				var objElem = child.clone();

				objElem.material.fog = false;
				objElem.material.side = THREE.DoubleSide;

				var mat = loadToScene.checkDoubleMats(objElem.material);
	
				if(objElem.geometry.type == "BufferGeometry"){
					var geometry2 = new THREE.Geometry().fromBufferGeometry( objElem.geometry );
					geometry.merge(geometry2, objElem.matrix, mat );

				}else if(objElem.geometry.type == "Geometry"){
					geometry.merge(objElem.geometry, objElem.matrix, mat );

				}

				objElem.updateMatrixWorld( true );	

				}
		})

		geometry.computeBoundingBox();
		geometry.center();


		//objLoad.totalGeometry.merge(geometry, object3D.matrix);
		var material = new THREE.MultiMaterial(loadToScene.objectsMat);
		var total = new THREE.Mesh(geometry, material);

	
		total.applyMatrix(new THREE.Matrix4().makeScale(parseFloat(0.32),parseFloat(0.32),parseFloat(0.32) ))

		total.position.x = pos.x;
		total.position.z = pos.z;

		if(type == 'cityOBJ'){
			total.position.y = pos.y;	
		}else
		if(type == 'proposalObject'){
			total.position.y = pos.y - 1500;
		}

		total.name = name;

		total.castShadow = true;
		total.receiveShadow = true;

		total.updateMatrix();
		

		objLoad.addProposalObj["obj"] = total.clone();



		var addproposalBBox =  new THREE.BoundingBoxHelper( objLoad.addProposalObj["obj"], 0xffcc00 );
		addproposalBBox.name = name;


		objLoad.addProposalObj["bbox"] = addproposalBBox;
		objLoad.addProposalObj["bbox"].update();
		objLoad.addProposalObj["type"] = "addedProposal";

		
		thisCore.control.attach( objLoad.addProposalObj["obj"] );
		thisCore.scene.add(thisCore.control);
		thisCore.scene.add(objLoad.addProposalObj["obj"]);
		thisCore.scene.add(objLoad.addProposalObj["bbox"]);
		
		


		objLoad.proposalAddLoaded = true;
		objLoad.proposalLoaded = true;

}