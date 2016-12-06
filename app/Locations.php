<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;


class Locations extends Model
{
    use PostgisTrait;
    protected $table = 'datamap';
    public $timestamps = false;

    protected $fillable = [
        'cfsauid',
        'pruid',
        'prname',
        'geom'
    ];

    protected $postgisFields = [
        Point::class,
        Polygon::class,
    ];

}
