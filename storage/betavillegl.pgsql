--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: building_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE building_comments (
    id integer NOT NULL,
    building_id integer NOT NULL,
    author character varying(255),
    msg text NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-15 20:18:54.666749'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    defunct boolean DEFAULT false NOT NULL
);


ALTER TABLE building_comments OWNER TO postgres;

--
-- Name: building_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE building_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE building_comments_id_seq OWNER TO postgres;

--
-- Name: building_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE building_comments_id_seq OWNED BY building_comments.id;


--
-- Name: buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE buildings (
    id integer NOT NULL,
    city_id integer NOT NULL,
    name character varying(255) NOT NULL,
    author character varying(255),
    url character varying(255) NOT NULL,
    scale double precision NOT NULL,
    atli double precision NOT NULL,
    "position" geography NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-15 20:24:21.356159'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    onscene boolean DEFAULT true NOT NULL,
    rotation double precision[],
    quaternion double precision[],
    "hiddenBuildData" character varying[] DEFAULT '{}'::character varying[] NOT NULL
);


ALTER TABLE buildings OWNER TO postgres;

--
-- Name: buildings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE buildings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE buildings_id_seq OWNER TO postgres;

--
-- Name: buildings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE buildings_id_seq OWNED BY buildings.id;


--
-- Name: buildings_trash; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE buildings_trash (
    id integer NOT NULL,
    city_id integer NOT NULL,
    name character varying(255) NOT NULL,
    author character varying(255),
    url character varying(255) NOT NULL,
    scale double precision NOT NULL,
    atli double precision NOT NULL,
    "position" geography NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    onscene boolean DEFAULT false NOT NULL,
    rotation double precision[],
    quaternion double precision[]
);


ALTER TABLE buildings_trash OWNER TO postgres;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE cities (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    hightmap character varying(255) NOT NULL,
    dataset character varying(255) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-15 20:29:22.355706'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone
);


ALTER TABLE cities OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE cities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cities_id_seq OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE cities_id_seq OWNED BY cities.id;


--
-- Name: datamap; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE datamap (
    gid integer NOT NULL,
    cfsauid character varying(3),
    pruid character varying(2),
    prname character varying(55),
    geom geometry,
    city_id integer
);


ALTER TABLE datamap OWNER TO postgres;

--
-- Name: datamap_gid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE datamap_gid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE datamap_gid_seq OWNER TO postgres;

--
-- Name: datamap_gid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE datamap_gid_seq OWNED BY datamap.gid;


--
-- Name: datasets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE datasets (
    id integer NOT NULL,
    city_id integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:08:52.776113'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    name character varying(255),
    color character varying(255) DEFAULT 'rgb(0,0,0)'::character varying NOT NULL,
    "dataSet" character varying(255)
);


ALTER TABLE datasets OWNER TO postgres;

--
-- Name: datasets_geom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE datasets_geom (
    ds_id integer,
    geom geometry,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:10:35.276725'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    id integer NOT NULL,
    osm_id character varying,
    type character varying,
    height character varying
);


ALTER TABLE datasets_geom OWNER TO postgres;

--
-- Name: datasets_geom_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE datasets_geom_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE datasets_geom_id_seq OWNER TO postgres;

--
-- Name: datasets_geom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE datasets_geom_id_seq OWNED BY datasets_geom.id;


--
-- Name: datasets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE datasets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE datasets_id_seq OWNER TO postgres;

--
-- Name: datasets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE datasets_id_seq OWNED BY datasets.id;


--
-- Name: geo__position_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE geo__position_comments (
    id integer NOT NULL,
    geo_position_id integer NOT NULL,
    author character varying(255),
    msg text,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:12:16.252368'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    defunct boolean DEFAULT false NOT NULL
);


ALTER TABLE geo__position_comments OWNER TO postgres;

--
-- Name: geo__position_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE geo__position_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geo__position_comments_id_seq OWNER TO postgres;

--
-- Name: geo__position_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE geo__position_comments_id_seq OWNED BY geo__position_comments.id;


--
-- Name: geo__positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE geo__positions (
    id integer NOT NULL,
    city_id integer NOT NULL,
    name character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    atli double precision NOT NULL,
    "position" geography NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:14:27.638668'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    onscene boolean DEFAULT true NOT NULL
);


ALTER TABLE geo__positions OWNER TO postgres;

