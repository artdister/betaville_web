<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;


class Proposal_object_comments extends Model
{
    use PostgisTrait;
    protected $table = 'proposal_object_comments';
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
