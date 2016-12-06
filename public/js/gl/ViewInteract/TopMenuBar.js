function TopMenuBar(){

	if(loadingData['user'].length < 1){
		this.user = "guest";
		this.userSTR = transTMB['guest'];
	}else{
		this.user = loadingData['user'].name;
		this.userSTR = loadingData['user'].name;
	}

	this.activLang = "en";

	this.loaded = false;

	thatTopMenuBar = this;
	this.topMenuBar = document.createElement("div");
	this.topMenuBar.id = 'topMenuBar';

	var topmWidth = window.innerWidth - 200;
	this.topMenuBar.style.width = topmWidth+"px";

	thatGUI.guiDiv.appendChild(this.topMenuBar);

	this.timeValue = 12;




	this.imgBanner = document.createElement("img");



	//this.imgBanner.src = "/public/imgs/betaVilleLogo.gif";
	
	this.imgBanner.src = "../imgs/betaVilleLogo.gif";

	this.imgBanner.style.height = this.topMenuBar.offsetHeight+'px';
	this.imgBanner.onload = function() {

		thatTopMenuBar.createSubMenu();

		thatTopMenuBar.createFPSmeter();
		thatTopMenuBar.createDaySunPos();
		thatTopMenuBar.createObjInfoSection();
		thatTopMenuBar.createBuildingsInfo();
		//thatTopMenuBar.langSwitch = new LangSwitch();
		thatTopMenuBar.loaded = true;

	};
	this.topMenuBar.appendChild(this.imgBanner);


	this.createLeftSideMenu();
	this.createRightSideMenu();


	new HelpFrame();
	new CamControl();
	
	this.helpBTN = document.createElement("button");
	this.helpBTN.id = "helpBTN";
	this.helpBtnText = document.createTextNode("Help");       
	this.helpBTN .appendChild(this.helpBtnText);                                
	this.helpBTN.className += 'dropDownMenu right';  
	this.helpBTN.style.fontSize = "140%";
	this.helpBTN.style.backgroundColor = '#F2F2F2';     
	this.helpBTN.onclick = function(){

		helpFrame.showFrame();
	
	}


	thatGUI.guiDiv.appendChild(this.leftTopMenu);
	
	this.topMenuBar.appendChild(this.rightTopMenu);
		this.topMenuBar.appendChild(this.helpBTN ); 





	//this.createShowPosSection();




}
TopMenuBar.prototype.rendere = function(){
	if(this.loaded == true){
		this.stats.update();

	}
}
TopMenuBar.prototype.createSubMenu = function(){
	this.subTopMenu = document.createElement('div');
	this.subTopMenu.id = 'subTopMenu';

	this.calcSubWidth();

	this.topMenuBar.appendChild(this.subTopMenu);

}
TopMenuBar.prototype.calcSubWidth = function(){

	var w = window.innerWidth - 200; // get the width withoutLeftDropDownMenu
	var subW = w - this.imgBanner.width;
	var mleft =  this.imgBanner.width; //margin to left border;
	this.subTopMenu.style.width = subW+'px';
	this.subTopMenu.style.left = mleft+'px';

}
TopMenuBar.prototype.createFPSmeter = function(){

	this.stats = new Stats();
	//console.log(this.stats);
	//this.stats.domElement.style.position = 'absolute';
	//this.stats.domElement.style.top = '50px';
	this.stats.domElement.style.left = 0;
	this.topMenuBar.appendChild( this.stats.domElement );

}
TopMenuBar.prototype.createDaySunPos = function(){
	var tlDiv = document.createElement("div");
	tlDiv.id = "timeLine";
	tlDiv.style.width = "45%";

	//tlDiv.appendChild(this.timelineOut);



	this.timeLine = document.createElement("input");
	this.timeLine.setAttribute('name', 'timeline');
	this.timeLine.setAttribute("type", "range");
	this.timeLine.setAttribute("min", 1);
	this.timeLine.setAttribute("max", 24);
	this.timeLine.setAttribute("step", 1);
	this.timeLine.setAttribute("value",12);
	this.timeLine.oninput = function(){lightLib.calcSunPos()};
	tlDiv.appendChild(this.timeLine);




	this.timelineOut = document.createElement('output');
	this.timelineOut.setAttribute('for', 'timeLine');
	this.timelineOut.setAttribute('onforminput', 'value = thatTopMenuBar.timeValue');
	tlDiv.appendChild(this.timelineOut);

	this.subTopMenu.appendChild(tlDiv);
	lightLib.calcSunPos();
}
TopMenuBar.prototype.createObjInfoSection = function(){
	this.infoBody = document.createElement('div');
	this.infoBody.id = 'Info-Body';


	this.longlatDiv = document.createElement('div');
	this.longlatDiv.id = "longlangDiv";
	this.infoBody.appendChild(this.longlatDiv);

	this.utmDiv = document.createElement('div');
	this.utmDiv.id = 'UTMDiv';
	this.infoBody.appendChild(this.utmDiv);

	this.atliInfo = document.createElement('div');
	this.atliInfo.id = "atliInfo";
	this.infoBody.appendChild(this.atliInfo);





	this.subTopMenu.appendChild(this.infoBody);

}
TopMenuBar.prototype.createBuildingsInfo = function(){

	var buildingsDiv = document.createElement('div');
	buildingsDiv.id = 'buildings-InfoTable';
	this.buildingsInfoTable = document.createElement('table');


	buildingsDiv.appendChild(this.buildingsInfoTable);

	this.subTopMenu.appendChild(buildingsDiv)



};
TopMenuBar.prototype.updateBuildingsInfo = function(s){

	this.buildingsInfoTable.innerHTML = "";
	if(s instanceof Object == true){
		for(var key in s.userData){
			if(key != 'clean'){
				var tr = document.createElement('tr');

				var tdKey = document.createElement('td');
				tdKey.innerHTML = key;

				var tdValue = document.createElement('td');
				tdValue.innerHTML = s.userData[key];

				tr.appendChild(tdKey);
				tr.appendChild(tdValue);

				this.buildingsInfoTable.appendChild(tr);
			}
		}
		
	}

}
TopMenuBar.prototype.createLeftSideMenu = function(){

	this.leftTopMenu = document.createElement('div');
	this.leftTopMenu.className += 'dropDownMenu left';

	this.citiesMenuUL = document.createElement('ul');
	this.citiesMenuUL.className += 'dropDownMenuList';
	this.citiesMenuUL.style.display = 'block';

	var leftMenuHeight = window.innerHeight - 43;
	this.citiesMenuUL.style.height = leftMenuHeight+"px";

	this.cityli = document.createElement('button');
	this.cityli.className += 'dropDownMenuBTN';
/*	this.cityli.addEventListener("click", function(){
					if(thatTopMenuBar.dropsubmenu.dropSubDiv.style.display == 'block'){
						thatTopMenuBar.dropsubmenu.dropSubDiv.style.display = 'none';
						thisCore.scene.remove(thatTopMenuBar.dropsubmenu.bbHelper);
						thatTopMenuBar.dropsubmenu.bbHelper = "undefined";

					}
				    //thatTopMenuBar.getCityDropDown();
				}, false); */
	this.cityli.innerHTML = loadingData['city'].name;
	this.leftTopMenu.appendChild(this.cityli);
	this.leftTopMenu.appendChild(this.citiesMenuUL);


	this.dropsubmenu = new DropSubMenu();
	thatGUI.guiDiv.appendChild(this.dropsubmenu.dropSubDiv);



	//Buildins
	this.buildingsLI = document.createElement('li');
	this.buildBTN = document.createElement('button')
	this.buildBTN.innerHTML = '<p>'+transTMB['objects']+'</p>';
	this.buildBTN.className += 'dropDownMenuSubBTN';
	this.buildBTN.addEventListener("click", function(e) {

					

					if(thatTopMenuBar.dropsubmenu.dropSubDiv.style.display == 'block'){
						thatTopMenuBar.dropsubmenu.dropSubDiv.style.display = 'none';
						for(var i = 0; i < this.parentNode.children[1].children.length;i++){
							this.parentNode.children[1].children[i].className = "dropDownMenuSubBTN";

						}
					}

				    thatTopMenuBar.loadLeftSub(this.parentNode.children[1]);


				}, false);
	this.buildingsLI.appendChild(this.buildBTN);
	this.citiesMenuUL.appendChild(this.buildingsLI);


	this.buildingsUL = document.createElement('ul');
	this.buildingsUL.style.display = 'none';

	if( getSize(loadingData['models']) > 0 && loadingData['models']['buildings'].high){

		for(var i = 0; i < loadingData['models']['buildings'].high.length;i++){
			var li = document.createElement('li');
			li.setAttribute('i', i);
			var bname = loadingData['models']['buildings'].high[i].name.split(":");
			li.innerHTML = '<p>'+bname[1]+'</p>';
			li.addEventListener("click", function() {

						var obj = loadingData['models']['buildings'].high[this.getAttribute('i')];

						if(typeof(thatTopMenuBar.dropsubmenu.focusObj) == 'object' ){

							if(thatTopMenuBar.dropsubmenu.focusObj.id == obj.id ){
									thatTopMenuBar.dropsubmenu.closeSubElement(this);

							}else{
								thatTopMenuBar.dropsubmenu.showSubElement(obj, this, 'building');
							}

						}else{

							thatTopMenuBar.dropsubmenu.showSubElement(obj, this, 'building');
						}




					}, false);

			this.buildingsUL.appendChild(li);
		}

	}

	this.buildingsLI.appendChild(this.buildingsUL);


	//Proposals
	this.proposalsLI = document.createElement('li');
	this.proposalBTN = document.createElement('button')
	this.proposalBTN.innerHTML = '<p>'+transTMB['proposals']+'</p>';
	this.proposalBTN.className += 'dropDownMenuSubBTN';
	this.proposalBTN.addEventListener("click", function() {


					if(thatTopMenuBar.dropsubmenu.dropSubDiv.style.display == 'block'){
						thatTopMenuBar.dropsubmenu.dropSubDiv.style.display = 'none';

						for(var i = 0; i < this.parentNode.children[1].children.length;i++){
							this.parentNode.children[1].children[i].className = "dropDownMenuSubBTN";
						}
					}
				    thatTopMenuBar.loadLeftSub(this.parentNode.children[1]);


				}, false);
	this.proposalsLI.appendChild(this.proposalBTN);
	this.citiesMenuUL.appendChild(this.proposalsLI);

	this.proposalsUL = document.createElement('ul');
	this.proposalsUL.style.display = 'none';

	if( getSize(loadingData['models']) > 0){

		for(var i = 0; i < loadingData['models']['proposals'].length;i++){

			var li = document.createElement('li');
			li.setAttribute('i', i);
			var pname = loadingData['models']['proposals'][i].name.split(":");
			li.innerHTML = '<p>'+pname[1]+'</p>';
			li.addEventListener("click", function() {

						var obj = loadingData['models']['proposals'][this.getAttribute('i')];

						if(typeof(thatTopMenuBar.dropsubmenu.focusObj) == 'object' ){

							if(thatTopMenuBar.dropsubmenu.focusObj.id == obj.id ){
									thatTopMenuBar.dropsubmenu.closeSubElement(this);


							}else{
								thatTopMenuBar.dropsubmenu.showSubElement(obj, this, 'proposal');
							}

						}else{

							thatTopMenuBar.dropsubmenu.showSubElement(obj, this, 'proposal');
						}



					}, false);
			this.proposalsUL.appendChild(li);
		}

	}

	this.proposalsLI.appendChild(this.proposalsUL);


	//geoPosiitons
	this.geoPositionLI = document.createElement('li');
	this.geoPositionBTN = document.createElement('button')
	this.geoPositionBTN.innerHTML = '<p>'+transTMB['locations']+'</p>';
	this.geoPositionBTN.className += 'dropDownMenuSubBTN';
	this.geoPositionBTN.addEventListener("click", function() {

					if(thatTopMenuBar.dropsubmenu.dropSubDiv.style.display == 'block'){
						thatTopMenuBar.dropsubmenu.dropSubDiv.style.display = 'none';

						for(var i = 0; i < this.parentNode.children[1].children.length;i++){
							this.parentNode.children[1].children[i].className = "dropDownMenuSubBTN";
						}
					}
				    thatTopMenuBar.loadLeftSub(this.parentNode.children[1]);

				}, false);
	this.geoPositionLI.appendChild(this.geoPositionBTN);
	this.citiesMenuUL.appendChild(this.geoPositionLI);

	this.geoPositionUL = document.createElement('ul');
	this.geoPositionUL.style.display = 'none';


	if( getSize(loadingData['models']) > 0){

		for(var i = 0; i < loadingData['models']['geopositions'].length;i++){
			var li = document.createElement('li');
			li.setAttribute('i', i);
			var gpname = loadingData['models']['geopositions'][i].name.split(":");
			li.innerHTML = '<p>'+gpname[1]+'</p>';
			li.addEventListener("click", function() {

						var obj = loadingData['models']['geopositions'][this.getAttribute('i')];

						if(typeof(thatTopMenuBar.dropsubmenu.focusObj) == 'object' ){

							if(thatTopMenuBar.dropsubmenu.focusObj.id == obj.id ){
									thatTopMenuBar.dropsubmenu.closeSubElement(this);

							}else{
								thatTopMenuBar.dropsubmenu.showSubElement(obj, this, 'geoposition');
							}

						}else{

							thatTopMenuBar.dropsubmenu.showSubElement(obj, this, 'geoposition');
						}




					}, false);
			this.geoPositionUL.appendChild(li);
		}

	}
	this.geoPositionLI.appendChild(this.geoPositionUL);


	if(preLoad.onLoadDataSet.dataStats != undefined){
    	thatTopMenuBar.createStatsMenu();
    	this.citiesMenuUL.appendChild(this.statsTopMenu);
   	}

	if(preLoad.onLoadDataSet.objects != undefined){
    	thatTopMenuBar.createObjectMenu();
    	this.citiesMenuUL.appendChild(this.objectsTopMenu);
   	}




	this.backBTN = document.createElement('button');
	this.backBTN.id = 'CityMenuBackLI';
	this.backBTN.innerHTML = '<p>'+transTMB['Home']+'</p>';
	this.backBTN.className = 'dropDownMenuSubBTN greenbtn';
	this.backBTN.addEventListener('click', function(){

		var conf = confirm("This action will remove the current dataset from view. Are you sure you want to proceed");
		if(conf == true){
			var hrefAry = window.location.href.split('/');
			hrefAry.splice(hrefAry.length-2,2);
			var newhref = '';
			for(var i = 0; i < hrefAry.length;i++){
				newhref += hrefAry[i]+'/';
			}
			window.location.href = newhref;
		}




	});

	this.citiesMenuUL.appendChild(this.backBTN);

}



