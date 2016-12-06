<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\CommentRepository;


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

	public function getCommentsByBuildId($i){
		$data = $this->comment->getByBuildId($i);
 
		return $data;
	}
	public function addBuildComment(Request $request){

		$this->comment->addComment( $request->all() );
	}


	public function getProposalObjectComments($i){

		return $this->comment->getProposalObjectCommentsbyparentID($i);

	}
	public function addProposalObjectComment(Request $request){
		return $this->comment->addProposalComment( $request->all() );
	}




	public function getGeoPositionComments($i){
		return $this->comment->getGeoPositionComments($i);
	}
	public function addGeoPositionComments(Request $request){
		return $this->comment->addGeoPositionComments($request->all() );
	}

}