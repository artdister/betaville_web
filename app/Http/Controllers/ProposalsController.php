<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Repositories\ProposalsRepository;
use App\Repositories\CitiesRepository;

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

	public function getProposalObjects($i){

		$proposalsData = $this->proposals->getProposalByParentIndex($i);
		$city = $this->cities->getDataByindex($i);


		
 		$sections = view('menu.sub.proposalsList')
 							->with('data', $proposalsData )
 							->with('city', $city['city'])
 							->renderSections();
            
		
		return  $sections['proposalsList'];


	}


	public function addProposal(Request $request){

		$this->proposals->addProposal( $request->all() );
		
	}
	public function getProposalsObjectsById($i){
		return $this->proposals->getProposalsObjectsByParentId($i);
	}

	public function uploadProposalObject(Request $request){
			$parthTOsave = 'geoData/'.$request->citySTR.'/models/proposals/'.$request->name.'/';

			$file = $request->file('fileOBJ');
			$preImg = $request->file('fileIMG');


			$fileSRC = $parthTOsave.$request->name.$request->objlength.'.zip';
			$preImgSRC = $parthTOsave.$request->name.$request->objlength.'.jpg';
			

			$storedObj = Storage::disk('local')->put($fileSRC,  File::get($file));
			$storedImg = Storage::disk('local')->put($preImgSRC,  File::get($preImg));	

			if($storedImg == true && $storedObj == true){

				$this->proposals->addProposalObject($request->all(), $fileSRC, $preImgSRC);
			}
	}

	public function getProposalByParentId($i){

		return $this->proposals->getProposalByParentIndex($i);
	}

	public function moveBuildingToTrashByid($id){
		$dele = $this->proposals->moveBuildingToTrashByid($id);
		return $id;
		
	}

	public function moveProposalToTrashByid($id){
		$dele = $this->proposals->moveProposalToTrashByid($id);
		return $id;

	}
	
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
