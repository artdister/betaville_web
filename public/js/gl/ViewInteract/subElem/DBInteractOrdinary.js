/***************************************************************************************************
*
*	Section For Comments  *************************************************************************
*
***************************************************************************************************/
CommentSection.prototype.addCommentTODB = function(e){

	if(this.pickedCommentType == "cityObject"){

		var obj = {buildID:thatGUI.pickerBuildID , author:loadingData['user'].name, msg:this.userCommentIN.value}; 
		var fd = new FormData();
		fd.append('cityID', loadingData['city'].id);
		fd.append('buildID', obj.buildID);
		fd.append('authorName', obj.author);
		fd.append('message',  obj.msg);
		//console.log(fd);

		ajax.send('../cities/addBuildingscomment', 
				function(e){
					thatGUI.commetnSec.addCommentToDiv(obj);
					thatGUI.commetnSec.userCommentIN.value = '';
				},
				'dataUpload',
				fd
				
		);	

	}
	if(this.pickedCommentType == "proposalObject"){

		var obj = {buildID:thatGUI.pickerBuildID , author:loadingData['user'].name, msg:this.userCommentIN.value}; 
		var fd = new FormData();
		fd.append('parentID', obj.buildID);
		fd.append('authorName', obj.author);
		fd.append('msg',  obj.msg);

		ajax.send('../cities/addProposalObjectcomment', 
				function(e){
					thatGUI.commetnSec.addCommentToDiv(obj);
					thatGUI.commetnSec.userCommentIN.value = '';
				},
				'dataUpload',
				fd
				
		);	

	}
	if(this.pickedCommentType == "geoPosObject"){
		var obj = {buildID:thatGUI.pickerBuildID , author:loadingData['user'].name, msg:this.userCommentIN.value}; 
		var fd = new FormData();
		fd.append('parentID', obj.buildID);
		fd.append('authorName', obj.author);
		fd.append('msg',  obj.msg);

		ajax.send('../cities/addgeopositioncomment', 
				function(e){
					thatGUI.commetnSec.addCommentToDiv(obj);
					thatGUI.commetnSec.userCommentIN.value = '';
				},
				'dataUpload',
				fd
				
		);	



	}

}

