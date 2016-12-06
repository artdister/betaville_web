<?php

namespace App\Http\Controllers;

use Storage;
use App\Cities;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\CitiesRepository;
use App\Repositories\DataSetRepository;


class CitiesController extends Controller
{	

	protected $cities;


    public function __construct(CitiesRepository $cities, DataSetRepository $dataset)
    {
       
    		$this->cities = $cities;
   			$this->dataset = $dataset;
    }



	public function getAllCities()
	{	
		
		return $this->cities->getAll();

	}

	public function getCityByIndex($i){
		
		$data = $this->cities->getDataByindex($i);
		$userData = Storage::disk('local')->get($data['city']->dataset);
		
 		$sections = view('menu.leftSideMenu')->with('data', json_decode($userData, true) )
 												->with('id',$data['city']->id )
 													->with('cityData' , $data['city'])
	 													->with('locations',$data['location'] )
	 														->renderSections();
            
		return  $sections['leftSideMenu'];

	}

	public function getCityMap($i){



		$city = $this->cities->getDataByindex($i);
		$citydata = Storage::disk('local')->get($city['city']->dataset);


		$sections = view('menu.sub.cityMapList')
							->with('citydata', $citydata )
							->with('city', $city['city'])
							->renderSections();
        
	
		return  $sections['cityMapList'];

	}

	public function setMapData(Request $request){

		//$json = json_decode($request->all()['json']);
		$oName = $request->all()['objectName'];
		$cityId = $request->all()['cityID'];
		//$varName = $request->all()['varName'];
		$cityName = $request->all()['cityName'];

		return $this->dataset->addJSONtoDB($oName, $cityId, $cityName);

	}

	public function setMapDataJSON(Request $request){

		$json = json_decode($request->all()['json']);
		//$oName = $request->all()['objectName'];
		//$cityId = $request->all()['cityID'];
		$varName = $request->all()['varName'];
		//$cityName = $request->all()['cityName'];
		$ds_id = $request->all()['ds_id'];
		$geoData =  $request->all()['geoData'];
		$cityName = $request->all()['cityName'];
		$oName = $request->all()['objectName'];
		return $this->dataset->addJSONtoDBJSON($json, $varName, $ds_id, $geoData, $cityName, $oName);

	}



	public function getMapDataByCityID($id){


		return $this->dataset->getDatasetByCityID($id);

	}

	public function getCityDSByIndex($i){

		$data = $this->cities->getDataByindex($i);
		
		$userData = Storage::disk('local')->get($data['city']->dataset);
		
 		$sections = view('menu.sub.cityDataSet')->with('data', json_decode($userData, true) )->renderSections();
         
		return  $sections['cityDataSet'];

	}

	public function getMapDataGeomByID($id){

		return $this->dataset->getMapDataGeomByID($id);

	}
	public function removeMapDataByID($id){

		return $this->dataset->removeMapDataByID($id);

	}

}
