<?php

namespace App;
use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;


class Building_comments extends Model
{
    use PostgisTrait;
    protected $table = 'building_comments';
    public $timestamps = true;

    protected $fillable = [
        'author',
        'msg'
    ];

    protected $postgisFields = [
        Point::class,
        Polygon::class,
    ];

}