/***************************************************************************************************
*
*	Section For Proposals  *************************************************************************
*
***************************************************************************************************/
ProposalSection.prototype.createAddProposalObj = function(){
	this.proposalBuildObj = {
		name:"",
		preViewImg: "",
		object: "",
		texture: []
	};
	this.proposalBuildFile = {
		preViewImg: "",
		object: "",
		type : "",
		texture: []		
	};

	var propoNameDiv = document.createElement('div');
	propoNameDiv.id = 'proposalNameDiv';
	propoNameDiv.appendChild(this.propoNameP);
		


	this.dropObjName = document.createElement('input');
	this.dropObjName.type = 'text';
	this.dropObjName.value = transPS['modelnametext'];


	this.dropPreViewImgDiv = document.createElement('div');
	this.dropPreViewImgDiv.id = 'dropPreViewImg';
	this.dropPreViewImgDiv.innerHTML = "<p>"+transPS['dropImg']+"</p>";
	this.dropPreViewImg = document.createElement('img');
	

	this.dropboxDiv = document.createElement('div');
	this.dropboxDiv.id = 'dropboxDiv';
	

	this.dropObjs = document.createElement('div');
	this.dropObjs.id = 'dropObjs';
	this.dropObjs.innerHTML = "<p>"+transPS['dropObj']+"</p>";
	this.dropboxDiv.appendChild(this.dropObjs);

/*
	this.dropTextures = document.createElement('div');
	this.dropTextures.id = 'dropTextures';
	this.dropTextures.innerHTML = "<p>Déposer .dae ici</p>";
	this.dropTextureSelect = document.createElement('select');
	this.dropTextures.appendChild(this.dropTextureSelect);
	this.dropboxDiv.appendChild(this.dropTextures);
*/

	var filelist = [];  // Ein Array, das alle hochzuladenden Files enthält
	var totalSize = 0; // Enthält die Gesamtgröße aller hochzuladenden Dateien
	var totalProgress = 0; // Enthält den aktuellen Gesamtfortschritt

	
	this.dropPreViewImgDiv.addEventListener('drop', function (event){	

											event.stopPropagation();
										    event.preventDefault();
										 	var data = event.dataTransfer.files[0].type.split('/');

											
											if(data[0] == 'image'){
												var reader = new FileReader();
												thatGUI.proposalSec.proposalBuildObj.preViewImg = event.dataTransfer.files[0];
												totalSize += event.dataTransfer.files[0].size;
												reader.readAsDataURL(event.dataTransfer.files[0]);
											
												reader.onload = function (e) {
													thatGUI.proposalSec.dropPreViewImgDiv.innerHTML = "";
													thatGUI.proposalSec.dropPreViewImg.setAttribute('src', e.target.result);
													thatGUI.proposalSec.dropPreViewImgDiv.appendChild(thatGUI.proposalSec.dropPreViewImg);
													thatGUI.proposalSec.proposalBuildFile.preViewImg = e.target.result;
													
												}
												reader.onprogress = function(e){
												}
											}


											//console.log(thatGUI.proposalBuildObj);

											}, false
										)



	this.dropObjs.addEventListener('drop', function (event){	
					
								    event.stopPropagation();
								    event.preventDefault();
								 	var reader = new FileReader();

								    // event.dataTransfer.files enthält eine Liste aller gedroppten Dateien

									var fileFormat = event.dataTransfer.files[0].name.split('.');
									fileFormat = fileFormat[fileFormat.length-1];

									if(fileFormat == 'dae' || fileFormat == 'json' ){
										thatGUI.proposalSec.proposalBuildObj.object = (event.dataTransfer.files[0]);
										thatGUI.proposalSec.dropObjName.value = event.dataTransfer.files[0].name.split('.')[0];
										thatGUI.proposalSec.dropObjs.innerHTML = '<p>'+event.dataTransfer.files[0].name+'</p>';

										filelist.push(event.dataTransfer.files[0]);  // Hinzufügen der Datei zur Uploadqueue
										totalSize += event.dataTransfer.files[0].size;  // Hinzufügen der Dateigröße zur Gesamtgröße
										reader.readAsDataURL(event.dataTransfer.files[0]);		
									
							    		reader.onload = function(e){
									   
									    	//resultArr = e.target.result.split('/');
									    	//resultArr = resultArr[0].split(':');
									    	var resultArr = filelist[filelist.length-1].name.split('.');
									    	if(resultArr[resultArr.length-1] == 'dae'){

									    		thatGUI.proposalSec.proposalBuildFile.object = e.target.result;
									    		thatGUI.proposalSec.proposalBuildFile.type = resultArr[resultArr.length-1];

									    	}else if(resultArr[resultArr.length-1] == 'json'){
		    									thatGUI.proposalSec.proposalBuildFile.object = e.target.result;
									    		thatGUI.proposalSec.proposalBuildFile.type = resultArr[resultArr.length-1];
									    	}
									    	//loadToScene.loadAddProposals(e.target.result, thatGUI.dropObjName.value, thatGUI.pickedProposal);
									    }



									    reader.onprogress = function(e){
									    }


									}									




	
								    

									
								//   console.log(thatGUI.proposalBuildObj);
								},false
							);
/*
	this.dropTextures.addEventListener('drop', function (event){	
									event.stopPropagation();
								    event.preventDefault();
								 	var reader = new FileReader();
								 	var fileName = "";
								    // event.dataTransfer.files enthält eine Liste aller gedroppten Dateien
							
									var fileFormat = event.dataTransfer.files[0].name.split('.');
									fileFormat = fileFormat[fileFormat.length-1];

									if(fileFormat == 'jpg' || fileFormat == 'png' || fileFormat == 'JPG' || fileFormat == 'PNG'){
										fileName = event.dataTransfer.files[0].name;
							    		filelist.push(event.dataTransfer.files[0]);  // Hinzufügen der Datei zur Uploadqueue
										totalSize += event.dataTransfer.files[0].size;  // Hinzufügen der Dateigröße zur Gesamtgröße
										
										thatGUI.proposalBuildObj.texture.push(event.dataTransfer.files[0]);
							    		reader.readAsDataURL(event.dataTransfer.files[0]);
							    	

							   			reader.onload = function(e){
									   
									    	resultArr = e.target.result.split('/');
									    	resultArr = resultArr[0].split(':');

									    	if(resultArr[1] == 'image'){
									    		thatGUI.proposalBuildFile.texture.push(e.target.result);
									    		var img = document.createElement('option');
									    		img.style.backgroundImage = "url('"+e.target.result+"')";
									    		img.innerHTML = fileName;


									    		thatGUI.dropTextureSelect.appendChild(img);
									    		
									    	}
									    	//loadToScene.loadAddProposals(e.target.result, thatGUI.dropObjName.value, thatGUI.pickedProposal);
									    }
									    reader.onprogress = function(e){
									    }


							    	}



								    
								    thatGUI.dropTextureSelect.size = thatGUI.proposalBuildObj.texture.length+1;
								   	




									
								  // console.log(thatGUI.proposalBuildObj);




								},false
							);


	var removeSelectBtn = document.createElement('input');
	removeSelectBtn.setAttribute('value' , 'Enlever texture');
	removeSelectBtn.setAttribute('type', 'button');
	removeSelectBtn.setAttribute('onclick', "thatGUI.dropRemoveSelect()");	
	this.dropTextures.appendChild(removeSelectBtn);
*/


	this.dropLoadToSceneBtn = document.createElement('input');
	this.dropLoadToSceneBtn.setAttribute('value' , transPS['Load']);
	this.dropLoadToSceneBtn.setAttribute('type', 'button');
	this.dropLoadToSceneBtn.setAttribute('onclick', "thatGUI.proposalSec.loadProposalObjectToscene()");
	this.dropLoadToSceneBtn.className = 'greenbtn';

	this.uploadToDBBtn = document.createElement('input');
	this.uploadToDBBtn.setAttribute('value' , transPS['Save']);
	this.uploadToDBBtn.setAttribute('type', 'button');
	this.uploadToDBBtn.setAttribute('onclick', "thatGUI.proposalSec.uploadAddProposal()");
	this.uploadToDBBtn.style.display = "none";
	this.uploadToDBBtn.className = 'greenbtn';


	this.control = new AddedControl(this.cancelBuildToScene);


	this.proposalsADD.appendChild(this.propoNameP);
	this.proposalsADD.appendChild(this.dropObjName);
	this.proposalsADD.appendChild(this.dropPreViewImgDiv);
	this.proposalsADD.appendChild(this.dropboxDiv);

	var addProposalBtnDiv = document.createElement('div');
	addProposalBtnDiv.id = 'addProposalBtnDiv';

	this.proposalsADD.appendChild(this.dropLoadToSceneBtn);
	this.proposalsADD.appendChild(this.uploadToDBBtn);
	//this.proposalsADD.appendChild(addProposalBtnDiv);

	this.proposalsADD.appendChild(this.control.controlDiv);




}	

