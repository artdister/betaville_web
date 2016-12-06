<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;

use DB;

class Cities extends Model
{
    use PostgisTrait;
    protected $table = 'cities';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'hightmap',
        'dataset'
    ];

    protected $postgisFields = [
        Point::class,
        Polygon::class,
    ];



}
