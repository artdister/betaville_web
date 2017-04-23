<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Repositories\ProposalsRepository;
use App\Repositories\CitiesRepository;

//Class to manage proposals
class ProposalsController extends Controller
{	

	protected $proposals;
    public function __construct(ProposalsRepository $proposals, CitiesRepository $cities)
    {
       
    		$this->proposals = $proposals;
    		$this->cities = $cities;

    }



	public function index()
	{	
		

	}

	//get all proposals by city ID
	public function getProposalObjects($i){

		$proposalsData = $this->proposals->getProposalByParentIndex($i);
		$city = $this->cities->getDataByindex($i);


		
 		$sections = view('menu.sub.proposalsList')
 							->with('data', $proposalsData )
 							->with('city', $city['city'])
 							->renderSections();
            
		
		return  $sections['proposalsList'];


	}

	//add a proposal to the DB
	public function addProposal(Request $request){

		$this->proposals->addProposal( $request->all() );
		
	}
	//get proposal object by ID
	public function getProposalsObjectsById($i){
		return $this->proposals->getProposalsObjectsByParentId($i);
	}

	//add proposal object to DB
	public function uploadProposalObject(Request $request){
			//generate Path
			$parthTOsave = 'geoData/'.$request->citySTR.'/models/proposals/'.$request->name.'/';

			//get the file data
			$file = $request->file('fileOBJ');
			$preImg = $request->file('fileIMG');

			//create files
			$fileSRC = $parthTOsave.$Request->name.$request->objlength.'.zip';
			$preImgSRC = $parthTOsave.$request->name.$request->objlength.'.jpg';
			
			//save files
			$storedObj = Storage::disk('local')->put($fileSRC,  File::get($file));
			$storedImg = Storage::disk('local')->put($preImgSRC,  File::get($preImg));	

			//if files saved, add DB entry
			if($storedImg == true && $storedObj == true){

				$this->proposals->addProposalObject($request->all(), $fileSRC, $preImgSRC);
			}
	}

	//get proposal by city ID
	public function getProposalByParentId($i){

		return $this->proposals->getProposalByParentIndex($i);
	}

	//move proposal object to trash
	public function moveBuildingToTrashByid($id){
		$dele = $this->proposals->moveBuildingToTrashByid($id);
		return $id;
		
	}

	//move proposal to trash
	public function moveProposalToTrashByid($id){
		$dele = $this->proposals->moveProposalToTrashByid($id);
		return $id;

	}
	
	//get all proposal objects from trash
	public function getBuildingFromTrash($city){

		
		$cityobjectsData = $this->proposals->getBuildingFromTrash($city);
		$city = $this->cities->getDataByindex($city);

 		$sections = view('menu.sub.cityObjectList')
 							->with('data', $cityobjectsData )
 							->with('city', $city['city'])
 							->renderSections();
            
		
		return  $sections['cityObjectList'];
	}

}