TopMenuBar.prototype.createStatsMenu = function(){

	this.statsTopMenu = document.createElement('li');

	//this.statsTopMenu.className += 'dropDownMenu right';

	this.statsMenuUL = document.createElement('ul');
	//this.statsMenuUL.className += 'dropDownMenuList ';
	this.statsMenuUL.style.display = 'none';


	this.statsBTN = document.createElement('button');
	//this.statsBTN.className += 'dropDownMenuBTN ';
	this.statsBTN.className += 'dropDownMenuSubBTN ';

	this.statsBTN.innerHTML = '<p>'+transTMB['stats']+'</p>';
	this.statsBTN.addEventListener("click", function() {
				    thatTopMenuBar.getStatsDropDown();
				}, false);



	// append stats Interact
	for(var i = 0; i < preLoad.onLoadDataSet.dataStats.length;i++){
		var li = document.createElement('li');
		li.id = i;
		var subbtn = document.createElement('button');
		subbtn.innerHTML = '<p>'+ preLoad.onLoadDataSet.dataStats[i].name+'</p>';
		subbtn.setAttribute('idint', i);
		subbtn.setAttribute('type', preLoad.onLoadDataSet.dataStats[i].type)
		subbtn.className = 'dropDownMenuSubBTN';
		subbtn.addEventListener('click', function(e){

			var childli = this.parentNode.children[1];
			var type = this.getAttribute('type');


			if(thatground.stats.statsOnScene == true){

				thatground.stats.removeStats();
				thatTopMenuBar.closeSubMenu(thatground.stats.openLiElement);


			}

			if(thatground.stats.openLiElement !== this.parentNode){

				thatground.stats.openLiElement = this.parentNode;
				this.className = "dropDownMenuSubBTN greenbtn";
				childli.style.display = 'block';
				if(type == "raster"){

					thatground.stats.loadJSON(this);

				}else
				if(type == "vector"){
					var data = preLoad.onLoadDataSet.dataStats[this.getAttribute('idint')];
					var vec = new geoJSONLineLoader(data);

					ajax.get('../../storage/app/'+data.src, 'json', function(e){

						vec.load(JSON.parse(e), statsLoaded);



					});

				}

			}else{

				thatground.stats.openLiElement = "";

			}



		}, false);

		var subUL = document.createElement('ul');
		subUL.style.display = 'none';
		subUL.style.margin = 0;
		subUL.style.padding = 0;
		subUL.style.fontSize = "80%";


			for(var j = 0; j < preLoad.onLoadDataSet.dataStats[i].data.length;j++){




				var subLi = document.createElement('li');
				subLi.innerHTML = '<p>'+preLoad.onLoadDataSet.dataStats[i].data[j].name+'</p>';
				subLi.style.color = preLoad.onLoadDataSet.dataStats[i].data[j].color;

				subUL.appendChild(subLi);

		}

		li.appendChild(subbtn);
		li.appendChild(subUL);

		this.statsMenuUL.appendChild(li);
	}

	this.statsTopMenu.appendChild(this.statsBTN);
	this.statsTopMenu.appendChild(this.statsMenuUL);



	thatGUI.guiDiv.appendChild(thatground.stats.metaDiv);
}


