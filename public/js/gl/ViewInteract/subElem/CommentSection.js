function CommentSection(){
	this.CommentsBody  = document.createElement('div');
	this.CommentsBody.id = 'Comments-Body';

	this.metaObj = {
		'Name': '-',
		'File name': '-',
		'Date uploaded': '-',
		'Creator': '-',
		'Editable': 'NO',
		'url': '-'
	};

/*


	this.metaObj = {
		transMetaObj['name']; : '-',
		transMetaObj['filename']; : '-',
		transMetaObj['dateuploaded'] : '-',
		transMetaObj['creator'] : '-',
		transMetaObj['editable'] : 'NO',
		transMetaObj['url'] : '-'
	};

*/
	var addCommentContainer = document.createElement('div');
	addCommentContainer.id = "addCommentContainer";
	//addCommentContainer.innerHTML = "<p style='color:white;float:left;'>Comments</p>";

	var commentsINput = document.createElement('div');
	commentsINput.id = 'commentsInputDiv';


	this.objectNameHTML = document.createElement('p');
	this.objectNameHTML.style.color = 'white'
	this.objectNameHTML.style.float = 'left';

	commentsINput.appendChild(this.objectNameHTML);


	if(typeof loadingData['user'].role != 'undefined'){
		this.userCommentIN = document.createElement('textarea');
		this.userCommentIN.placeholder  = transCS['placeholder'];
		this.userCommentIN.id = "UserComment";
		commentsINput.appendChild(this.userCommentIN);

		this.userCommentButton = document.createElement("input");
		this.userCommentButton.type = "button";
		this.userCommentButton.value = transCS['public'];
		this.userCommentButton.id = "UserCommentButton";
		this.userCommentButton.className = 'greenbtn';
		this.userCommentButton.setAttribute("onclick", 'thatGUI.commetnSec.addCommentTODB()');

		commentsINput.appendChild(this.userCommentButton);
	}

	this.CommentsBody.appendChild(commentsINput);
	this.commentsDiv = document.createElement("div");
	this.commentsDiv.id = "CommentsDiv";
	this.CommentsBody.appendChild(this.commentsDiv);

	this.createMetaData();

}

CommentSection.prototype.createMetaData = function(){

	//console.log(transMetaObj);
	//console.log(typeof(this.metaTableDiv));

	if(typeof(this.metaTableDiv) == 'object'){
		this.metaTableDiv.parentElement.removeChild(this.metaTableDiv);
	}

	this.metaTableDiv = document.createElement('div');
	this.metaTableDiv.id = 'metaTableDiv';

	this.metaTable = document.createElement('table');


	for(var k in transMetaObj){
		var tr = document.createElement('TR');
        this.metaTable.appendChild(tr);

        var infoTD = document.createElement('TD');
        var infoTDP = document.createElement('p');
        infoTDP.innerHTML = transMetaObj[k];
        infoTD.appendChild(infoTDP );
        tr.appendChild(infoTD);

        var vauleTD = document.createElement('TD');
        vauleTD.id = 'value';
        var vauleTDP = document.createElement('p');
        vauleTDP.innerHTML = this.metaObj[k];
        vauleTD.appendChild(vauleTDP );
        tr.appendChild(vauleTD);


	//	console.log(k, this.metaObj[k], Object.keys(this.metaObj).length);
	}
	this.metaTableDiv.appendChild(this.metaTable);
	this.CommentsBody.appendChild(this.metaTableDiv);
}

CommentSection.prototype.updateMeta = function(obj){
	var tds = this.metaTable.getElementsByTagName("td");

	if(this.pickedCommentType == 'cityObject'){
		var list = loadingData['models']['buildings'].high;
	}else
	if(this.pickedCommentType == 'proposalObject'){
		var list = thatGUI.openProposalList;
	}else
	if(this.pickedCommentType == 'geoPosObject'){
		var list = loadingData['models']['geopositions'];
	}
	if(list){
		for(var i = 0; i < list.length;i++){
		//	console.log(list[i].id, obj.userData.id);
			if(list[i].id == obj.userData.id){

				var rawObj = list[i];

			}
		}
		for(var i = 0; i < tds.length;i++){
				if(tds[i].id == 'value'){
					if(i == 1){
						tds[i].innerHTML = '<p>'+rawObj.name+'</p>'
					}
					if(i == 3){
						if(rawObj.URL){
							tds[i].innerHTML = '<p>'+rawObj.URL.split('/')[rawObj.URL.split('/').length-1]+'</p>'
						}else{
							tds[i].innerHTML = '<p>-</p>'
						}

					}
					if(i == 5){
						tds[i].innerHTML = '<p>'+rawObj.created_at+'</p>'
					}
					if(i == 7){
						tds[i].innerHTML = '<p>'+rawObj.author+'</p>'
					}
					if(i == 9){
						tds[i].innerHTML = '<p>No</p>'
					}
					if(i == 11){
						if(rawObj.URL){
							tds[i].innerHTML = '<p>'+rawObj.URL+'</p>'
						}else{
							tds[i].innerHTML = '<p>-</p>'
						}
					}
				//	console.log(tds[i], i);
				}


		}
	}
}
CommentSection.prototype.addCommentToDiv = function(obj){

	var commentcontainer = document.createElement("div");
	commentcontainer.id = "commentContainer";


	//add Values from JSON file = obj
	var buildID = document.createElement("p")
	buildID.id = "buildID";
	buildID.innerHTML = "Building ID: ";
	buildID.innerHTML += obj.buildID;
	//commentcontainer.appendChild(buildID);

	var user = document.createElement("p");
	user.id = "commentUser";
	user.innerHTML += obj.author+" "+obj.created_at;
	commentcontainer.appendChild(user);

	var text = document.createElement("p");
	text.id = "commentText";
	text.innerHTML = obj.msg;
	commentcontainer.appendChild(text);

	this.commentsDiv.appendChild(commentcontainer);
}

CommentSection.prototype.closeComments = function(){
	//hide Comments Body

	this.CommentsBody.style.display = "none";

	//clear the DiV
	this.commentsDiv.innerHTML = "";
}
