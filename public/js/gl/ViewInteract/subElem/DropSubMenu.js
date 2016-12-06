function DropSubMenu(){
	
	this.focusObj = '';
	this.focusElem = '';
	this.bbHelper = "undefined";

	this.dropSubDiv = document.createElement('div');
	this.dropSubDiv.id = 'dropSubDiv';
	this.dropSubDiv.style.display = 'none';

	var table = document.createElement('table');


	var urlTR = document.createElement('tr');
	var urlInfoTD = document.createElement('td');
	this.urlInfo = document.createElement('p');
	this.urlInfo.innerHTML = transTMBS['url'];
	urlInfoTD.appendChild(this.urlInfo);
	urlTR.appendChild(urlInfoTD);

	var urlInputTD = document.createElement('td');
	urlInputTD.id = 'dsmInput';
	this.URL = document.createElement('input');
	this.URL.type = 'text';
	urlInputTD.appendChild(this.URL);
	urlTR.appendChild(urlInputTD);




	var positionTR = document.createElement('tr');
	var positionInfoTD = document.createElement('td');
	this.positionInfo = document.createElement('p');
	this.positionInfo.innerHTML = transTMBS['position'];
	positionInfoTD.appendChild(this.positionInfo);
	positionTR.appendChild(positionInfoTD);

	var positionInputTD = document.createElement('td');
	positionInputTD.id = 'dsmInput';
	this.position = document.createElement('input');
	this.position.type = 'text';
	positionInputTD.appendChild(this.position);
	positionTR.appendChild(positionInputTD);




	var atliTR = document.createElement('tr');
	var atliInfoTD = document.createElement('td');
	this.atliInfo = document.createElement('p');
	this.atliInfo.innerHTML = transTMBS['atli'];
	atliInfoTD.appendChild(this.atliInfo);
	atliTR.appendChild(atliInfoTD);

	var atliInputTD = document.createElement('td');
	atliInputTD.id = 'dsmInput';
	this.atli = document.createElement('input');
	this.atli.type = 'text';
	atliInputTD.appendChild(this.atli);
	atliTR.appendChild(atliInputTD);




	var authorTR = document.createElement('tr');
	var authorInfoTD = document.createElement('td');
	this.authorInfo = document.createElement('p');
	this.authorInfo.innerHTML = transTMBS['author'];
	authorInfoTD.appendChild(this.authorInfo);
	authorTR.appendChild(authorInfoTD);

	var authorInputTD = document.createElement('td');
	authorInputTD.id = 'dsmInput';
	this.author = document.createElement('input');
	this.author.type = 'text';
	authorInputTD.appendChild(this.author);
	authorTR.appendChild(authorInputTD);

	table.appendChild(urlTR);
	table.appendChild(positionTR);
	table.appendChild(atliTR);
	table.appendChild(authorTR);

	this.dropSubDiv.appendChild(table);


	this.controlDiv = document.createElement('div');
	this.controlDiv.id = 'subDropMenuControl';



	this.editBuilding = document.createElement('button');
	this.editBuilding.className = 'greenbtn';
	this.editBuilding.innerHTML = 'edit Building';
	this.editBuilding.setAttribute('id', 'buildingEditSubDrop');
	this.editBuilding.addEventListener('click', function(){
		
		var flag = 0;
		for(var i = 0; i < objLoad.objArray["obj"].length;i++){
			if(objLoad.objArray["obj"][i].userData.id == thatTopMenuBar.dropsubmenu.focusObj.id){
				thatGUI.buildingSec.focusObj = objLoad.objArray["obj"][i];
				break;
			}
		}

		thatGUI.buildingSec.menuHandler(this);

	});




	this.deletBtn = document.createElement('button');
	this.deletBtn.className = 'redbtn';
	this.deletBtn.innerHTML = transTMBS['remove'];
	this.deletBtn.addEventListener("click", function() {

			thatTopMenuBar.dropsubmenu.delte();

	});
	if(loadingData['user'].role >= 1){
		this.controlDiv.appendChild(this.deletBtn);
		this.controlDiv.appendChild(this.editBuilding);
	}
	


	this.dropSubDiv.appendChild(this.controlDiv);

}

DropSubMenu.prototype.showSubElement = function(obj, elem, type) {

	this.openType = type;
	this.focusObj = obj;
	this.focusElem = elem;
	this.dropSubDiv.style.display = 'block';

	//console.log(obj, elem, type);

	for(var i = 0; i < elem.parentNode.children.length;i++){
		var li = elem.parentNode.children[i];

	//	li.style.borderTop = '1px solid white';
	//	li.style.borderBottom = '1px solid white';
	li.className = "dropDownMenuSubBTN"
	}

	//elem.style.borderTop = '1px solid grey';
	//elem.style.borderBottom = '1px solid grey';
	elem.className = "dropDownMenuSubBTN greenbtn";
//	this.dropSubDiv.style.top = elem.offsetTop+'px';

	this.URL.value = obj.url;
	this.position.value = obj.position;
	this.atli.value = obj.atli/10;
	this.author.value = obj.author;

	//hightlight obj on scene
	var flag = -1;
	if(this.openType == 'building'){
		var run = objLoad.objArray["obj"];
	}else
	if(this.openType == 'proposal'){
		var run = propLoader.propArray;
	}else
	if(this.openType == 'geoposition'){
		var run = thatGeoComments.geoCommentArray;
	}

	for(var i = 0; i < run.length;i++){
		if(run[i].userData.id == this.focusObj.id){
			flag = i;
			break;
		}
	}

	if(flag >= 0){
		if(this.bbHelper != 'undefined'){
			this.bbHelper.object = run[flag];
		}else{
			this.bbHelper = new THREE.BoundingBoxHelper( run[flag], 0xffcc00 );
			thisCore.scene.add( this.bbHelper );				
		}
	
		this.bbHelper.update();
	}
	var pos = this.bbHelper.position.clone();

	var d = {
		"x" : this.bbHelper.box.max.x - this.bbHelper.box.min.x,
		"y" : this.bbHelper.box.max.y - this.bbHelper.box.min.y,
		"z" : this.bbHelper.box.max.z - this.bbHelper.box.min.z
	}

	//console.log(this.bbHelper, d , pos);
	thatControl.camLookAt.set(pos.x, pos.y , pos.z );
	//thatControl.camera.position.set(pos.x , pos.y + d.y*1.8, pos.z + d.z);

};


DropSubMenu.prototype.closeSubElement = function(elem){
	this.dropSubDiv.style.display = 'none';
	//elem.style.borderTop = '1px solid grey';
	//elem.style.borderBottom = '1px solid grey';
	elem.className = "dropDownMenuSubBTN";
	this.focusObj = '';
	thisCore.scene.remove(this.bbHelper);
	this.bbHelper = "undefined";

}



DropSubMenu.prototype.delte = function(){




}
DropSubMenu.prototype.delteCB = function(){


};