<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\GeoPositionRepository;

//Class to manage location pins objects
class GeoPositionController extends Controller
{	

	protected $geopos;


    public function __construct(GeoPositionRepository $geopos)
    {
       
    		$this->geopos = $geopos;
   
    }



	public function index()
	{	
		
		return $this->geopos;

	}

	//add location pin DB entry
	public function addGeoPosition(Request $request){
		$this->geopos->addGeoPosition($request->all() );

	}

	//get locaion pins via city ID
	public function getGeoPositionByParent($i){
		return $this->geopos->getGeoPositionByParent($i);
	}

	//move locaion pin to trash
	public function moveGeoPositionToTrashByid($id){
		$dele = $this->geopos->moveGeoPositionToTrashByid($id);
		return $id;

	}

}