--
-- Name: geo__positions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE geo__positions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geo__positions_id_seq OWNER TO postgres;

--
-- Name: geo__positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE geo__positions_id_seq OWNED BY geo__positions.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE locations (
    id integer NOT NULL,
    city_id integer NOT NULL,
    name character varying(255) NOT NULL,
    bbox geography NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:15:49.631501'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone
);


ALTER TABLE locations OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE locations_id_seq OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE locations_id_seq OWNED BY locations.id;


--
-- Name: proposal_object_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE proposal_object_comments (
    id integer NOT NULL,
    proposal_object_id integer NOT NULL,
    author character varying(255),
    msg text,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:17:30.940361'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    defunct boolean DEFAULT false NOT NULL
);


ALTER TABLE proposal_object_comments OWNER TO postgres;

--
-- Name: proposal_object_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE proposal_object_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE proposal_object_comments_id_seq OWNER TO postgres;

--
-- Name: proposal_object_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE proposal_object_comments_id_seq OWNED BY proposal_object_comments.id;


--
-- Name: proposal_objects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE proposal_objects (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    name character varying(255) NOT NULL,
    author character varying(255),
    url character varying(255) NOT NULL,
    "preViewImgURL" character varying(255) NOT NULL,
    scale double precision NOT NULL,
    atli double precision NOT NULL,
    "position" geography NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:21:30.319631'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    onscene boolean DEFAULT true NOT NULL,
    rotation double precision[],
    quaternion double precision[],
    hiddenbuildings integer[],
    "hiddenbuildingsLow" character varying[] DEFAULT '{}'::character varying[] NOT NULL
);


ALTER TABLE proposal_objects OWNER TO postgres;

--
-- Name: proposal_objects_trash; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE proposal_objects_trash (
    id integer NOT NULL,
    proposal_id integer NOT NULL,
    name character varying(255) NOT NULL,
    author character varying(255),
    url character varying(255) NOT NULL,
    "preViewImgURL" character varying(255) NOT NULL,
    scale double precision NOT NULL,
    atli double precision NOT NULL,
    "position" geography NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    onscene boolean DEFAULT false NOT NULL,
    rotation double precision[],
    quaternion double precision[],
    hiddenbuildings integer[]
);


ALTER TABLE proposal_objects_trash OWNER TO postgres;

--
-- Name: proposals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE proposals (
    id integer NOT NULL,
    city_id integer NOT NULL,
    name character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    atli double precision NOT NULL,
    "position" geography NOT NULL,
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:29:06.490635'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    onscene boolean DEFAULT true NOT NULL
);


