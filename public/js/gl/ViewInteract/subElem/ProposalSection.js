function ProposalSection(){
	
	this._openProposalhidenList = false;
	this.ProposalsBody  = document.createElement('div');
	this.ProposalsBody.id = 'Proposals-Body';


	this.proposalList = document.createElement('div');
	this.proposalList.id = 'Proposals-List';

	this.proposalsArray = [];

	this.propoNameP = document.createElement('h2');

	this.objHoldingul = document.createElement('ul');
	this.proposalList.appendChild(this.objHoldingul);

	this.ProposalsBody.appendChild(this.proposalList);

	
	if(typeof this.createAddProposalObj == 'function'){
		this.proposalsADD  = document.createElement('div');
		this.proposalsADD.id = 'ProposalsADDObj-Body';
		this.ProposalsBody.appendChild(this.proposalsADD);
		this.createAddProposalObj();

	}

	this.createProposalMenu();
	this.objLoaded = false;
}

ProposalSection.prototype.clearProposals = function(){
	this.proposalsArray = [];
	this.objHoldingul.innerHTML = "";
	//this.removeAddedObject(thisCore.control.object);
}



ProposalSection.prototype.addProposalObject = function(obj){



		var objholdingli = document.createElement('li');
		objholdingli.id = this.proposalsArray.length;

		this.proposalsArray.push(obj);

		var preViewNameDiv = document.createElement('div');
		preViewNameDiv.id = "proposalInfo";
		var preViewInfo = document.createElement("p");
		preViewInfo.innerHTML = obj.name;
		preViewNameDiv.appendChild(preViewInfo);
		objholdingli.appendChild(preViewNameDiv);

		var preViewImg = document.createElement('img');
		preViewImg.src = '../../storage/app/'+obj.preViewImgURL;
		preViewImg.id = "proposalPreViewImg";
		objholdingli.appendChild(preViewImg);
/*
		

		var preViewAuthor = document.createElement("p");
		preViewAuthor.id = "proposalInfo";
		preViewAuthor.innerHTML = "by: "+obj.author;
		objholdingli.appendChild(preViewAuthor);		

*/
		

		this.setOriginProposal = document.createElement("input");
	    this.setOriginProposal.setAttribute("type", "button");
	    this.setOriginProposal.setAttribute('id', obj.id);


	    var open = false;
	    for(var i = 0; i < objLoad.proposalObj['obj'].length;i++){
	    	if(objLoad.proposalObj['obj'][i].userData.id == obj.id){
	    		open = true;
	    		break;
	    	}
	    }
	    if(open){
			this.setOriginProposal.setAttribute("value", transPS['remove']);
			this.setOriginProposal.className = 'redbtn';
			this.setOriginProposal.onclick = function(e){
				//load here the OBJECT for probosals
				thatGUI.proposalSec.removeProposalObject(this, obj);
			}
			  
	    }else{
		    this.setOriginProposal.setAttribute("value", transPS['show']);
		    this.setOriginProposal.className = 'greenbtn';
		  	this.setOriginProposal.onclick = function(e){

				thatGUI.proposalSec.addOnclickToProposals(e, obj);
			}
		}


	 	objholdingli.appendChild(this.setOriginProposal);


		this.objHoldingul.appendChild(objholdingli);


}
ProposalSection.prototype.createProposalMenu = function(){

	this.proposalMenu = document.createElement('div');
	this.proposalMenu.id = 'proposalMenu';

	this.createBuildList();



	this.ProposalsBody.appendChild(this.proposalMenu);
};
ProposalSection.prototype.proposalMenuHandler = function(e){

	if(e.value == 'hiddenObjs'){

		if(this.hListDiv.style.display == 'block'){
			this._openProposalhidenList = false;
			this.hListDiv.style.display = 'none';
			this.hidenMenuBTN.className = 'greenbtn';
		}else{
			this._openProposalhidenList = true;
			this.hListDiv.style.display = 'block';
			this.hidenMenuBTN.className = 'redbtn';
		}

	}

}

