function Raycaster(){
	thatRay = this;
	this.geoClickPosMarker;
	this.raycaster = new THREE.Raycaster();
	this.projector = new THREE.Projector();
	this.directionVector = new THREE.Vector3();
	this.mouseClick = {
		pos: new THREE.Vector2(), 
		userHasClicked : false,
		button: ""
	};
	this.bbHelper  = "undefined";
	this.interObjectsArray = new Array();
	
	this.pickedProposal = "";
	this.pickedGeoObject = "";

	this.directionVectorOnRun = new THREE.Vector3();
	this.raycasterOnRun = new THREE.Raycaster();


	this.mV = new THREE.Vector3();
}

Raycaster.prototype.addIntersectObjects = function(array){


	thatRay.interObjectsArray.push.apply(thatRay.interObjectsArray, array);

}
Raycaster.prototype.clearIntersectObjects= function(){
	thatRay.interObjectsArray = new Array();
}
Raycaster.prototype.addIntersectObject = function(obj){

	thatRay.interObjectsArray.push(obj);

}
Raycaster.prototype.onclickAction = function(event, flag, camera){


	//this.raycaster.setFromCamera(this.mouseClick.pos, camera);
    //var intersects = this.raycaster.intersectObjects(this.interObjectsArray);


    var intersects = thisCore.mouse.raycaster.intersectObjects(this.interObjectsArray);
	if(intersects.length > 0){
		group = intersects[0].object.name.split(":");

		if(
			group[0] == "Build" || 
			group[0] == "Proposal" || 
			group[0] == "GeoPosition" ||
			group[0] == "GeoGround"  ||
			group[0] == 'ProposalObj' ||
			group[0] == 'buildingsLow')
		{

			
			if( thatGUI._guiOpenName == '' ){

				this.showGUI(group[0], intersects[0], thisCore.mouse.button );
				

			}else 
			if( thatGUI._guiOpenName != '' ){
				if(thatGUI._guiOpenName == 'Proposal' && 
					thatGUI.proposalSec._openProposalhidenList == true){

					if(group[0] == "Build"){
						objLoad.hideListCheckedfromID(intersects[0].object.userData.id);
						thatGUI.proposalSec.appendToHidenList(intersects[0].object, 'Build');
					}else if(group[0] == 'buildingsLow'){

						for(var i = 0; i < thatground.buildings.length;i++){

			   				if( (thatground.buildings[i] instanceof geoObjectLoader) == true){
					    		thatground.buildings[i].hideBuildings(intersects[0], thisCore.mouse.button);
					    	}
					    	
				    	}

					}
					

			


				}else{
					if(thatGUI.objLoaded == false ){
						

				

							this.hideGUI([thatGUI._guiOpenName]);
							this.showGUI(group[0], intersects[0], thisCore.mouse.button );		
						
						
					}
				}



			}else
			{ 

				this.hideGUI([thatGUI._guiOpenName]);
			}	
		}
		

	}
	thisCore.mouse.userHasClicked = false;

	//console.log(thatGUI._guiOpenName);

	if(this.bbHelper !== "undefined"){
		this.bbHelper.update();
	}
}
Raycaster.prototype.showGUI = function(gui, obj, type){


	if(type == "left"){
		if(gui == "Build" ){

			this.cityObjPicked("on", obj.object);

		}else if(gui == "Proposal" ){

			this.proposalPick("on", obj.object);

		}else if(gui == "GeoPosition"){
			
			this.geoPositionPicked("on", obj.object);

		}else if(gui == 'ProposalObj'){
			
			this.proposalsObjPick('on', obj.object);
			
		}else if(gui == 'buildingsLow'){
					
				for(var i = 0; i < thatground.buildings.length;i++){

	   				if( (thatground.buildings[i] instanceof geoObjectLoader) == true){
			    		thatground.buildings[i].onclickAction(obj, type);
			    	}
			    	
		    	}
					
		}

	}

	if(type == "right"){

		if(gui == "GeoGround"){

			this.lineObjPick("on", obj);
		}
		
	}



	thatGUI._guiOpenName = gui;

}



