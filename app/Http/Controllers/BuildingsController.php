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


//Class to manage buildings objects
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

	//get all Data for one city by index
	public function getCityObejcts($i){

		//get buildings from DB
		$cityobjectsData = $this->objects->getObjectsByParentIndex($i);

		//get the city vector data
		$city = $this->cities->getDataByindex($i);


		//create the view with the data
 		$sections = view('menu.sub.cityObjectList')
 							->with('data', $cityobjectsData )
 							->with('city', $city['city'])
 							->renderSections();
            
		
		return  $sections['cityObjectList'];

	}

	//get all Buildings for one city by Index
	public function getCityObjectsByIndex($i){
			
		return $this->objects->getObjectsByParentIndex($i);

	}

	//manage request for repplacing buildings
	public function buildingReplace(Request $request){

		return $this->objects->buildingReplace($request->all());

	}

	//add building to Database
	public function uploadCityObj(Request $request){

		//if request is 'get' return the HTML to add objects via the backend
		if ($request->isMethod('get')){
 			$sections = view('menu.sub.uplodCityObjForm')->renderSections();
            	
			return  $sections['uplodCityObjForm'];
		}
		
		//if request is 'post' 
		if ($request->isMethod('post')){

			//generate Path 
			$parthTOsave = 'geoData/'.$request->citySTR.'/models/cityobj/'.$request->name.'/';

			//read request and generate zip File
			$file = $request->file('fileOBJ');
			$fileSRC = $parthTOsave.$request->name.$request->objlength.'.zip';

			//save the Zip.
			$stored = Storage::disk('local')->put($fileSRC,  File::get($file));		

			//if file was saved create an DB entry
			if($stored == true){

				return $this->objects->addCityobj( $request->all(), $fileSRC);

			}
		}

	}

	//move building to Trash by ID
	public function moveBuildingToTrashByid($id){

		$dele = $this->objects->moveBuildingToTrashByid($id);
		return $id;
		
	}

	//get building from Trash by ID
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