ProposalSection.prototype.createBuildList = function(){

	this.hidenMenuBTN = document.createElement('button');
	this.hidenMenuBTN.innerHTML = 'Hide Buildings';
	this.hidenMenuBTN.setAttribute('value', 'hiddenObjs');
	this.hidenMenuBTN.className = 'greenbtn';
	this.hidenMenuBTN.setAttribute('onclick', 'thatGUI.proposalSec.proposalMenuHandler(this)');

	this.hListDiv = document.createElement('div');
	this.hListDiv.id = 'hListDiv';


	this.hideLabel = document.createElement('label');
	this.hideLabel.innerHTML = transPS['hideObjs'];
	

	this.hListDiv.appendChild(this.hideLabel);

	this.hideListUL = document.createElement('ul');
	this.hListDiv.appendChild(this.hideListUL);
/*
	for(var i = 0; i < cityObjs.length;i++){

		var hideListLI = document.createElement('li');
		var hListInput = document.createElement('input');
		hListInput.type = 'checkbox';
		hListInput.id = 'hListInput';
		hListInput.setAttribute('BuildID', cityObjs[i].id);
		hListInput.setAttribute('onChange' , 'thatGUI.proposalSec.hideObject(this)');
		hideListLI.appendChild(hListInput);
		hideListLI.innerHTML += '<p>'+cityObjs[i].name+'</p>';

		this.hideListUL.appendChild(hideListLI);

	}
*/
	this.proposalMenu.appendChild(this.hidenMenuBTN);
	this.proposalMenu.appendChild(this.hListDiv);	

}
ProposalSection.prototype.appendToHidenList = function(obj, type){

		var hideListLI = document.createElement('li');
		var hListInput = document.createElement('input');
		hListInput.type = 'button';
		hListInput.id = 'hListInput';
		hListInput.setAttribute('BuildID', obj.userData.id);

		if(type == 'buildingsLow'){
			hListInput.setAttribute('dataType' , 'buildingsLow');
		}else if(type == 'Build'){
			hListInput.setAttribute('dataType' , 'Build');	
		}

		hListInput.setAttribute('onClick' , 'thatGUI.proposalSec.removeFromHidenList(this)');
		hideListLI.appendChild(hListInput);


		if(typeof(obj.name) != "undefined"){
			hideListLI.innerHTML += '<p>'+obj.name+'</p>';
		}else{
			hideListLI.innerHTML += '<p>'+obj.userData.id+'</p>';
		}
		

		this.hideListUL.appendChild(hideListLI);


}
ProposalSection.prototype.removeFromHidenList = function(elem){
		var dataType = elem.getAttribute('dataType');



		if(dataType == 'Build'){
			objLoad.showObjs([elem.getAttribute('BuildID')]);

		}else if(dataType = 'buildingsLow'){


			for(var i = 0; i < thatground.buildings.length;i++){

	   				if( (thatground.buildings[i] instanceof geoObjectLoader) == true){

			    		thatground.buildings[i].showBuilding(elem.getAttribute('BuildID'));
			    		thatground.buildings[i].removeFromULLIst(elem.getAttribute('BuildID'));

			    	}
			    
		    }

		}

		for(var i = 0 ;i < this.hideListUL.children.length;i++){
			var loopElem = this.hideListUL.children[i].getElementsByTagName('input')[0];

			if(loopElem.getAttribute('BuildID') == elem.getAttribute('BuildID')){

				this.hideListUL.children[i].parentNode.removeChild(this.hideListUL.children[i]);
			}
		}


		
}

