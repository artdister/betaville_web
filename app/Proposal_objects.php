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

    public function setRotation(array $value)
    {
        $this->rotation = self::mutateToPgArray($value);
    }
    public function getRotation()
    {
        return self::accessPgArray($this->rotation);
    }


    public function setQuaternion(array $value)
    {
        $this->quaternion = self::mutateToPgArray($value);
    }
    public function getQuaternion()
    {
        return self::accessPgArray($this->quaternion);
    }

    public function sethiddenObj(array $value)
    {
        $this->hiddenbuildings = self::mutateToPgArray($value);
    }
    public function gethiddenObj()
    {
        return self::accessPgArray($this->hiddenbuildings);
    }

    public function sethiddenObjLow(array $value)
    {
        $this->hiddenbuildingsLow = self::mutateToPgArray($value);
    }
    public function gethiddenObjLow()
    {
        return self::accessPgArray($this->hiddenbuildingsLow);
    }
}