Raycaster.prototype.hideGUI = function(o){

	for(var i = 0; i < o.length; i++){

		if(o[i] == "Build" ){

			this.cityObjPicked("off", {});

		}else if(o[i] == "Proposal" ){

			this.proposalPick("off", {});

		}else if(o[i] == "GeoPosition"){
			
			this.geoPositionPicked("off", {});

		}else if(o[i] == "GeoGround"){

			this.lineObjPick("off", {});

		}else if(o[i] == 'ProposalObj'){
			this.proposalsObjPick('off', {});
		}else if(o[i] == 'buildingsLow'){

			for(var i = 0; i < thatground.buildings.length;i++){

	   			if( (thatground.buildings[i] instanceof geoObjectLoader) == true){
			    		thatground.buildings[i].deselectObj();
			   	}
			   	
		    }

		}


	}

	thatGUI._guiOpenName = '';
}



Raycaster.prototype.cityObjPicked = function(s, obj){

		if(s == "on"){
			//thatGUI._guiIsOpen = 'Build';
			//var objGroup = thisCore.scene.getObjectByName(obj.name);

			var objPos = new THREE.Vector3(	obj.matrixWorld.elements[12],
											obj.matrixWorld.elements[13],
											obj.matrixWorld.elements[14]);


			var langlatPos = thisCore.scaleTerrainTocoord(objPos);
			var utmPos = thisCore.convert.toUtm({coord: [langlatPos.x, langlatPos.z] });
			thatTopMenuBar.displayInfoSection(langlatPos, utmPos, objPos.y);
	

			ajax.get('../cities/getBuildingscomments/'+obj.userData.id,
				{
					
				},
				function(e){ 
	
					thatGUI.commetnSec.pickedCommentType = "cityObject";
					thatGUI.loadComments(obj, JSON.parse(e));
					thatGUI.buildingSec.openBuildMenu(obj);
					
				}, true);
		
				if(thatRay.bbHelper == "undefined"){

					thatRay.bbHelper = new THREE.BoundingBoxHelper( obj, 0xffcc00 );
					thisCore.scene.add( thatRay.bbHelper );
				}


		}
		else if(s == "off"){

			if(this.bbHelper !== "undefined"){
				
				thisCore.scene.remove(this.bbHelper);
				this.bbHelper = "undefined";
				thatGUI.commetnSec.closeComments();
				thatGUI.clearInfo();
				thatGUI._guiOpenName = '';
				thatGUI.buildingSec.closeBuildMenu();
			}
		}
}

