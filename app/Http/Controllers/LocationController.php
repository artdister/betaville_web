<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests;
use Config;
use App;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;

use App\Repositories\LocationRepository;

use GeoIP;

//Class to manage locations objects
class LocationController extends Controller
{

	protected $locations;
    public function __construct(LocationRepository $location){


        $this->locations = $location;

    }

    //get the location from user IP
    public function getTimeLocation()
    {
        $ip = new Request;
        $location = GeoIP::getLocation($ip->ip);
        return $location;
    }

    //get the vector locations
    public function getCitySections(Request $r)
    {
    	$out = $this->locations->getLocationsByCityID($r->id);

    	return $out;

    }
}