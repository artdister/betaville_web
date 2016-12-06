
/***************************************************************************************************
*
*	Section For GeoGround Interact  *************************************************************************
*
***************************************************************************************************/
GeoSection.prototype.addGeoMenu = function(){

	this.groundinteractAddProposal = document.createElement('li');
	this.groundinteractAddProposal.innerHTML = transGM['addPropo'];
	this.groundinteractAddProposal.setAttribute('id', 'addProposal');
	this.groundinteractAddProposal.setAttribute('onclick', "thatGUI.groundSec.groundinteractHandler(this);");
	this.groundinteractAddProposal.className = 'greenbtn';

	this.groundinteractAddGeoComment = document.createElement('li');
	this.groundinteractAddGeoComment.innerHTML = transGM['addGeoPos'];
	this.groundinteractAddGeoComment.setAttribute('id', 'addgeoPosition');
	this.groundinteractAddGeoComment.setAttribute('onclick', "thatGUI.groundSec.groundinteractHandler(this);");
	this.groundinteractAddGeoComment.className = 'greenbtn';

	this.groundinteractAddCityObj = document.createElement('li');
	this.groundinteractAddCityObj.innerHTML = transGM['addBuild'];
	this.groundinteractAddCityObj.setAttribute('id', 'addCityObj');
	this.groundinteractAddCityObj.setAttribute('onclick', "thatGUI.groundSec.groundinteractHandler(this);");
	this.groundinteractAddCityObj.className = 'greenbtn';

	this.groundinteractUL.appendChild(this.groundinteractAddGeoComment);
	this.groundinteractUL.appendChild(this.groundinteractAddProposal);
	this.groundinteractUL.appendChild(this.groundinteractAddCityObj);

}
GeoSection.prototype.uploadCityObjtoDB = function(){

	var posDB = thisCore.scaleTerrainTocoord(thisCore.control.object.position);


		var outobj = objLoad.addProposalObj["obj"];
		var zip = new JSZip();
		zip.file(this.addCityobjName.value+".json", JSON.stringify(loadToScene.addProposalObjSRC));
		var content = zip.generate({type:"blob", compression:"DEFLATE"});


	/*
	FIRE THE AJAX POST TO WRITE INTO THE DATABASE THE CITY OBJECT
	*/

	var fd = new FormData();
	fd.append('objlength', loadingData['models']['buildings'].high.length);
	fd.append('parentID', loadingData['city'].id);
	fd.append('citySTR', loadingData['city'].name);
	fd.append('author', loadingData['user'].name);
	fd.append('name', this.addCityobjName.value);
	fd.append('fileOBJ', content);

	for(var i = 0;i <  this.uploadCityObjTexture.length; i++){
	//	fd.append('fileTex:'+i, thatGUI.uploadCityObjTexture[i]);
	}
	fd.append('lat', round(posDB.z,6));
	fd.append('lng', round(posDB.x,6));
	fd.append('atli', round(outobj.position.y, 3));
	fd.append('scale', outobj.scale.x);

	fd.append('rotatY', round(thisCore.control.object.rotation.y , 3));
	fd.append('rotatX', round(thisCore.control.object.rotation.x, 3));
	fd.append('rotatZ', round(thisCore.control.object.rotation.z, 3));
	fd.append('quaternionW', round(thisCore.control.object.quaternion.w, 6));
	fd.append('quaternionX', round(thisCore.control.object.quaternion.x, 6));
	fd.append('quaternionY', round(thisCore.control.object.quaternion.y, 6));
	fd.append('quaternionZ', round(thisCore.control.object.quaternion.z, 6));

	fd.append('upload','cityObj');

	ajax.send('../cities/uploadobj',
			function(e){



				var citylist = JSON.parse(e);
				console.log(citylist);
				objLoad.loadObj(citylist, objLoad.addLastElemToscene);

				thisCore.control.detach();
				thatGUI.hideGroundInteract();
				thatGUI.groundSec.cancelBuildToScene();

				loadingData['models']['buildings'].high.push(citylist);

				
			},
			'dataUpload',
			fd

	);





}



/***************************************************************************************************
*
*	Section For Drop Sub Menu Interact  *************************************************************************
*
***************************************************************************************************/


DropSubMenu.prototype.delte = function(){

//after cb from db

	if(this.openType == 'building'){

		ajax.send('../cities/delete/'+this.focusObj.id,
				function(e){

					thatTopMenuBar.dropsubmenu.delteCB();
				},
				'dataUpload'

		);


	}else
	if(this.openType == 'proposal'){

		ajax.send('../proposal/delete/'+this.focusObj.id,
				function(e){

					thatTopMenuBar.dropsubmenu.delteCB();
				},
				'dataUpload'

		);

	}else
	if(this.openType == 'geoposition'){


		ajax.send('../geoposition/delete/'+this.focusObj.id,
				function(e){

					thatTopMenuBar.dropsubmenu.delteCB();

				},
				'dataUpload'

		);

	}





}

DropSubMenu.prototype.delteCB = function(){

	this.focusElem.style.display = 'none';
	this.dropSubDiv.style.display = 'none';
	var obj = thisCore.scene.getObjectByName(this.focusObj.name);
	thisCore.scene.remove(obj);
	disposeHierarchy(obj, disposeNode);
	thisCore.scene.remove(this.bbHelper);
	this.bbHelper = "undefined";

};


/***************************************************************************************************
*
*	Section For City Buildings  *************************************************************************
*
***************************************************************************************************/

BuildingSection.prototype.createBuildingMenu = function(){

	var bmUL = document.createElement('ul');


	this.editBuilding = document.createElement('li');
	this.editBuilding.className = 'greenbtn';
	this.editBuilding.innerHTML = 'edit Building';
	this.editBuilding.setAttribute('id', 'buildingEdit');
	this.editBuilding.setAttribute('onclick', 'thatGUI.buildingSec.menuHandler(this)');


	this.editSavebtn = document.createElement('input');
	this.editSavebtn.setAttribute('value' , transABO['Save']);
	this.editSavebtn.setAttribute('type', 'button');
	this.editSavebtn.setAttribute('onclick', "thatGUI.buildingSec.saveEditPosition()");
	this.editSavebtn.className = 'greenbtn';
	this.bsDiv.appendChild(this.editSavebtn);


	bmUL.appendChild(this.editBuilding);

//	thatTopMenuBar.dropsubmenu.controlDiv.appendChild(thatGUI.buildingSec.editBuilding);


	this.bsMenu.appendChild(bmUL);




}
BuildingSection.prototype.saveEditPosition = function(){

	var posDB = thisCore.scaleTerrainTocoord(this.focusObj.position);
	posDB.y = posDB.y*10;
	var fd = new FormData();
	fd.append('id', this.focusObj.userData.id);
	fd.append('position', posDB.toArray());
	fd.append('rotation', this.focusObj.rotation.toArray());
	fd.append('quaternion', this.focusObj.quaternion.toArray());
	fd.append('scale', this.focusObj.scale.x);

	ajax.send('../cities/movebuilding',
				function(e){

					alert(transPS['uploadsuccess']);
					thatGUI.buildingSec.closeBuildMenu();


				},
				'dataUpload',
				fd

	);
}