TopMenuBar.prototype.createObjectMenu = function(){

	this.objectsTopMenu = document.createElement('li');
	//this.statsTopMenu.className += 'dropDownMenu right';

	this.objectsMenuUL = document.createElement('ul');
	//this.statsMenuUL.className += 'dropDownMenuList ';
	this.objectsMenuUL.style.display = 'none';


	this.objectsBTN = document.createElement('button');
	//this.statsBTN.className += 'dropDownMenuBTN ';
	this.objectsBTN.className += 'dropDownMenuSubBTN ';

	this.objectsBTN.innerHTML = '<p>'+transTMB['geojson']+'</p>';
	this.objectsBTN.addEventListener("click", function() {
				    thatTopMenuBar.getobjectsDropDown();

				}, false);


// append stats Interact
	for(var i = 0; i < preLoad.onLoadDataSet.objects.length;i++){
		var li = document.createElement('li');
		li.id = i;
		var subbtn = document.createElement('button');
		subbtn.innerHTML = '<p>'+ preLoad.onLoadDataSet.objects[i].name+'</p>';
		subbtn.setAttribute('idint', i);
		subbtn.setAttribute('type', preLoad.onLoadDataSet.objects[i].type)
		subbtn.className = 'dropDownMenuSubBTN';
		subbtn.addEventListener('click', function(e){
			var open = false;
			if(thatground.objects.loadedObjs.length > 0){

				for(var j  = 0; j < thatground.objects.loadedObjs.length;j++){
					var obj = thatground.objects.loadedObjs[ j ];


					if(obj.userData.id ==  this.getAttribute('idint') ){
						open = true;
						thatground.objects.removeObjById(obj.userData.id);
						this.className = 'dropDownMenuSubBTN';
					}


				}
				if(open == false){
					this.className = 'dropDownMenuSubBTN greenbtn';
					thatground.objects.loadJSON(this, this.getAttribute('idint') );
				}


			}else{
				this.className = 'dropDownMenuSubBTN greenbtn';
				thatground.objects.loadJSON(this, this.getAttribute('idint') );

			}




		}, false);

		li.appendChild(subbtn);


		this.objectsMenuUL.appendChild(li);
	}



	this.objectsTopMenu.appendChild(this.objectsBTN);
	this.objectsTopMenu.appendChild(this.objectsMenuUL);




}