ProposalSection.prototype.dropRemoveSelect = function(){
	if( thatGUI.dropTextureSelect.options[thatGUI.dropTextureSelect.selectedIndex]){
		thatGUI.dropTextureSelect.remove(thatGUI.dropTextureSelect.selectedIndex);
		thatGUI.proposalBuildObj.texture.splice(thatGUI.dropTextureSelect.selectedIndex-1, 1);
		thatGUI.proposalBuildFile.texture.splice(thatGUI.dropTextureSelect.selectedIndex-1, 1);

	}
}

ProposalSection.prototype.loadProposalObjectToscene = function(){

	if(thatGUI.objLoaded == false){

		if(this.proposalBuildFile.object != ""){
			if(this.proposalBuildFile.preViewImg != ""){

				this.control.controlDiv.style.display = 'block';
				thatGUI.objLoaded = true;
				var type = 'proposalObject';


				if(this.proposalBuildFile.type == 'dae'){

					loadToScene.collada(this.proposalBuildFile.object, this.dropObjName.value, thatRay.pickedProposal.position, type);
								
				}else if(this.proposalBuildFile.type == 'json'){
				
					loadToScene.JSON(this.proposalBuildFile.object, this.dropObjName.value, thatRay.pickedProposal.position, type);
					
				}


				//loadToScene.collada(thatGUI.proposalBuildFile.object, thatGUI.dropObjName.value, thatGUI.pickedProposal.position);
				

				this.proposalList.style.display = "none";
				this.uploadToDBBtn.style.display = "block";

			}else{

				alert('missing the pre view image');

			}
		}else{

			alert('missing the Object (collada or json)');

		}
	}										  
} 
ProposalSection.prototype.cancelBuildToScene = function(){

	thatGUI.proposalSec.dropPreViewImgDiv.innerHTML = "<p>"+transPS['dropImg']+"</p>";
	thatGUI.proposalSec.dropObjs.innerHTML = "<p>"+transPS['dropObj']+"</p>";
	thatGUI.proposalSec.uploadToDBBtn.style.display = "none";
	thatGUI.proposalSec.control.controlDiv.style.display = 'none';

	thatGUI.proposalSec.removeAddedObject(objLoad.addProposalObj["obj"],objLoad.addProposalObj["bbox"]);

	for(var i = 0; i < objLoad.hiddenObjList.length ;i++){
		objLoad.showObjs([objLoad.hiddenObjList[i]]);
		
	}

	for(var i = 0; i < thatground.buildings.length;i++){

		if( (thatground.buildings[i] instanceof geoObjectLoader) == true){
				for(var j = 0; j <= thatground.buildings[i].hideList.length;j++){
					
					thatground.buildings[i].showBuilding(thatground.buildings[i].hideList[j]);
				}
				thatground.buildings[i].hideList = new Array();
    		
    	}
			    	
	}

	if(thatGUI.proposalSec.hideListUL.children >= 1){
		for(var i = 0; i <= thatGUI.proposalSec.hideListUL.children.length;i++){
			thatGUI.proposalSec.hideListUL.children[i].parentNode.removeChild(thatGUI.proposalSec.hideListUL.children[i]);
		}
	}	



	thatGUI.proposalSec._openProposalhidenList = false;
	thatGUI.proposalSec.hListDiv.style.display = 'none';
	thatGUI.proposalSec.hidenMenuBTN.className = 'greenbtn';

	objLoad.hiddenObjList = new Array();



	thatGUI.proposalSec.proposalBuildObj = {
		name:"",
		preViewImg: "",
		object: "",
		texture: []
	};
	thatGUI.proposalSec.proposalBuildFile = {
		preViewImg: "",
		object: "",
		type : "",
		texture: []		
	};


	thatGUI.proposalSec.proposalList.style.display = "block";
	thatGUI.objLoaded = false;



}

