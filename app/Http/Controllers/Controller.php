<?php

namespace App\Http\Controllers;
use App;
use App\Buildings;
use App\Cities;


use Illuminate\Http\Response;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Repositories\CitiesRepository;
use App\Repositories\BuildingsRepository;
use App\Repositories\ProposalsRepository;
use App\Repositories\GeoPositionRepository;
use App\Repositories\LocationRepository;
use Auth;
use session;

use Phaza\LaravelPostgis\Geometries\Point;
use Phaza\LaravelPostgis\Eloquent\Builder;

use GeoIP;
use Timezone;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $citydata;
    protected $objects;
    protected $proposals;
    protected $datapick;
    protected $locations;
    public function __construct(CitiesRepository $cities, BuildingsRepository $objects,ProposalsRepository $proposals,GeoPositionRepository $geopos, LocationRepository $location){


        $this->cities = $cities;
        $this->objects = $objects;
        $this->proposals = $proposals;
        $this->geopositions = $geopos;
        $this->datapick = array();
        $this->locations = $location;

    }

    public function index(){





    	if(auth()->check() ){

			return view('menu.userMenu');

		}else{

			return view('menu.guestMenu');
		}


    }

    public function loadCityByIndex(Request $request, $i){


        if($request->isMethod('get')){
                set_time_limit(24000); 

            $data = $request->cookie();

            if(Auth::check()){
                $userdata = Auth::user();
            }else{
                $userdata = array();
            }





            if( array_key_exists("data", $data)){

                    $this->citydata = $this->cities->getCitybyindex($i);
                    $cityobjectsdata = $this->objects->getObjectsByParentIndexWithPostCodes($i, json_decode( $data['data']['post_code']) );
                    $props = $this->proposals->getProposalByParentIndex($i);
                    $geopos = $this->geopositions->getGeoPositionByParent($i);

                    $out = array();
                    $out['models'] = array();


                    $section = view('layouts.glayer');


                    $out['user'] = json_encode($userdata, true);
                    $out['city'] = json_encode($this->citydata);



                    if($data['data']['cityobjs'] == "true"){

                            $out['models']['buildings'] = json_encode($cityobjectsdata);
                            $out['models']['proposals'] = json_encode($props);
                            $out['models']['geopositions'] = json_encode($geopos);



                    }

                    $out['loadData'] = json_encode($data, true);



                    $section->with('data',  json_encode($out, true) );


                    return $section;


            }else{

                return redirect()->action('Controller@index');

            }




        }else if($request->isMethod('post')){

            $response = new Response();
            $response->withCookie(cookie('data', $request->all(), 60));
            return $response;




        }

    }

    public function loadDefaultData(){

        $c1 = new Cities();
        $c1->name = 'Toronto';
        $c1->hightmap = 'geoData/Torronto/toronto.xyz';
        $c1->dataset = 'geoData/Torronto/citys/geoData.json';
        //$c1->save();



        $location1 = new Buildings();
        $location1->city_id = 1;
        $location1->name = 'Build:002_centreVille';
        $location1->author = 'AD';
        $location1->URL = 'geoData/Toronto/models/cityobj/002_centreVille/002_centreVille2.zip';
        $location1->scale =  1;
        $location1->atli = 2257.589;

        $location1->position = new Point(43.648961,-79.416710);

        $location1->setRotation(array(0, 0, 0 ) );
        $location1->setQuaternion(array(1, 0, 0, 0 ) );


      //  $location1->save();



        $as = to_pg_array($location1->rotation);
        return dd($as);

    }
    /*
    public function getLocation(Request $r){



        $ip = new Request;
        $location = GeoIP::getLocation($ip->ip);



        //$build = new BuildingsRepository();
       // $build = $build->getObjectsByParentIndex(3);

       // $time = Timezone::convertFromUTC($build[0]['created_at'],App::make('location')['timezone'] );
        return dd( $location);


    }
*/
    public function mapLocation(Request $r){

        $out = $this->locations->getPosByID(1);

        return $out;

    }
}