TopMenuBar.prototype.createRightSideMenu = function(){

	this.rightTopMenu = document.createElement('div');
	this.rightTopMenu.className += 'dropDownMenu right';

	this.UserMenuUL = document.createElement('ul');
	this.UserMenuUL.className += 'dropDownMenuList ';
	this.UserMenuUL.style.display = 'none';
	

	this.userBTN = document.createElement('button');
	this.userBTN.className += 'dropDownMenuBTN ';
	this.userBTN.innerHTML = this.userSTR;
	this.userBTN.addEventListener("click", function() {
				    thatTopMenuBar.getUserDropDown();
				}, false);
	this.rightTopMenu.appendChild(this.userBTN);
	this.rightTopMenu.appendChild(this.UserMenuUL);

	if(this.user == 'guest'){
		// append login
		var loginLI = document.createElement('li');
		this.loginUsername = document.createElement('input');
		this.loginUsername.type = 'text';
		this.loginUsername.value = 'Email'
		this.loginpassword = document.createElement('input');
		this.loginpassword.type = 'password';
		this.loginpassword.value = 'password';

		var loginBTN = document.createElement('button');
		loginBTN.innerHTML = 'Login';
		loginBTN.className = 'dropDownMenuSubBTN greenbtn'
		loginBTN.addEventListener('click',function(){

		var fd = new FormData();
		console.log(getMetaToken());
		fd.append('email', thatTopMenuBar.loginUsername.value);
		fd.append('password', thatTopMenuBar.loginpassword.value);
		fd.append('_token', getMetaToken());
			ajax.send('../account/login',
				function(e){
					console.log(log);
					var log = JSON.parse(e);

					if(log.auth == true){
/* Experimentel
					var elem = document.getElementById('guiDiv');
    				elem.parentNode.removeChild(elem);

    				loadingData['user'].role = log.role;
    				console.log(log.role);
    				if(log.role == 0){
    					addScript('../js/gl/ViewInteract/subElem/DBInteractOrdinary.js', new GUI);
    				}else
    				if(log.role == 1){
						addScript('../js/gl/ViewInteract/subElem/DBInteractOrdinary.js',
							addScript('../js/gl/ViewInteract/subElem/DBInteractModerator.js',
								new GUI ));

    				}

*/

					//reloadGUI();
						window.location.reload();
					}


				},'dataUpload',
				fd
			);

		});

		loginLI.appendChild(this.loginUsername);
		loginLI.appendChild(this.loginpassword);
		loginLI.appendChild(loginBTN);

		this.UserMenuUL.appendChild(loginLI);
	}else{
		var logoutLI = document.createElement('li');
		this.logoutBTN = document.createElement('button');
		this.logoutBTN.className += ' dropDownMenuSubBTN';
		this.logoutBTN.innerHTML = '<p>'+transTMB['logout']+'</p>';
		this.logoutBTN.className = 'dropDownMenuSubBTN redbtn';
		this.logoutBTN.addEventListener('click',function(){
			ajax.send('../logout',
				function(e){
						console.log(e);
				//	console.log('loggedout');
					window.location.reload();

				},'GET'
			);

		});
		logoutLI.appendChild(this.logoutBTN);
		this.UserMenuUL.appendChild(logoutLI);
	}



}