ProposalSection.prototype.uploadAddProposal = function(){



	if(this.dropObjName.value != "" && this.proposalBuildObj.preViewImg != "" && this.proposalBuildObj.object != ""){


		

		var posDB = thisCore.scaleTerrainTocoord(objLoad.addProposalObj["obj"].position);
		//var bboxposDB = thisCore.scaleTerrainTocoord(loadToScene.addProposalObj["bboxObj"].position);


		var outobj = objLoad.addProposalObj["obj"];
		var zip = new JSZip();
		zip.file(this.dropObjName.value+".json", JSON.stringify(loadToScene.addProposalObjSRC));
		var content = zip.generate({type:"blob", compression:"DEFLATE"});
		
		var hblow = new Array();

		for(var i = 0; i < thatground.buildings.length;i++){

	   				if( (thatground.buildings[i] instanceof geoObjectLoader) == true){
			    		hblow.push(thatground.buildings[i].hideList);
			    	}
			    	
		}


		var fd = new FormData();
		fd.append('citySTR', loadingData['city'].name);
		fd.append('name', this.dropObjName.value);
		fd.append('parentID', thatRay.pickedProposal.userData.id);
		fd.append('author', loadingData['user'].name);
		fd.append('fileOBJ', content);
		fd.append('fileIMG', this.proposalBuildObj.preViewImg);

		for(var i = 0;i <  this.proposalBuildObj.texture.length; i++){
			fd.append('fileTex:'+i, this.proposalBuildObj.texture[i]);
		}
		fd.append('lat', round(posDB.z,6));
		fd.append('lng', round(posDB.x,6));
		fd.append('atli', round(thisCore.control.object.position.y, 3));
		fd.append('scale', round(thisCore.control.object.scale.x , 3));
		fd.append('rotatY', round(thisCore.control.object.rotation.y , 3));
		fd.append('rotatX', round(thisCore.control.object.rotation.x, 3));
		fd.append('rotatZ', round(thisCore.control.object.rotation.z, 3));
		fd.append('quaternionW', round(thisCore.control.object.quaternion.w, 6));
		fd.append('quaternionX', round(thisCore.control.object.quaternion.x, 6));
		fd.append('quaternionY', round(thisCore.control.object.quaternion.y, 6));
		fd.append('quaternionZ', round(thisCore.control.object.quaternion.z, 6));
		fd.append('hiddenbuildings', objLoad.hiddenObjList);
		fd.append('hiddenbuildingsLow', hblow);


	ajax.send('../cities/uploadProposalObj', 
			function(e){
			//	thatGUI.proposalSec.proposalsADD.style.display = "none";
				thatGUI.proposalSec.ProposalsBody.style.display = "none";


				thatGUI.proposalSec.removeAddedObject(objLoad.addProposalObj["obj"],objLoad.addProposalObj['bbox']);
				thisCore.control.detach();
				thatGUI.proposalSec.cancelBuildToScene();

				thatGUI.proposalSec.hideListUL.innerHTML = "";
				
				thatGUI._guiOpenName = "";
				thatGUI.objLoaded = false;

				alert(transPS['uploadsuccess']);


			},
			'dataUpload',
			fd
			
	);	
	
		
	}else{
		alert(transPS['missedImgORobj']);
	}
}

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

	this.groundinteractAddGeoComment = document.createElement('li');
	this.groundinteractAddGeoComment.innerHTML = transGM['addGeoPos'];
	this.groundinteractAddGeoComment.setAttribute('id', 'addgeoPosition');
	this.groundinteractAddGeoComment.setAttribute('onclick', "thatGUI.groundSec.groundinteractHandler(this);");


	this.groundinteractUL.appendChild(this.groundinteractAddGeoComment);
	this.groundinteractUL.appendChild(this.groundinteractAddProposal);
	

}

