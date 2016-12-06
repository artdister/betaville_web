function LangSwitch(){
	

	this.langList = {
		"English" : "eng",
		"French": "fr"
	}

	this.langSelect = document.createElement('select');
	this.langSelect.addEventListener("change", function(e) {

						for(var i = 0; i < this.children.length;i++){
							var option = this.children[i];

							if(option.selected){
								

								removeScript(thatTopMenuBar.activLang+'.json');
								thatTopMenuBar.activLang = option.value;
								addScript('../lang/'+option.value+'.json', thatTopMenuBar.langSwitch.reloadLanguage);
								
								
								
							}

						}
			

					});

	for(key in this.langList){

		var option = document.createElement('option');
		option.innerHTML = key;
		option.value = this.langList[key];
		this.langSelect.appendChild(option);

	}
	
	thatTopMenuBar.topMenuBar.appendChild(this.langSelect);

}
LangSwitch.prototype.reloadLanguage = function(){

	//Top Menu bar
	thatTopMenuBar.buildBTN.innerHTML = '<p>'+transTMB['objects']+'</p>';
	thatTopMenuBar.proposalBTN.innerHTML = '<p>'+transTMB['proposals']+'</p>';
	thatTopMenuBar.geoPositionBTN.innerHTML = '<p>'+transTMB['locations']+'</p>';
	thatTopMenuBar.backBTN.innerHTML = '<p>'+transTMB['Home']+'</p>';
	if(typeof(user) != "undefined"){
		thatTopMenuBar.logoutBTN.innerHTML = '<p>'+transTMB['logout']+'</p>';
	}
	
	thatTopMenuBar.statsBTN.innerHTML = '<p>'+transTMB['stats']+'</p>';

	console.log(transTMB);
	if(typeof(user) == "undefined"){
		thatTopMenuBar.userBTN.innerHTML = transTMB['guest'];
	}else{
		thatTopMenuBar.userBTN.innerHTML = loadingData['user'].name;
	}

	//Top Menu bar Sub
	thatTopMenuBar.dropsubmenu.urlInfo.innerHTML = transTMBS['url'];
	thatTopMenuBar.dropsubmenu.positionInfo.innerHTML = transTMBS['position'];
	thatTopMenuBar.dropsubmenu.atliInfo.innerHTML = transTMBS['atli'];
	thatTopMenuBar.dropsubmenu.authorInfo.innerHTML = transTMBS['author'];
	thatTopMenuBar.dropsubmenu.editBtn.innerHTML = transTMBS['edit'];
	thatTopMenuBar.dropsubmenu.deletBtn.innerHTML = transTMBS['remove'];

	//Geo Menu Section
	if(typeof(user) != "undefined"){
		thatGUI.groundSec.groundinteractAddProposal.innerHTML = transGM['addPropo'];
		thatGUI.groundSec.groundinteractAddGeoComment.innerHTML = transGM['addGeoPos'];
		thatGUI.groundSec.groundinteractAddCityObj.innerHTML = transGM['addBuild'];
	}

	//Add GeoPosition
	thatGUI.groundSec.addgeoposBody.innerHTML+= "<h2>"+transAGP['AddGeoPosition']+"</h2> <br>";
	thatGUI.groundSec.addgeoposText.value = transAGP['insideText'];
	thatGUI.groundSec.addProposalBtn.setAttribute("value", transAGP['AddGeoPositionBTN']);

	//Add Geo Proposal
	thatGUI.groundSec.addProposalText.value = transAP['insideText'];
	thatGUI.groundSec.addProposalBody.innerHTML+= "<h2>"+transAP['AddProposal']+"</h2> <br>";
	thatGUI.groundSec.addProposalBtn.setAttribute("value", transAP['confirmBTN']);

	//Add Geo building
	thatGUI.groundSec.addCityobjBody.innerHTML = "<h2>"+transABO['AddBuilding']+"</h2>"
	thatGUI.groundSec.dropCityObjs.innerHTML = "<p>"+transABO['dropObjHere']+"</p>";
	thatGUI.groundSec.droCityTextures.innerHTML = "<p>"+transABO['dropTextureHere']+"</p>";
	thatGUI.groundSec.dropLoadToSceneBtn.setAttribute('value' , transABO['Load']);
	thatGUI.groundSec.uploadCityObjToDBBtn.setAttribute('value' , transABO['Save']);


	//Proposal section
	if(typeof(user) != "undefined"){
		thatGUI.proposalSec.hideLabel.innerHTML = transPS['hideObjs'];
		thatGUI.proposalSec.dropObjName.value = transPS['modelnametext'];
		thatGUI.proposalSec.dropPreViewImgDiv.innerHTML = "<p>"+transPS['dropImg']+"</p>";
		thatGUI.proposalSec.dropObjs.innerHTML = "<p>"+transPS['dropObj']+"</p>";
		thatGUI.proposalSec.dropLoadToSceneBtn.setAttribute('value' , transPS['Load']);
		thatGUI.proposalSec.uploadToDBBtn.setAttribute('value' , transPS['Save']);
		thatGUI.proposalSec.hidenMenuBTN.innerHTML = 'Hide Buildings';
	}


	//Comment Sector
	if(typeof(user) != "undefined"){
		thatGUI.commetnSec.userCommentIN.placeholder  = transCS['placeholder'];
		thatGUI.commetnSec.userCommentButton.value = transCS['public'];
		thatGUI.commetnSec.createMetaData();
	}



}