ALTER TABLE proposals OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role integer DEFAULT 0 NOT NULL,
    password character varying(60) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone DEFAULT '2016-11-16 13:32:04.952919'::timestamp without time zone NOT NULL,
    updated_at timestamp(0) without time zone,
    total_logins integer,
    recent_login timestamp without time zone
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY building_comments ALTER COLUMN id SET DEFAULT nextval('building_comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY buildings ALTER COLUMN id SET DEFAULT nextval('buildings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cities ALTER COLUMN id SET DEFAULT nextval('cities_id_seq'::regclass);


--
-- Name: gid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datamap ALTER COLUMN gid SET DEFAULT nextval('datamap_gid_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datasets ALTER COLUMN id SET DEFAULT nextval('datasets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datasets_geom ALTER COLUMN id SET DEFAULT nextval('datasets_geom_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY geo__position_comments ALTER COLUMN id SET DEFAULT nextval('geo__position_comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY geo__positions ALTER COLUMN id SET DEFAULT nextval('geo__positions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY locations ALTER COLUMN id SET DEFAULT nextval('locations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY proposal_object_comments ALTER COLUMN id SET DEFAULT nextval('proposal_object_comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: building_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY building_comments (id, building_id, author, msg, created_at, updated_at, defunct) FROM stdin;
\.


--
-- Name: building_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('building_comments_id_seq', 1, false);


--
-- Data for Name: buildings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY buildings (id, city_id, name, author, url, scale, atli, "position", created_at, updated_at, onscene, rotation, quaternion, "hiddenBuildData") FROM stdin;
1	1	Build:hauptbahnhof	root	geoData/Bremen/models/cityobj/hauptbahnhof/hauptbahnhof0.zip	0.280000001192093007	284.392999999999972	0101000020E6100000D7C1C1DEC4A02140EA5A7B9FAA8A4A40	2016-11-15 20:24:21	\N	t	{0,0,0}	{0,0,0,1}	{}
\.


--
-- Name: buildings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('buildings_id_seq', 1, true);


--
-- Data for Name: buildings_trash; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY buildings_trash (id, city_id, name, author, url, scale, atli, "position", created_at, updated_at, onscene, rotation, quaternion) FROM stdin;
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY cities (id, name, hightmap, dataset, created_at, updated_at) FROM stdin;
1	Bremen	geoData/Bremen/bre_dsc150.zip	geoData/Bremen/citys/geoData.json	2016-11-15 20:29:22	\N
\.


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('cities_id_seq', 1, true);


--
-- Data for Name: datamap; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY datamap (gid, cfsauid, pruid, prname, geom, city_id) FROM stdin;
\.


--
-- Name: datamap_gid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('datamap_gid_seq', 1, false);


--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY datasets (id, city_id, created_at, updated_at, name, color, "dataSet") FROM stdin;
\.


--
-- Data for Name: datasets_geom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY datasets_geom (ds_id, geom, created_at, updated_at, id, osm_id, type, height) FROM stdin;
\.


--
-- Name: datasets_geom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('datasets_geom_id_seq', 1, false);


--
-- Name: datasets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('datasets_id_seq', 1, false);


--
-- Data for Name: geo__position_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY geo__position_comments (id, geo_position_id, author, msg, created_at, updated_at, defunct) FROM stdin;
\.


--
-- Name: geo__position_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('geo__position_comments_id_seq', 1, false);


--
-- Data for Name: geo__positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY geo__positions (id, city_id, name, author, atli, "position", created_at, updated_at, onscene) FROM stdin;
\.


--
-- Name: geo__positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('geo__positions_id_seq', 1, false);


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY locations (id, city_id, name, bbox, created_at, updated_at) FROM stdin;
\.


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('locations_id_seq', 1, false);


--
-- Data for Name: proposal_object_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY proposal_object_comments (id, proposal_object_id, author, msg, created_at, updated_at, defunct) FROM stdin;
\.


--
-- Name: proposal_object_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('proposal_object_comments_id_seq', 1, false);


--
-- Data for Name: proposal_objects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY proposal_objects (id, proposal_id, name, author, url, "preViewImgURL", scale, atli, "position", created_at, updated_at, onscene, rotation, quaternion, hiddenbuildings, "hiddenbuildingsLow") FROM stdin;
\.


--
-- Data for Name: proposal_objects_trash; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY proposal_objects_trash (id, proposal_id, name, author, url, "preViewImgURL", scale, atli, "position", created_at, updated_at, onscene, rotation, quaternion, hiddenbuildings) FROM stdin;
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY proposals (id, city_id, name, author, atli, "position", created_at, updated_at, onscene) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY spatial_ref_sys  FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (id, name, email, role, password, remember_token, created_at, updated_at, total_logins, recent_login) FROM stdin;
1	root	root@ro.ot	2	$2y$10$EST8vmiGUtAssV5b05AvWOJXAJdMvbTwhpcdLYQequf5iryM5H/ve	\N	2016-11-16 12:32:28	2016-11-16 12:32:28	\N	\N
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 1, true);


SET search_path = topology, pg_catalog;

--
-- Data for Name: topology; Type: TABLE DATA; Schema: topology; Owner: postgres
--

COPY topology  FROM stdin;
\.


--
-- Data for Name: layer; Type: TABLE DATA; Schema: topology; Owner: postgres
--

COPY layer  FROM stdin;
\.


SET search_path = public, pg_catalog;

--
-- Name: cities_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cities
    ADD CONSTRAINT cities_id PRIMARY KEY (id);


--
-- Name: datasets_geom_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datasets_geom
    ADD CONSTRAINT datasets_geom_id PRIMARY KEY (id);


--
-- Name: datasets_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datasets
    ADD CONSTRAINT datasets_id PRIMARY KEY (id);


--
-- Name: datasets_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datasets
    ADD CONSTRAINT datasets_city_id_fkey FOREIGN KEY (city_id) REFERENCES cities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: datasets_geom_ds_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datasets_geom
    ADD CONSTRAINT datasets_geom_ds_id_fkey FOREIGN KEY (ds_id) REFERENCES datasets(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

