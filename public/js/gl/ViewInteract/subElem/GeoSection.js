function GeoSection(){

	this.groundinteractMenu = document.createElement('div');
	this.groundinteractMenu.id = 'groundinteractMenu';
	this.groundinteractMenu.style.display = "none";
	


	this.groundinteractUL = document.createElement('ul');
	this.groundinteractMenu.appendChild(this.groundinteractUL);
	


	this.groundinteractDiv = document.createElement('div');
	this.groundinteractDiv.id = 'groundinteractDiv';
	this.groundinteractDiv.style.display = "none";


	this.createAddProposal();
	this.createAddCityObj();
	this.createGeoGeoPosition();
	


	this.groundinteractDiv.appendChild(this.addgeoposBody);
	this.groundinteractDiv.appendChild(this.addProposalBody);	
	this.groundinteractDiv.appendChild(this.addCityobjBody);


}

GeoSection.prototype.groundinteractHandler = function(e){
	var elems =  e.parentNode.children;
	for(var i = 0; i < elems.length;i++){
		elems[i].className = 'greenbtn';
	}

	if(e.id == "addProposal"){
		e.className = 'redbtn';
		this.openSubElem('addProposal');

	}else if(e.id == "addCityObj"){
		e.className = 'redbtn';
		this.openSubElem('addCityObj');

	}else if(e.id == "addgeoPosition"){
		e.className = 'redbtn';
		this.openSubElem('addgeoPosition');

	}

	//this.groundinteractMenu.style.display = 'none';
}

GeoSection.prototype.openSubElem = function(elem){

	var elems = groundinteractDiv.children;
	for(var i = 0;i < elems.length;i++){
		elems[i].style.display = 'none';
	}


	this.groundinteractDiv.style.display = 'block';
	if(elem == 'addProposal'){

		this.addProposalBody.style.display = 'block';
	}else
	if(elem == 'addCityObj'){

		this.addCityobjBody.style.display = 'block';
		
	}else
	if(elem == 'addgeoPosition'){
		this.addgeoposBody.style.display = 'block';
	}


}



GeoSection.prototype.createAddProposal = function(){
	this.addProposalBody = document.createElement('div');
	this.addProposalBody.id = "addGeoElement";


	this.addProposalBody.innerHTML = '';
	this.addProposalText = document.createElement('textarea');
	this.addProposalText.value = transAP['insideText'];


	this.addProposalBody.innerHTML+= "<h2>"+transAP['AddProposal']+"</h2> <br>";
	
	this.addProposalBody.appendChild(this.addProposalText);

	this.addProposalBtn = document.createElement('input');
	this.addProposalBtn.setAttribute("type", "button");
	this.addProposalBtn.className = 'greenbtn';
	this.addProposalBtn.setAttribute("value", transAP['confirmBTN']);
	this.addProposalBtn.setAttribute("onclick", "thatGUI.groundSec.addProposalToDB()");
	this.addProposalBody.appendChild(this.addProposalBtn);
	this.groundinteractDiv.style.display = 'block';
}




