function BuildingSection(){

	this.pickedID = "";
	this.focusObj = '';
	this.bsMenu = document.createElement('div');
	this.bsMenu.id = 'buildingMenuDiv';
	this.bsMenu.style.display = 'none';

	this.bsDiv = document.createElement('div');
	this.bsDiv.id = 'buildingContentDiv';
	this.bsDiv.style.display = 'none';
	thatGUI.guiDiv.appendChild(this.bsDiv);
	this.tempObjPos = {
		posX:0,
		posY:0,
		posZ:0,
		rotX:0,
		rotY:0,
		rotZ:0,
		scal:0
	};
	this.control = new AddedControl(this.cancelEdit);
	this.createBuildingMenu();
}
BuildingSection.prototype.render = function(){

	this.control.updateInfo();
	//console.log(typeof(thatTopMenuBar.dropsubmenu.bbHelper));
	if(typeof(thatTopMenuBar.dropsubmenu.bbHelper) != "string" ){
		thatTopMenuBar.dropsubmenu.bbHelper.update();
	}else
	if(typeof(thatRay.bbHelper) != "string"){
		thatRay.bbHelper.update();
	}
}

BuildingSection.prototype.menuHandler = function(e){
	this.pickedID = e.id;
	if(e.id == 'buildingEdit'){
		for(var i = 0; i < e.parentNode.children.length;i++){
			e.parentNode.children[i].className = 'greenbtn';
		}
		e.className = 'redbtn';

		if(e.id == 'buildingEdit'){
			this.editBuildmenu();
		}
	}else
	if(e.id == 'buildingEditSubDrop'){
		e.className = 'redbtn';
		this.editBuildmenu();
	}


}

BuildingSection.prototype.editBuildmenu = function(){

	if(typeof(this.focusObj) == 'object'){
		this.setTempPos(this.focusObj);
		thatGUI.objLoaded = true;
		thatGUI.commetnSec.closeComments();
		this.bsDiv.style.display = 'block';
		this.control.controlDiv.style.display = 'block';
		thisCore.control.attach(this.focusObj);
		thisCore.scene.add(thisCore.control);
		this.bsDiv.appendChild(this.control.controlDiv);


	}

}
BuildingSection.prototype.cancelEdit = function(){

	thatGUI.buildingSec.focusObj.position.x = thatGUI.buildingSec.tempObjPos.posX;
	thatGUI.buildingSec.focusObj.position.y = thatGUI.buildingSec.tempObjPos.posY;
	thatGUI.buildingSec.focusObj.position.z = thatGUI.buildingSec.tempObjPos.posZ;

	thatGUI.buildingSec.focusObj.rotation.x = thatGUI.buildingSec.tempObjPos.rotX;
	thatGUI.buildingSec.focusObj.rotation.y = thatGUI.buildingSec.tempObjPos.rotY;
	thatGUI.buildingSec.focusObj.rotation.z = thatGUI.buildingSec.tempObjPos.rotZ;

	thatGUI.buildingSec.focusObj.scale.x = thatGUI.buildingSec.tempObjPos.scal;
	thatGUI.buildingSec.focusObj.scale.y = thatGUI.buildingSec.tempObjPos.scal;
	thatGUI.buildingSec.focusObj.scale.z = thatGUI.buildingSec.tempObjPos.scal;

	thatGUI.buildingSec.closeBuildMenu();

	console.log(thatGUI.buildingSec.tempObjPos);

}

BuildingSection.prototype.openBuildMenu = function(obj){
	this.bsMenu.style.display = 'block';
	this.focusObj = obj;
	this.pickedID = 'buildingEdit';
}

BuildingSection.prototype.closeBuildMenu = function(){
	//console.log(this.pickedID);
	if(this.pickedID == 'buildingEdit'){

		if(this.bsMenu.children.length > 0){
			this.bsMenu.style.display = 'none';
			for(var i = 0; i < this.bsMenu.children[0].children.length;i++){
				this.bsMenu.children[0].children[i].className = 'greenbtn';
			}
			this.bsDiv.style.display = 'none';
			thisCore.control.detach();
		}
	}else
	if(this.pickedID == 'buildingEditSubDrop'){

		this.bsDiv.style.display = 'none';
		thatTopMenuBar.dropsubmenu.editBuilding.className = 'greenbtn';
		thisCore.control.detach();

	}
	thatGUI.objLoaded = false;
}
BuildingSection.prototype.setTempPos = function(obj){

	this.tempObjPos = {
		posX:obj.position.x,
		posY:obj.position.y,
		posZ:obj.position.z,
		rotX:obj.rotation.x,
		rotY:obj.rotation.y,
		rotZ:obj.rotation.z,
		scal:obj.scale.x
	};


}
BuildingSection.prototype.createBuildingMenu = function(){}
