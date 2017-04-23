<?php namespace Phaza\LaravelPostgis\Geometries;

use GeoJson\GeoJson;

class Point3D extends Geometry
{
    protected $lat;
    protected $lng;

    public function __construct($lat, $lng, $atli)
    {
        $this->lat = (float)$lat;
        $this->lng = (float)$lng;
        $this->atli = (float)$atli;
    }

    public function getLat()
    {
        return $this->lat;
    }
    public function setLat($lat)
    {
        $this->lat = (float)$lat;
    }


    public function getLng()
    {
        return $this->lng;
    }
    public function setLng($lng)
    {
        $this->lng = (float)$lng;
    }


    public function getAtli()
    {
        return $this->atli;
    }
    public function setAtli($atli)
    {
        $this->atli = (float)$atli;
    }

    public function toPair()
    {
        return $this->getLng() . ' ' . $this->getLat() . ' '. $this->getAtli();
    }

    public static function fromPair($pair)
    {
        list($lng, $lat, $atli) = explode(' ', trim($pair));

        return new static((float)$lat, (float)$lng);
    }

    public function toWKT()
    {
        return sprintf('POINT(%s)', (string)$this);
    }

    public static function fromString($wktArgument)
    {
        return static::fromPair($wktArgument);
    }

    public function __toString()
    {
        return $this->getLng() . ' ' . $this->getLat() . ' ' . $this->atli;
    }

    /**
     * Convert to GeoJson Point that is jsonable to GeoJSON
     *
     * @return \GeoJson\Geometry\Point
     */
    public function jsonSerialize()
    {
        return new \GeoJson\Geometry\Point([$this->getLng(), $this->getLat(), $this->getAtli()]);
    }
}
