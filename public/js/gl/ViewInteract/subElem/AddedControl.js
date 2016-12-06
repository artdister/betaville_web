function AddedControl(cancelCB){

	thatAddedControl = this;

	this.rotate ={
		x:0,
		y:0,
		z:0
	};
	this.transform = {
		lat:0,
		lng:0,
		atli:0
	};
	this.scale = 0;

	var cntrUL = document.createElement('ul');

	var cancelBTN = document.createElement('input');
	cancelBTN.setAttribute("type", "button");
	cancelBTN.value = 'cancel';
	cancelBTN.style.width = "33%";
	cancelBTN.style.position = 'absolute';
	cancelBTN.style.top = "-28px";
	cancelBTN.style.height = '28px';
	cancelBTN.style.fontFamily = 'verdana';
	cancelBTN.style.fontSize = "100%";
	cancelBTN.style.right = "0";
	cancelBTN.className = 'redbtn';
	cancelBTN.onclick = function(e){

	//	console.log(e, this);
		cancelCB();

	}
	

	var transformCNTR = document.createElement('li');
	transformCNTR.setAttribute('value', 'Transform');
	transformCNTR.innerHTML = '<p>'+transCNTR['transform']+'</p>';
	transformCNTR.setAttribute('onclick', "thatGUI.handleControlCheck(this)");
	cntrUL.appendChild(transformCNTR);

	var rotateCNTR = document.createElement('li');
	rotateCNTR.setAttribute('value', 'Rotate');
	rotateCNTR.innerHTML = '<p>'+transCNTR['rotate']+'</p>';
	rotateCNTR.setAttribute('onclick', "thatGUI.handleControlCheck(this)");
	cntrUL.appendChild(rotateCNTR);

	var scaleCNTR = document.createElement('li');
	scaleCNTR.setAttribute('value', 'Scale');
	scaleCNTR.innerHTML = '<p>'+transCNTR['scale']+'</p>';
	scaleCNTR.setAttribute('onclick', "thatGUI.handleControlCheck(this)");
	cntrUL.appendChild(scaleCNTR);




	this.controlDiv = document.createElement('div');
	this.controlDiv.id = 'controlDiv';
	this.controlDiv.style.overflow = "initial";
	this.controlDiv.appendChild(cancelBTN);
	this.controlDiv.appendChild(cntrUL);

	

	//set Default
	thatGUI.handleControlCheck(transformCNTR);

/*******
*** Rotate
*/


	var rotateDiv = document.createElement('div');
	var rotateP = document.createElement('p');
	rotateP.innerHTML = transCNTR['rotate'];




	var rout = document.createElement('table');
	rout.className = 'cntrOUT';

	var rXTR = document.createElement('tr');

	var rXTDInfo = document.createElement('td');
	var rXPinfo = document.createElement('p');
	rXPinfo.innerHTML = 'X.';
	rXTDInfo.appendChild(rXPinfo);
	rXTR.appendChild(rXTDInfo);

	var rXTDInput = document.createElement('td');
	this.rotate.x = document.createElement('input');
	this.rotate.x.type = 'text';
	this.rotate.x.onchange = function(e){


		thisCore.control.object.rotation.x = parseFloat(e.target.value);


	}
	rXTDInput.appendChild(this.rotate.x);
	rXTR.appendChild(rXTDInput);

	rout.appendChild(rXTR);


	var rYTR = document.createElement('tr');

	var rYTDInfo = document.createElement('td');
	var rYPinfo = document.createElement('p');
	rYPinfo.innerHTML = 'Y.';
	rYTDInfo.appendChild(rYPinfo);
	rYTR.appendChild(rYTDInfo);

	var rYTDInput = document.createElement('td');
	this.rotate.y = document.createElement('input');
	this.rotate.y.type = 'text';
	this.rotate.y.onchange = function(e){


		thisCore.control.object.rotation.y = parseFloat(e.target.value);


	}
	rYTDInput.appendChild(this.rotate.y);
	rYTR.appendChild(rYTDInput);

	rout.appendChild(rYTR);



	var rZTR = document.createElement('tr');

	var rZTDInfo = document.createElement('td');
	var rZPinfo = document.createElement('p');
	rZPinfo.innerHTML = 'Z.';
	rZTDInfo.appendChild(rZPinfo);
	rZTR.appendChild(rZTDInfo);

	var rZTDInput = document.createElement('td');
	this.rotate.z = document.createElement('input');
	this.rotate.z.type = 'text';
	this.rotate.z.onchange = function(e){


		thisCore.control.object.rotation.z = parseFloat(e.target.value);


	}
	rZTDInput.appendChild(this.rotate.z);
	rZTR.appendChild(rZTDInput);

	rout.appendChild(rZTR);



	rotateDiv.appendChild(rout);
	rotateCNTR.appendChild(rotateDiv);



/*******
*** Transform
*/
	var transformDiv = document.createElement('div');
	var transformP = document.createElement('p');
	transformP.innerHTML = transCNTR['transform'];

	var tout = document.createElement('table');
	tout.className = 'cntrOUT';


	var lngTR = document.createElement('tr');

	var lngTDInfo = document.createElement('td');
	var lngPinfo = document.createElement('p');
	lngPinfo.innerHTML = 'Long.';
	lngTDInfo.appendChild(lngPinfo);
	lngTR.appendChild(lngTDInfo);

	var lngTDInput = document.createElement('td');
	this.transform.lng = document.createElement('input');
	this.transform.lng.type = 'text';
	this.transform.lng.onchange = function(e){

		var newPos = thisCore.scaleCoordToTerrain( new THREE.Vector3(parseFloat(e.target.value), 0,0), "x/z" );
		thisCore.control.object.position.x = -newPos.x;


	}
	lngTDInput.appendChild(this.transform.lng);
	lngTR.appendChild(lngTDInput);

	tout.appendChild(lngTR);


	var latTR = document.createElement('tr');

	var latTDInfo = document.createElement('td');
	var latPinfo = document.createElement('p');
	latPinfo.innerHTML = 'Lat.';
	latTDInfo.appendChild(latPinfo);
	latTR.appendChild(latTDInfo);

	var latTDInput = document.createElement('td');
	this.transform.lat = document.createElement('input');
	this.transform.lat.type = 'text';
	this.transform.lat.onchange = function(e){

		var newPos = thisCore.scaleCoordToTerrain( new THREE.Vector3(0,0, parseFloat(e.target.value) ), "x/z" );
		thisCore.control.object.position.z = newPos.z;


	}
	latTDInput.appendChild(this.transform.lat);
	latTR.appendChild(latTDInput);

	tout.appendChild(latTR);


	var atliTR = document.createElement('tr');

	var atliTDInfo = document.createElement('td');
	var atliPinfo = document.createElement('p');
	atliPinfo.innerHTML = 'Atli.';
	atliTDInfo.appendChild(atliPinfo);
	atliTR.appendChild(atliTDInfo);

	var atliTDInput = document.createElement('td');
	this.transform.atli = document.createElement('input');
	this.transform.atli.type = 'text';
	this.transform.atli.onchange = function(e){


		thisCore.control.object.position.y = parseFloat(e.target.value)*10;
		//thatRay.bbHelper.update();

	}
	atliTDInput.appendChild(this.transform.atli);
	atliTR.appendChild(atliTDInput);

	tout.appendChild(atliTR);


	transformDiv.appendChild(tout);
	transformCNTR.appendChild(transformDiv);






/*******
*** Scale
*/
	var scaleDiv = document.createElement('div');
	var scaleP = document.createElement('p');
	scaleP.innerHTML = transCNTR['scale'];


	var sout = document.createElement('div');
	sout.className = 'cntrOUT';
	this.scale = document.createElement('input');
	this.scale.type = 'text';
	this.scale.onchange = function(e){

		thisCore.control.object.scale.x = parseFloat(e.target.value);
		thisCore.control.object.scale.y = parseFloat(e.target.value);
		thisCore.control.object.scale.z = parseFloat(e.target.value);

		//thatRay.bbHelper.update();
	}
	sout.appendChild(this.scale);

	scaleDiv.appendChild(sout);
	scaleCNTR.appendChild(scaleDiv);

}

