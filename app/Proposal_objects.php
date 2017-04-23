<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Phaza\LaravelPostgis\Eloquent\PostgisTrait;
use Phaza\LaravelPostgis\Geometries\Point;

use Smiarowski\Postgres\Model\Traits\PostgresArray;

class Proposal_objects extends Model
{
    use PostgisTrait;

    use PostgresArray;

    protected $table = 'proposal_objects';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'author',
        'URL',
        'scale',
        'position',
        'rotation',
        'quaternion'
    ];

    protected $postgisFields = [
        Point::class,
        Polygon::class,
    ];

    //set the rotation, added via laravel-postgres module
    public function setRotation(array $value)
    {
        $this->rotation = self::mutateToPgArray($value);
    }

    //get the rotation, added via laravel-postgres module
    public function getRotation()
    {
        return self::accessPgArray($this->rotation);
    }


    //set the Quaternion, added via laravel-postgres module
    public function setQuaternion(array $value)
    {
        $this->quaternion = self::mutateToPgArray($value);
    }
    //get the Quaternion, added via laravel-postgres module
    public function getQuaternion()
    {
        return self::accessPgArray($this->quaternion);
    }


    //set the objects to hide, added via laravel-postgres module
    public function sethiddenObj(array $value)
    {
        $this->hiddenbuildings = self::mutateToPgArray($value);
    }
    //get the objects to hide, added via laravel-postgres module
    public function gethiddenObj()
    {
        return self::accessPgArray($this->hiddenbuildings);
    }

    //set the vector objects to hide , added via laravel-postgres module
    public function sethiddenObjLow(array $value)
    {
        $this->hiddenbuildingsLow = self::mutateToPgArray($value);
    }
    //get the vector objects to hide, added via laravel-postgres module
    public function gethiddenObjLow()
    {
        return self::accessPgArray($this->hiddenbuildingsLow);
    }
}
