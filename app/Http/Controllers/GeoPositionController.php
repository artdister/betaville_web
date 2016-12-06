<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\GeoPositionRepository;


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


	public function addGeoPosition(Request $request){
		$this->geopos->addGeoPosition($request->all() );

	}

	public function getGeoPositionByParent($i){
		return $this->geopos->getGeoPositionByParent($i);
	}

	public function moveGeoPositionToTrashByid($id){
		$dele = $this->geopos->moveGeoPositionToTrashByid($id);
		return $id;

	}

}