AddedControl.prototype.updateInfo = function(){


	var obj = thisCore.control.object;
	if(obj.position){
		var newPos = thisCore.scaleTerrainTocoord(obj.position,"x/z");

		this.transform.lat.value = round(newPos.z,6);
		this.transform.lng.value = round(newPos.x,6);
		this.transform.atli.value = round((obj.position.y/10),6);

		this.rotate.x.value = round(obj.rotation.x,4);
		this.rotate.y.value = round(obj.rotation.y,4);
		this.rotate.z.value = round(obj.rotation.z,4);

		this.scale.value = round(obj.scale.x,6);

	}

	//console.log(this.infoPosition.childNodes.item("posInfoSub"));

}

/** INFO POS


	this.infoPosition = document.createElement('div');
	this.infoPosition.id = 'infoPosition';

	var LatP = document.createElement('p');
	LatP.innerHTML = 'Lat: ';
	this.latValue = document.createElement('a');
	this.latValue.id = 'posInfoSub';
	var LatDiv = document.createElement('div');
	LatDiv.appendChild(LatP);
	LatDiv.appendChild(this.latValue);
	this.infoPosition.appendChild(LatDiv);


	var LongP = document.createElement('p');
	LongP.innerHTML = 'Long: ';
	this.longValue = document.createElement('a');
	this.longValue.id = 'posInfoSub';
	var LongDiv = document.createElement('div');
	LongDiv.appendChild(LongP);
	LongDiv.appendChild(this.longValue);
	this.infoPosition.appendChild(LongDiv);


	var AtliP = document.createElement('p');
	AtliP.innerHTML = 'Atli: ';
	this.atliValue = document.createElement('a');
	this.atliValue.id = 'posInfoSub';
	var AtliDiv = document.createElement('div');
	AtliDiv.appendChild(AtliP);
	AtliDiv.appendChild(this.atliValue);
	this.infoPosition.appendChild(AtliDiv);


	var RotatePX = document.createElement('p');
	RotatePX.innerHTML = 'Rotate x: ';
	this.rotateValueX = document.createElement('a');
	this.rotateValueX.id = 'posInfoSub';
	var RotateDivX = document.createElement('div');
	RotateDivX.appendChild(RotatePX);
	RotateDivX.appendChild(this.rotateValueX);
	this.infoPosition.appendChild(RotateDivX);

	var RotatePY = document.createElement('p');
	RotatePY.innerHTML = 'Rotate y: ';
	this.rotateValueY = document.createElement('a');
	this.rotateValueY.id = 'posInfoSub';
	var RotateDivY = document.createElement('div');
	RotateDivY.appendChild(RotatePY);
	RotateDivY.appendChild(this.rotateValueY);
	this.infoPosition.appendChild(RotateDivY);

	var RotatePZ = document.createElement('p');
	RotatePZ.innerHTML = 'Rotate z: ';
	this.rotateValueZ = document.createElement('a');
	this.rotateValueZ.id = 'posInfoSub';
	var RotateDivZ = document.createElement('div');
	RotateDivZ.appendChild(RotatePZ);
	RotateDivZ.appendChild(this.rotateValueZ);
	this.infoPosition.appendChild(RotateDivZ);


	var SizeP = document.createElement('p');
	SizeP.innerHTML = 'Scale: ';
	this.sizeValue = document.createElement('a');
	this.sizeValue.id = 'posInfoSub';
	var SizeDiv = document.createElement('div');
	SizeDiv.appendChild(SizeP);
	SizeDiv.appendChild(this.sizeValue);
	this.infoPosition.appendChild(SizeDiv);



	this.controlDiv.appendChild(this.infoPosition);






**/