TopMenuBar.prototype.displayInfoSection = function(lanlat, utm, atli){
	var hemi;

	if(utm.isSouthern){
		hemi = "S";
	}else{
		hemi = "N";
	}

	this.longlatDiv.innerHTML = "<p>Long: "+round(lanlat.x,6)+" Lat: "+round(lanlat.z,6)+'</p>  ';

	this.atliInfo.innerHTML = "<p>Alt: "+round(atli/10,3)+'</p>  ';

	this.utmDiv.innerHTML = "<p>UTM :  "+utm.zone+" "+hemi+"  x: "+round(utm.coord.x,2)+"  y: "+round(utm.coord.y,2)+'</p>';


}





TopMenuBar.prototype.closeSubMenu = function(elem){


	elem.children[0].className = "dropDownMenuSubBTN";
	elem.children[1].style.display = "none";

};

TopMenuBar.prototype.clearInfoSection = function(){
	//hide Comments Body
	this.longlatDiv.innerHTML = "";
	this.atliInfo.innerHTML = "";
	this.utmDiv.innerHTML = "";

}
TopMenuBar.prototype.getUserDropDown = function(){

	if(this.UserMenuUL.style.display == 'block'){
		this.UserMenuUL.style.display = 'none';
	}else{

		this.UserMenuUL.style.display = 'block';

	}
}
TopMenuBar.prototype.getStatsDropDown = function(){

	if(this.statsMenuUL.style.display == 'block'){
		this.statsMenuUL.style.display = 'none';
	}else{

		this.statsMenuUL.style.display = 'block';

	}

}
TopMenuBar.prototype.getobjectsDropDown = function(){

	if(this.objectsMenuUL.style.display == 'block'){
		this.objectsMenuUL.style.display = 'none';
	}else{

		this.objectsMenuUL.style.display = 'block';

	}


}
TopMenuBar.prototype.getCityDropDown = function(){

	if(this.citiesMenuUL.style.display == 'block'){
		this.citiesMenuUL.style.display = 'none';
	}else{

		this.citiesMenuUL.style.display = 'block';

	}
}