ProposalSection.prototype.hideObject = function(elem){

	objLoad.hideListCheckedfromID(elem.getAttribute('BuildID'));

}
ProposalSection.prototype.addOnclickToProposals = function(e,obj){

		e.target.setAttribute("value", transPS['remove']);
		e.target.className = 'redbtn';
		e.target.onclick = function(e){

			//load here the OBJECT for probosals
			thatGUI.proposalSec.removeProposalObject(this, obj);
		}
		  

			if(typeof this.createAddProposalObj == 'function'){
				this.proposalsADD.style.display = 'none';
				//this.hListDiv.style.display = 'none';
			}
			this.proposalList.style.pointerEvents = 'none';

			var proposa = this.proposalsArray[e.target.parentElement.attributes[0].nodeValue];

			//thatGUI.objectNameHTML.innerHTML = 'Message: '+proposa.name;
			for(var i = 0; i < objLoad.proposalObj['obj'].length;i++){

			}
			objLoad.loadProposal(proposa);



}
ProposalSection.prototype.loadProposalComments = function(obj){

		this.proposalList.style.pointerEvents = 'auto';
		ajax.get('../cities/getProposalObjectCommetnsById/'+obj.userData.id,
				{},
				function(e){
			
				
					thatGUI.commetnSec.pickedCommentType = "proposalObject";
					thatGUI.loadComments(obj, JSON.parse(e));

				}


		);

}
ProposalSection.prototype.closePorposals = function(){
		//hide Proposals Body
	this.ProposalsBody.style.display = "none";
	for(var i = 0; i < objLoad.proposalObj['bbox'].length;i++){
		objLoad.proposalObj['bbox'][i].visible = false;
	}
	
	/*if(objLoad.proposalAddLoaded == true){
		this.removeAddedObject(objLoad.addProposalObj["obj"]);
		objLoad.proposalAddLoaded = false;
	}*/
//	

}
ProposalSection.prototype.removeProposalObject = function(elem, obj){
	
	    elem.setAttribute("value", transPS['show']);
	    elem.className = 'greenbtn';
	  	elem.onclick = function(e){
			//load here the OBJECT for probosals
	
			thatGUI.proposalSec.addOnclickToProposals(e, obj);
		}


	if((typeof this.createAddProposalObj == 'function') && thatGUI.proposalObjPick == false){
		this.proposalsADD.style.display = 'block';
		//this.hListDiv.style.display = 'block';
	}

	thatGUI.commetnSec.CommentsBody.style.display = "none";

	var objID = elem.getAttribute('id');

	for(var i = 0 ; i < objLoad.proposalObj['obj'].length;i++){
		if(objLoad.proposalObj['obj'][i].userData.id == objID){

			
	
			objLoad.showObjs(objLoad.proposalObj['obj'][i].userData.hidden);


			for(var k = 0; k < thatground.buildings.length;k++){

				if( (thatground.buildings[k] instanceof geoObjectLoader) == true){
						for(var j = 0; j <= objLoad.proposalObj['obj'][i].userData.hiddenLow.length;j++){
							
							thatground.buildings[k].showBuildingById(objLoad.proposalObj['obj'][i].userData.hiddenLow[j]);

						}
					
		    		
		    	}
					    	
			}





			this.removeAddedObject(objLoad.proposalObj['obj'][i], objLoad.proposalObj['bbox'][i]);
		
			var objIndex = objLoad.proposalObj['obj'].indexOf(objLoad.proposalObj['obj'][i]);
			var rayIndex = thatRay.interObjectsArray.indexOf(objLoad.proposalObj['obj'][i]);

			objLoad.proposalObj['obj'].splice(objIndex, 1);
			objLoad.proposalObj['bbox'].splice(objIndex, 1);
			thatRay.interObjectsArray.splice(rayIndex, 1);
			
			if(thatRay.bbHelper !== 'undefined'){
				disposeHierarchy(thatRay.bbHelper, disposeNode);	
				thisCore.scene.remove(thatRay.bbHelper);
			}

		}


	}



		
}

ProposalSection.prototype.removeAddedObject = function(obj, bbox){

	thisCore.control.detach();



	if(obj){
			//var obj = thisCore.scene.getObjectByName(obj);
		
		disposeHierarchy(obj, disposeNode);	
		thisCore.scene.remove(obj);

		disposeHierarchy(bbox, disposeNode);
		thisCore.scene.remove(bbox);


	}


}