Raycaster.prototype.proposalPick = function(s ,obj){
	
	if(s == "on"){
		//thatGUI._guiIsOpen = 'Proposal';
		if(this.pickedProposal != ""){
			this.pickedProposal.material.color.set(propLoader.defColor);
		}
		this.pickedProposal = obj;
		this.pickedProposal.material.color.set(propLoader.pickedMaterialColor);


		var langlatPos = thisCore.scaleTerrainTocoord(obj.position);
		var utmPos = thisCore.convert.toUtm({coord: [langlatPos.x, langlatPos.z] });
		thatTopMenuBar.displayInfoSection(langlatPos, utmPos, (obj.position.y/10) );


		thatGUI.proposalSec.propoNameP.innerHTML = obj.name;


		ajax.get('../cities/getProposalObjectList/'+obj.userData.id,
					{},
					function(e){ 
						thatGUI.loadProposals(JSON.parse(e));
						thatGUI.proposalSec.proposalMenu.style.display = 'block';
						if(thatGUI.proposalSec.proposalsADD){
							thatGUI.proposalSec.proposalsADD.style.display = 'block';
						}
					}, 
					true
				);
		
	}
	if(s == "off"){
		if(thatGUI.objLoaded == false){
			if(this.pickedProposal != ""){
				this.pickedProposal.material.color.set(propLoader.defColor);
				this.pickedProposal = "";
			}
			thatGUI.proposalSec.closePorposals();
			thatGUI.commetnSec.closeComments();
			thatGUI.clearInfo();
			thatGUI._guiOpenName = '';
		}
	}

}
Raycaster.prototype.proposalsObjPick = function(s, obj){
	if(s == 'on'){
		if(thatRay.bbHelper == "undefined"){


					thatRay.bbHelper = new THREE.BoundingBoxHelper( obj.clone(), 0xffcc00 );
					thisCore.scene.add( thatRay.bbHelper );

		}

		var langlatPos = thisCore.scaleTerrainTocoord(obj.position);
		var utmPos = thisCore.convert.toUtm({coord: [langlatPos.x, langlatPos.z] });
		thatTopMenuBar.displayInfoSection(langlatPos, utmPos, (obj.position.y/10) );
		

		ajax.get('../cities/getProposalObjectList/'+obj.userData.parentID,
					{},
					function(e){ 
						thatGUI.proposalObjPick = true;
						thatGUI.loadProposals(JSON.parse(e));
						thatGUI.proposalSec.proposalsADD.style.display = 'none';
						thatGUI.proposalSec.proposalMenu.style.display = 'none';
					}, 
					true
				);

		thatGUI.proposalSec.loadProposalComments(obj);




	}else if(s == 'off'){
		
		if(this.bbHelper !== "undefined"){
			thisCore.scene.remove(this.bbHelper);
			this.bbHelper = "undefined";
			thatGUI.proposalSec.closePorposals();
			thatGUI.commetnSec.closeComments();
			thatGUI.clearInfo();
			thatGUI._guiOpenName = '';
			thatGUI.proposalObjPick = false;
		}

	}

}
Raycaster.prototype.geoPositionPicked = function(s, obj){
	if(s == "on"){
		//thatGUI._guiIsOpen = 'GeoPosition';
		if(this.pickedGeoObject != ""){
			this.pickedGeoObject.material.color.set(thatGeoComments.defColor);
		}
		this.pickedGeoObject = obj;
		this.pickedGeoObject.material.color.set(thatGeoComments.pickedMaterialColor);

	
		var langlatPos = thisCore.scaleTerrainTocoord(obj.position);
		var utmPos = thisCore.convert.toUtm({coord: [langlatPos.x, langlatPos.z] });
		thatTopMenuBar.displayInfoSection(langlatPos, utmPos, (obj.position.y/10) );



		ajax.get('../cities/getgeopositioncommetns/'+obj.userData.id,
					{},
					function(e){ 
					
						thatGUI.commetnSec.pickedCommentType = "geoPosObject";
						thatGUI.loadComments(obj, JSON.parse(e));
					}, 
					true
				);


	}
	else if(s == "off"){
		if(this.pickedGeoObject != ""){
			this.pickedGeoObject.material.color.set(thatGeoComments.defColor);
			this.pickedGeoObject = "";
		}
		
		thatGUI.proposalSec.closePorposals();
		thatGUI.commetnSec.closeComments();
		thatGUI.clearInfo();
		thatGUI._guiOpenName = '';
	}

}