TopMenuBar.prototype.loadLeftSub = function(elem){

	var elemsList = elem.parentNode.parentNode.childNodes;
	for(var i = 0; i < elemsList.length - 1 ;i++){ // -1 fome for the home button

	
		if(elemsList[i].childNodes[1].style.display == "block" && elemsList[i].childNodes[1] != elem ){
			
			elemsList[i].childNodes[1].style.display = "none";

		}

		// = "none";
		//console.log(elemsList[i].childNodes[1]);
	}

			//console.log(elem.parentNode.parentNode.children[0].children[1]);
			if(elem.style.display == 'none'){

				elem.style.display = 'block';
	
				
			}else{

				elem.style.display = 'none';


			}
		

		/**/

	/*var action = elem.getAttribute('action');
	if(action == 'buildings'){
		if(this.buildingsUL.style.display == 'none'){
			this.buildingsUL.style.display = 'block';
		}else{
			this.buildingsUL.style.display = 'none';
		}


	}else
	if(action == 'proposals'){
		if(this.proposalsUL.style.display == 'none'){
			this.proposalsUL.style.display = 'block';
		}else{
			this.proposalsUL.style.display = 'none';
		}


	}else
	if(action == 'geoposition'){
		if(this.geoPositionUL.style.display == 'none'){
			this.geoPositionUL.style.display = 'block';
		}else{
			this.geoPositionUL.style.display = 'none';
		}

	}
	*/
}


