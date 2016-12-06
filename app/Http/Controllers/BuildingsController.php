<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\Controller;
use App\Repositories\BuildingsRepository;
use App\Repositories\CitiesRepository;



class BuildingsController extends Controller
{	

	protected $objects;
	protected $cityId;

    public function __construct(BuildingsRepository $objects, CitiesRepository $cities)
    {
       
    		$this->objects = $objects;
   			$this->cities = $cities;
   			$this->cityId;
    }



	public function index()
	{	
		
		return $this->objects;

	}

	public function getCityObejcts($i){


		$cityobjectsData = $this->objects->getObjectsByParentIndex($i);
		$city = $this->cities->getDataByindex($i);


	
 		$sections = view('menu.sub.cityObjectList')
 							->with('data', $cityobjectsData )
 							->with('city', $city['city'])
 							->renderSections();
            
		
		return  $sections['cityObjectList'];

	}

	public function getCityObjectsByIndex($i){
			
		return $this->objects->getObjectsByParentIndex($i);

	}

	public function buildingReplace(Request $request){

		return $this->objects->buildingReplace($request->all());

	}

	public function uploadCityObj(Request $request){
		if ($request->isMethod('get')){
 			$sections = view('menu.sub.uplodCityObjForm')->renderSections();
            	
			return  $sections['uplodCityObjForm'];
		}
		
		if ($request->isMethod('post')){
			$parthTOsave = 'geoData/'.$request->citySTR.'/models/cityobj/'.$request->name.'/';


			$file = $request->file('fileOBJ');
			$fileSRC = $parthTOsave.$request->name.$request->objlength.'.zip';

				

			$stored = Storage::disk('local')->put($fileSRC,  File::get($file));		

			if($stored == true){

				return $this->objects->addCityobj( $request->all(), $fileSRC);

			}
		}

	}

	public function moveBuildingToTrashByid($id){

		$dele = $this->objects->moveBuildingToTrashByid($id);
		return $id;
		
	}


	public function getBuildingFromTrash($city){
		$cityobjectsData = $this->objects->getBuildingFromTrash($city);
		$city = $this->cities->getDataByindex($city);

 		$sections = view('menu.sub.cityObjectList')
 							->with('data', $cityobjectsData )
 							->with('city', $city['city'])
 							->renderSections();
            
		
		return  $sections['cityObjectList'];
	}
}
