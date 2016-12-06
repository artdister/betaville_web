<script>
function GUI(){

	this.proposalObjPick = false;
	this.objLoaded = false;
	this._guiOpenName = '';
	this.guiDiv = document.createElement("div");
	this.guiDiv.id = "guiDiv"
	document.body.appendChild(this.guiDiv);
	thatGUI = this;
		
	new TopMenuBar();
	
	if(loadingData['user'].role != undefined){
		if(loadingData['user'].role == 0){
			this.loadOrdinaryGUI();
		}else
		if(loadingData['user'].role == 1){
			this.loadModeratorGUI();
		}else
		if(loadingData['user'].role == 2){
			this.loadModeratorGUI();
		}
	}else{
		this.loadGuestGUI();
	}
	thisCore.control.addEventListener( 'change', this.updateInfo );
	/*
	console.log(<?php Auth::check()?>);
	<?php if(Auth::check()){ 
		if(Auth::user()->role == 0){ ?>
			this.loadOrdinaryGUI();
	<?php }else
		if(Auth::user()->role == 1){ ?>
			this.loadModeratorGUI();
	<?php }
	}else{ ?>
		this.loadGuestGUI();
	<?php } ?>
*/
}
GUI.prototype.loadGuestGUI = function(){
	console.log("guest");
	this.commetnSec = new CommentSection();
	this.proposalSec = new ProposalSection();
	this.groundSec = new GeoSection();
	this.buildingSec = new BuildingSection();


	this.guiDiv.appendChild(this.commetnSec.CommentsBody);
	this.guiDiv.appendChild(this.proposalSec.ProposalsBody);
	this.guiDiv.appendChild(this.groundSec.groundinteractMenu);
}

GUI.prototype.loadOrdinaryGUI = function(){
	console.log("ordinary");
	this.commetnSec = new CommentSection();
	this.proposalSec = new ProposalSection();
	this.groundSec = new GeoSection();
	this.buildingSec = new BuildingSection();
	this.groundSec.addGeoMenu();

	this.guiDiv.appendChild(this.buildingSec.bsMenu);
	this.guiDiv.appendChild(this.commetnSec.CommentsBody);
	this.guiDiv.appendChild(this.proposalSec.ProposalsBody);
	this.guiDiv.appendChild(this.groundSec.groundinteractMenu);
	this.guiDiv.appendChild(this.groundSec.groundinteractDiv);
}

GUI.prototype.loadModeratorGUI = function(){
	console.log("moderator");
	this.commetnSec = new CommentSection();
	this.proposalSec = new ProposalSection();
	this.groundSec = new GeoSection();
	this.buildingSec = new BuildingSection();
	this.groundSec.addGeoMenu();

	this.guiDiv.appendChild(this.buildingSec.bsMenu);
	this.guiDiv.appendChild(this.commetnSec.CommentsBody);
	this.guiDiv.appendChild(this.proposalSec.ProposalsBody);
	this.guiDiv.appendChild(this.groundSec.groundinteractMenu);
	this.guiDiv.appendChild(this.groundSec.groundinteractDiv);
}





GUI.prototype.loadComments = function(parentObjName,list){

						thatGUI.pickerBuildID = parentObjName.userData.id;
						thatGUI.commetnSec.commentsDiv.innerHTML = "";
						
						this.commetnSec.objectNameHTML.innerHTML = parentObjName.name;
						list.forEach(function(obj){
							
							var id = parentObjName.userData.id
							if( id == obj.building_id || 
								id ==  obj.geo_position_id || 
								id == obj.proposal_object_id){
								
								thatGUI.commetnSec.addCommentToDiv(obj);
								
							}
						})
					thatGUI.commetnSec.updateMeta(parentObjName);
					thatGUI.commetnSec.CommentsBody.style.display = "block";
}

GUI.prototype.loadProposals = function(json){
	this.proposalSec.clearProposals();
	this.openProposalList = json;

	json.forEach(function(obj){
	
		thatGUI.proposalSec.addProposalObject(obj);

	});

	this.proposalSec.ProposalsBody.style.display = 'block';
	if(typeof this.proposalSec.proposalsADD == 'object'){
		this.proposalSec.proposalsADD.style.display = 'block';
		//this.proposalSec.hListDiv.style.display = 'block';
	}
	
}
GUI.prototype.handleControlCheck = function(e){


	for(var i = 0; i < e.parentNode.children.length;i++){
		var li = e.parentNode.children[i];

		if(li.getAttribute('value') ==  e.getAttribute('value') ){

			li.className = 'greenbtn';

		}else{

			li.className = '';
		}

	}
	

	if(e.getAttribute('value') == "Transform"){

		thisCore.control.setMode( "translate" );

	}else if(e.getAttribute('value') == "Rotate"){

		thisCore.control.setMode( "rotate" );

	}else if(e.getAttribute('value') == "Scale"){

		thisCore.control.setMode( "scale" );

	}
}

GUI.prototype.setGroundInteractToScene = function( obj){

		if(thisCore.scene.getObjectByName('geoClickPosMarker')){
			var objToremove = thisCore.scene.getObjectByName('geoClickPosMarker');
			objToremove.geometry.dispose();
			objToremove.material.dispose();
			thisCore.scene.remove(objToremove);
		}

		var elems =  this.groundSec.groundinteractMenu.children[0].children;
		for(var i = 0; i < elems.length;i++){
			elems[i].className = 'greenbtn';
		}

//console.log(this.groundSec.groundinteractMenu.children[0].children);

		this.groundSec.groundinteractMenu.style.display = 'block';

		//this.displayInfoSection();
		
		var langlatPos = thisCore.scaleTerrainTocoord(obj.point);
		var utmPos = thisCore.convert.toUtm({coord: [langlatPos.x, langlatPos.z] });

		var geometry = new THREE.CylinderGeometry( 20, 0, 480, 4 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00CC00} );
		this.geoClickPosMarker = new THREE.Mesh( geometry, material );

		this.geoClickPosMarker.name = "geoClickPosMarker";
		this.geoClickPosMarker.position.x = obj.point.x;
		this.geoClickPosMarker.position.y = obj.point.y+240;
		this.geoClickPosMarker.position.z = obj.point.z;
		
		thisCore.scene.add(this.geoClickPosMarker);

	
}

GUI.prototype.hideGroundInteract = function(){
	if(thisCore.scene.getObjectByName('geoClickPosMarker')){
		var objToremove = thisCore.scene.getObjectByName('geoClickPosMarker');
		objToremove.geometry.dispose();
		objToremove.material.dispose();
		thisCore.scene.remove(objToremove);
	}
	if(this.proposalSec){
		
		this.proposalSec.removeAddedObject(objLoad.addProposalObj["obj"],objLoad.addProposalObj["bbox"]);
	}
	
	if(this.groundSec){

		this.groundSec.groundinteractMenu.style.display = 'none';
		this.groundSec.groundinteractDiv.style.display = 'none';	

	}

	
}


GUI.prototype.updateInfo = function(obj){

	if(objLoad.addProposalObj["bbox"]){
		objLoad.addProposalObj["bbox"].update();
	}
	
	thatGUI.proposalSec.control.updateInfo();
	thatGUI.groundSec.control.updateInfo();
	thatGUI.buildingSec.render();

}

GUI.prototype.clearInfo = function(){
	thatTopMenuBar.clearInfoSection();
}
</script>