/*
*
* DUMMYYY
*

TopMenuBar.prototype.createShowPosSection = function(){
	this.longlatPositionDiv = document.createElement('div');
	this.longlatPositionDiv.id = "langlongDiv";

	this.longlatPositionDiv.innerHTML = "<p href='#'>72.1234567 / 23.232456</p>";
	this.topMenuBar.appendChild(this.longlatPositionDiv);
}

TopMenuBar.prototype.updateLangLongPos = function(){
	this.longlatPositionDiv.innerHTML = "";
	var newPos = thisCore.scaleTerrainTocoord(thatControl.camLookAt);
	this.longlatPositionDiv.innerHTML = "<p href='#'>"+round(newPos.x,6)+" / "+round(newPos.z,6)+"</p>"; //+"<br>"+thatControl.camLookAt.x+" / "+thatControl.camLookAt.y+" / "+thatControl.camLookAt.z;
}





Get all Cites List and append onload
		ajax.get('../cities',
				{},
				function(e){
					var cities = JSON.parse(e);
					thatTopMenuBar.citiesMenuUL.innerHTML = "";
					for(var i = 0; i < cities.length; i ++){
						var li = document.createElement('li');
						li.setAttribute('Cityid', cities[i].id);
						li.innerHTML = '<p>'+cities[i].name+'</p>';


						li.addEventListener("click", function() {


											console.log(window.location);
											var pathArray = window.location.pathname.split('/');
											pathArray[pathArray.length-1] = this.getAttribute('Cityid');
											window.location.href = pathArray[pathArray.length-1];

											}, false);


						thatTopMenuBar.citiesMenuUL.appendChild(li)
					}

					thatTopMenuBar.citiesMenuUL.style.display = 'block';

				}
		);



**/