Raycaster.prototype.lineObjPick = function(s ,obj){
		
	if(s == "on"){
		//thatGUI._guiIsOpen = 'GeoGround';
	
		var langlatPos = thisCore.scaleTerrainTocoord(obj.point);
		var utmPos = thisCore.convert.toUtm({coord: [langlatPos.x, langlatPos.z] });
		thatTopMenuBar.displayInfoSection(langlatPos, utmPos, (obj.point.y/10) );

		thatGUI.setGroundInteractToScene(obj);

		console.log(obj.point);

	}
	if(s == "off"){
		if(thatGUI.objLoaded == false){
			thatGUI.hideGroundInteract();
			thatGUI.clearInfo();
			thatGUI._guiOpenName = '';
		}

	}
}
Raycaster.prototype.proposalHoverHandle = function(event){

	var intersectsPropo = thisCore.mouse.raycaster.intersectObjects(propLoader.propArray);
	if(intersectsPropo.length > 0){
		var obj = intersectsPropo[0].object;
		propLoader.renderHightlightProposal(obj);
	}else{
		propLoader.renderHightlightProposal("");
	}
	

};

Raycaster.prototype.geoPositionHoverHandle = function(event){

	var intersectsGeoPos = thisCore.mouse.raycaster.intersectObjects(thatGeoComments.geoCommentArray);
	if(intersectsGeoPos.length > 0){
		var obj = intersectsGeoPos[0].object;
		thatGeoComments.renderHightlightGeoPosition(obj);
	}else{
		thatGeoComments.renderHightlightGeoPosition("");
	}

};


/**
	OLD ONES

**/
Raycaster.prototype.proposalHoverHandle2 = function(event){
		var mVProposal = new THREE.Vector3();
		mVProposal.set(	( event.clientX / window.innerWidth ) * 2 - 1,
						-( event.clientY / window.innerHeight ) * 2 + 1,
						0.5
			);


		var raycasterProp = new THREE.Raycaster();
		var projector = new THREE.Projector();
		var directionVector = new THREE.Vector3();

		/*directionVector.set(this.mV.x, this.mV.y, 1);
		projector.unprojectVector(directionVector, thatControl.camera);
		
		// Substract the vector representing the camera position
		directionVector.sub(thatControl.camera.position);

		    // Normalize the vector, to avoid large numbers from the
		    // projection and substraction
		    directionVector.normalize();
		     
		    // Now our direction vector holds the right numbers!
		    raycaster.set(thatControl.camera.position, directionVector);
		    
		    var intersects = raycaster.intersectObjects(propLoader.propArray);
		*/
		//raycasterProp.setFromCamera(mVProposal, thatControl.camera);
	   // var intersectsPropo = raycasterProp.intersectObjects(propLoader.propArray);

		if(intersectsPropo.length > 0){
			var obj = intersectsPropo[0].object;
			propLoader.renderHightlightProposal(obj);
		}else{
			propLoader.renderHightlightProposal("");
		}
		
	
}
Raycaster.prototype.geoPositionHoverHandle2 = function(event){
		var mVGeoPos = new THREE.Vector3();
		mVGeoPos.set(	( event.clientX / window.innerWidth ) * 2 - 1,
						0.5,
						-( event.clientY / window.innerHeight ) * 2 + 1
			);


		var raycasterGeoPos = new THREE.Raycaster();
		var projector = new THREE.Projector();
		var directionVector = new THREE.Vector3();

/*
		directionVector.set(this.mV.x, this.mV.y, 1);
		projector.unprojectVector(directionVector, thatControl.camera);
		
		// Substract the vector representing the camera position
		directionVector.sub(thatControl.camera.position);

		// Normalize the vector, to avoid large numbers from the
		// projection and substraction
		directionVector.normalize();

		// Now our direction vector holds the right numbers!
		raycaster.set(thatControl.camera.position, directionVector);


		var intersects = raycaster.intersectObjects(thatGeoComments.geoCommentArray);
*/
		raycasterGeoPos.setFromCamera(mVGeoPos, thatControl.camera);
	    var intersectsGeoPos = raycasterGeoPos.intersectObjects(thatGeoComments.geoCommentArray);	

		if(intersectsGeoPos.length > 0){

			var obj = intersectsGeoPos[0].object;
			thatGeoComments.renderHightlightGeoPosition(obj);
		}else{
			thatGeoComments.renderHightlightGeoPosition("");
		}


}