GeoSection.prototype.addProposalToDB = function(){
	var pname = this.addProposalText.value;
	var coords = thisCore.scaleTerrainTocoord(thatGUI.geoClickPosMarker.position);
	
	var fd = new FormData();
	fd.append('parentId', loadingData['city'].id);
	fd.append('name', 'Proposal:'+pname);
	fd.append('author', loadingData['user'].name );
	fd.append('lng', round(coords.x,6) );
	fd.append('lat', round(coords.z,6) );
	fd.append('atli', round((coords.y*10)+1500,3) );

	if(pname != ''){

	ajax.send('../cities/addProposal', 
			function(e){

				ajax.get('../cities/getProposals/'+loadingData['city'].id,
							{},
							function(e){
									
									var proposalList = JSON.parse(e);
									if(loadingData['models']['proposals']){
										var toLoad = (proposalList.length - loadingData['models']['proposals'].length);
									}else{
										var toLoad = (proposalList.length);
									}
									for(i = 1; i <= toLoad ; i++){
								
										propLoader.load(proposalList[proposalList.length-i],addPropoosalToScene);
										
										thatGUI.hideGroundInteract();
										loadingData['models']['proposals'].push(proposalList[proposalList.length-i]);
									}
							}
					);

				alert(transPS['uploadsuccess']);
			},
			'dataUpload',
			fd	
	);	

	}

}


GeoSection.prototype.addGeoPosToDB = function(){

	var pname = this.addgeoposText.value;
	var coords = thisCore.scaleTerrainTocoord(thatGUI.geoClickPosMarker.position);

	var fd = new FormData();	
	fd.append('parentId', loadingData['city'].id);
	fd.append('name', 'GeoPosition:'+pname);
	fd.append('author', loadingData['user'].name );
	fd.append('lng', round(coords.x,6) );
	fd.append('lat', round(coords.z,6) );
	fd.append('atli', round((coords.y*10)+1000,3) );

	if(pname != ''){

		ajax.send('../cities/addgeoPosition', 
				function(e){

					ajax.get('../cities/getgeppositions/'+loadingData['city'].id,
								{},
								function(e){

										var geoList = JSON.parse(e);
										if(loadingData['models']['proposals']){
											var toLoad = (geoList.length - loadingData['models']['geopositions'].length);
										}else{
											var toLoad = (geoList.length);
										}
										for(i = 1; i <= toLoad ; i++){
									
											thatGeoComments.addGeoCommentToScene(geoList[geoList.length-i]);
											
											thatRay.addIntersectObject(thatGeoComments.geoCommentArray[thatGeoComments.geoCommentArray.length-i]);
											thisCore.scene.add(thatGeoComments.geoCommentArray[thatGeoComments.geoCommentArray.length-i]);
											thatGUI.hideGroundInteract();
											loadingData['models']['geopositions'].push(geoList[geoList.length-i]);
		
										}
								}
						);

					alert(transAGP['uploadsuccess']);
				},
				'dataUpload',
				fd	
		);	
	}

}