GeoSection.prototype.createAddCityObj = function(){
	this.addCityobjBody = document.createElement('div');
	this.addCityobjBody.id = 'addGeoElement';



	this.uploadCityFile;
	this.uploadCityObj = {
		'object': '',
		'type' : ''
	}
	this.uploadCityObjTexture = new Array();
	this.uploadCityFileTexture = new Array();

	this.addCityobjBody.innerHTML = "<h2>"+transABO['AddBuilding']+"</h2>"
	this.addCityobjName = document.createElement('textarea');
	this.addCityobjName.value = transABO['insideText'];

	this.dropCityObjs = document.createElement('div');
	this.dropCityObjs.id = 'dropObjs';
	this.dropCityObjs.innerHTML = "<p>"+transABO['dropObjHere']+"</p>";

	this.droCityTextures = document.createElement('div');
	this.droCityTextures.id = 'dropCityTextures';
	this.droCityTextures.innerHTML = "<p>"+transABO['dropTextureHere']+"</p>";
	this.droCityTexturesSelect = document.createElement('select');
	this.droCityTextures.appendChild(this.droCityTexturesSelect);

	var filelist = [];  // Ein Array, das alle hochzuladenden Files enthält
	var totalSize = 0; // Enthält die Gesamtgröße aller hochzuladenden Dateien
	var totalProgress = 0; // Enthält den aktuellen Gesamtfortschritt
	var currentUpload = null; // Enthält die Datei, die aktuell hochgeladen wird
	this.dropCityObjs.addEventListener('drop', function (event){	
											
										    event.stopPropagation();
										    event.preventDefault();
										 	
										 	var reader = new FileReader();

										    // event.dataTransfer.files enthält eine Liste aller gedroppten Dateien

											var fileFormat = event.dataTransfer.files[0].name.split('.');
											fileFormat = fileFormat[fileFormat.length-1];
												
											if(fileFormat == 'dae' || fileFormat == 'json'){
												thatGUI.uploadCityFile = (event.dataTransfer.files[0]);
												thatGUI.groundSec.addCityobjName.value = event.dataTransfer.files[0].name.split('.')[0];
												thatGUI.groundSec.dropCityObjs.innerHTML = '<p>'+event.dataTransfer.files[0].name+'</p>';

												filelist.push(event.dataTransfer.files[0]);  // Hinzufügen der Datei zur Uploadqueue
												totalSize += event.dataTransfer.files[0].size;  // Hinzufügen der Dateigröße zur Gesamtgröße
												reader.readAsDataURL(event.dataTransfer.files[0]);		
											
											    reader.onload = function(e){
											   
											    	//resultArr = e.target.result.split('/');
											    	//resultArr = resultArr[0].split(':');
											    	var resultArr = filelist[filelist.length-1].name.split('.');
											    	thatGUI.groundSec.uploadCityObjProgressbar.setAttribute("value", (event.loaded / event.total * 100)); 
											    	if(resultArr[resultArr.length-1] == 'dae'){

											    		thatGUI.groundSec.uploadCityObj['object'] = e.target.result;
											    		thatGUI.groundSec.uploadCityObj['type'] = resultArr[resultArr.length-1];

											    	}else if(resultArr[resultArr.length-1] == 'json'){
				    									thatGUI.groundSec.uploadCityObj['object'] = e.target.result;
											    		thatGUI.groundSec.uploadCityObj['type'] = resultArr[resultArr.length-1];
											    	}
											    	//loadToScene.loadAddProposals(e.target.result, thatGUI.dropObjName.value, thatGUI.pickedProposal);
											    }

												reader.onprogress = function(event) {
												    if (event.lengthComputable) {
												    	thatGUI.groundSec.uploadCityObjProgressbar.setAttribute("value", (event.loaded / event.total * 100)); 
			
												    }
												};


											}									


										    

											
										//   console.log(thatGUI.proposalBuildObj);
										},false
									);
/*
	this.droCityTextures.addEventListener('drop', function (event){	
		console.log(event);
											event.stopPropagation();
										    event.preventDefault();
										 	for(var f = 0;f < event.dataTransfer.files.length;f++){

											 	var reader = new FileReader();
											 	var fileName = "";
											 	fileName = event.dataTransfer.files[f].name;
											    // event.dataTransfer.files enthält eine Liste aller gedroppten Dateien
										
												var fileFormat = event.dataTransfer.files[f].name.split('.');
												fileFormat = fileFormat[fileFormat.length-1];

												if(fileFormat == 'jpg' || fileFormat == 'png' || fileFormat == 'JPG' || fileFormat == 'PNG'){
													
										    		filelist.push(event.dataTransfer.files[f]);  // Hinzufügen der Datei zur Uploadqueue
													totalSize += event.dataTransfer.files[f].size;  // Hinzufügen der Dateigröße zur Gesamtgröße
													
													thatGUI.groundSec.uploadCityObjTexture.push(event.dataTransfer.files[f]);
										    		reader.readAsDataURL(event.dataTransfer.files[f]);
										 

										   			reader.onload = function(e){
												   		console.log(e)
												    	resultArr = e.target.result.split('/');
												    	resultArr = resultArr[0].split(':');

												    	if(resultArr[1] == 'image'){
												    		thatGUI.groundSec.uploadCityFileTexture.push(e.target.result);
												    		var img = document.createElement('option');
												    		img.style.backgroundImage = "url('"+e.target.result+"')";
												    		img.innerHTML = fileName;


												    		thatGUI.groundSec.droCityTexturesSelect.appendChild(img);
												    		
												    	}
												    	//loadToScene.loadAddProposals(e.target.result, thatGUI.dropObjName.value, thatGUI.pickedProposal);
												    }


										    	}



											    
											    thatGUI.groundSec.droCityTexturesSelect.size = thatGUI.groundSec.uploadCityObjTexture.length+1;
											   
											   

											}

		
											
										  // console.log(thatGUI.proposalBuildObj);




										},false
									);
	
	var removeSelectBtn = document.createElement('input');
	removeSelectBtn.setAttribute('value' , 'Enlever texture');
	removeSelectBtn.setAttribute('type', 'button');
	removeSelectBtn.setAttribute('onclick', "thatGUI.groundSec.dropRemoveCityTextureSelect()");	
*/

	this.dropLoadToSceneBtn = document.createElement('input');
	this.dropLoadToSceneBtn.setAttribute('value' , transABO['Load']);
	this.dropLoadToSceneBtn.setAttribute('type', 'button');
	this.dropLoadToSceneBtn.setAttribute('onclick', "thatGUI.groundSec.loadBuildToScene()");
	this.dropLoadToSceneBtn.className = 'greenbtn';

	this.uploadCityObjToDBBtn = document.createElement('input');
	this.uploadCityObjToDBBtn.setAttribute('value' , transABO['Save']);
	this.uploadCityObjToDBBtn.setAttribute('type', 'button');
	this.uploadCityObjToDBBtn.setAttribute('onclick', "thatGUI.groundSec.uploadCityObjtoDB()");
	this.uploadCityObjToDBBtn.style.display = "none";
	this.uploadCityObjToDBBtn.className = 'greenbtn';

	this.uploadCityObjProgressbar = document.createElement("PROGRESS");
	this.uploadCityObjProgressbar.setAttribute("value", 0); 
	this.uploadCityObjProgressbar.setAttribute("max", 100); 





	this.control = new AddedControl(this.cancelBuildToScene);




	this.addCityobjBody.appendChild(this.addCityobjName);
	this.addCityobjBody.appendChild(this.dropCityObjs);
	//this.addCityobjBody.appendChild(this.droCityTextures);
	//this.addCityobjBody.appendChild(removeSelectBtn);
	this.addCityobjBody.appendChild(this.dropLoadToSceneBtn);
	this.addCityobjBody.appendChild(this.uploadCityObjToDBBtn);
	this.addCityobjBody.appendChild(this.control.controlDiv);

	//this.addCityobjBody.appendChild(this.uploadCityObjProgressbar);
	
//	this.createAddProposalInfo();
}
GeoSection.prototype.loadBuildToScene = function(){
	//console.log(thatGUI.groundSec.uploadCityFileTexture, this.uploadCityObj['object']);
	if(thatGUI.objLoaded == false){

		if(this.uploadCityObj['object'] != '' && this.uploadCityObj['type'] != '' ){

			this.control.controlDiv.style.display = 'block';
			thatGUI.objLoaded = true;
			var type = 'cityOBJ';

			if(this.uploadCityObj['type'] == 'dae'){

				loadToScene.collada(this.uploadCityObj['object'], this.addCityobjName.value, thatGUI.geoClickPosMarker.position,type);
							
			}else if(this.uploadCityObj['type'] == 'json'){
				
				loadToScene.JSON(this.uploadCityObj['object'], this.addCityobjName.value, thatGUI.geoClickPosMarker.position, type);
				
			}

			this.groundinteractMenu.style.display = 'none';					
			this.uploadCityObjToDBBtn.style.display = 'block';		

		}else{

			alert("no Object found");

		}
	}
}
GeoSection.prototype.cancelBuildToScene = function(){

	thatGUI.groundSec.addCityobjName.value = transABO['insideText'];
	thatGUI.groundSec.dropCityObjs.innerHTML = "<p>"+transABO['dropObjHere']+"</p>";
	thatGUI.groundSec.uploadCityObjToDBBtn.style.display = "none";
	thatGUI.groundSec.control.controlDiv.style.display = 'none';

	thatGUI.proposalSec.removeAddedObject(objLoad.addProposalObj["obj"],objLoad.addProposalObj["bbox"]);
	thatGUI.groundSec.uploadCityObj = {
		'object': '',
		'type' : ''
	}
	thatGUI.groundSec.groundinteractDiv.style.display = 'none';
	thatGUI.objLoaded = false;

}

GeoSection.prototype.createGeoGeoPosition = function(){


	this.addgeoposBody = document.createElement('div');
	this.addgeoposBody.id = 'addGeoElement';

	this.addgeoposBody.innerHTML = '';
	this.addgeoposText = document.createElement('textarea');
	this.addgeoposText.value = transAGP['insideText'];
	this.addgeoposBody.innerHTML+= "<h2>"+transAGP['AddGeoPosition']+"</h2> <br>";
	//this.addProposalBody.innerHTML += "<p>ici<br><br></p>";
	//this.addgeoposBody.innerHTML += "<p>"+transAGP['GeoPositionName']+"</p>";
	
	this.addgeoposBody.appendChild(this.addgeoposText);

	this.addProposalBtn = document.createElement('input');
	this.addProposalBtn.className = 'greenbtn';
	this.addProposalBtn.setAttribute("type", "button");
	this.addProposalBtn.setAttribute("value", transAGP['AddGeoPositionBTN']);
	this.addProposalBtn.setAttribute("onclick", "thatGUI.groundSec.addGeoPosToDB()");
	this.addgeoposBody.appendChild(this.addProposalBtn);
	this.groundinteractDiv.style.display = 'block';

}
