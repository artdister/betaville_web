<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\CommentRepository;

//Class to manage Commetns objects
class CommentsController extends Controller
{	

	protected $comment;


    public function __construct(CommentRepository $comment)
    {
       
    		$this->comment = $comment;
   
    }



	public function index()
	{	
		
		return $this->comment;

	}

	//get alle commetns with the same ID
	public function getCommentsByBuildId($i){
		$data = $this->comment->getByBuildId($i);
 
		return $data;
	}

	//add a comment to a building object
	public function addBuildComment(Request $request){

		$this->comment->addComment( $request->all() );
	}

	// add a comment to a proposal building object by ID
	public function getProposalObjectComments($i){

		return $this->comment->getProposalObjectCommentsbyparentID($i);

	}

	//add a comment to a proposal building object	
	public function addProposalObjectComment(Request $request){
		return $this->comment->addProposalComment( $request->all() );
	}



	//get all comments from local pin by ID
	public function getGeoPositionComments($i){
		return $this->comment->getGeoPositionComments($i);
	}

	//add locaion pin comment
	public function addGeoPositionComments(Request $request){
		return $this->comment->addGeoPositionComments($request->all() );
	}

}