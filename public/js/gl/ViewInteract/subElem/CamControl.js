function CamControl(){

	camControll = this;


	this.imgLib = {
		'compass': "../imgs/cntl/compass.png",
		'mLeft'	: "../imgs/cntl/mleft.png",
		'mUp'	: "../imgs/cntl/mup.png",
		'mDown'	: "../imgs/cntl/mdown.png",
		'mRight': "../imgs/cntl/mright.png",
		'rLeft'	: "../imgs/cntl/rleft.png",
		'rUp'	: "../imgs/cntl/rup.png",
		'rDown'	: "../imgs/cntl/rdown.png",
		'rRight': "../imgs/cntl/rright.png",
		'zIN': "../imgs/cntl/zoomin.png",
		'zOUT'	: "../imgs/cntl/zoomout.png"
	};

	this.imgLibActiv = {
		'compass': "../imgs/cntl/compass.png",
		'mLeft'	: "../imgs/cntl/mleftA.png",
		'mUp'	: "../imgs/cntl/mupA.png",
		'mDown'	: "../imgs/cntl/mdownA.png",
		'mRight': "../imgs/cntl/mrightA.png",
		'rLeft'	: "../imgs/cntl/rleftA.png",
		'rUp'	: "../imgs/cntl/rupA.png",
		'rDown'	: "../imgs/cntl/rdownA.png",
		'rRight': "../imgs/cntl/rrightA.png",
		'zIN': "../imgs/cntl/zoominA.png",
		'zOUT'	: "../imgs/cntl/zoomoutA.png"
	};
	this.imgArray = new Array();



	this.controlDIV = document.createElement('div');
	this.controlDIV.style.position = "absolute";
	this.controlDIV.style.left = "200px";
	this.controlDIV.style.top = "70px";
	this.controlDIV.style.zIndex = "10";
	this.controlDIV.style.height = "80px";
	this.controlDIV.id = "camControllDiv";
	document.getElementById('guiDiv').appendChild(this.controlDIV);


	new Motions();
	this.createUI();


}


CamControl.prototype.createUI = function() {
	var ul = document.createElement('ul');
	ul.style.padding = "0";
	ul.style.margin = "0";
	ul.style.width = "370px"

	for(var key in camControll.imgLib){


		var li = document.createElement('li');
		li.style.display = "inline-block";
		li.style.margin = "1%";	

		var tempIMG = document.createElement('img');
		if(key == 'zIN' || key == 'zOUT'){

			li.id = "zoomBTN";

		}else{

			li.id = "cntrBTN";
			
		}
		if(key == 'compass'){
			tempIMG.id = "compassCNTR";
		}
		tempIMG.src = camControll.imgLib[key];

		tempIMG.setAttribute("motion", key);
		tempIMG.onmousedown = motions.startInterval;

		tempIMG.onmouseup = function(){

			motions.runned = false;
			var key = this.getAttribute('motion');
			this.src = camControll.imgLib[key];
        	clearInterval(motions.interval);

    	}
    	tempIMG.onmouseleave = function(){


    		motions.runned = false;
    		var key = this.getAttribute('motion');
    		this.src = camControll.imgLib[key];
        	clearInterval(motions.interval);

    	}

		li.appendChild(tempIMG);
		ul.appendChild(li);

	}

	camControll.imgArray.push(ul);


	for(var i = 0; i < camControll.imgArray.length; i++){


		camControll.controlDIV.appendChild(camControll.imgArray[i]);


	}

};
