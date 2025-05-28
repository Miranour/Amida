--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Appointments_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Appointments_status" AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'completed'
);


ALTER TYPE public."enum_Appointments_status" OWNER TO postgres;

--
-- Name: enum_Institutions_institutionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Institutions_institutionType" AS ENUM (
    'hospital',
    'clinic',
    'other'
);


ALTER TYPE public."enum_Institutions_institutionType" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'admin',
    'user',
    'institution'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Appointments" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "institutionId" integer NOT NULL,
    date date NOT NULL,
    "time" time without time zone NOT NULL,
    "serviceType" character varying(255) NOT NULL,
    status public."enum_Appointments_status" DEFAULT 'pending'::public."enum_Appointments_status",
    notes text,
    "isActive" boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Appointments" OWNER TO postgres;

--
-- Name: Appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Appointments_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Appointments_id_seq" OWNER TO postgres;

--
-- Name: Appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Appointments_id_seq" OWNED BY public."Appointments".id;


--
-- Name: Institutions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Institutions" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "institutionName" character varying(255) NOT NULL,
    "taxNumber" character varying(255) NOT NULL,
    "institutionPhone" character varying(255) NOT NULL,
    "institutionEmail" character varying(255) NOT NULL,
    "institutionAddress" text NOT NULL,
    city character varying(255) NOT NULL,
    district character varying(255) NOT NULL,
    "institutionType" public."enum_Institutions_institutionType" NOT NULL,
    "workingHours" json NOT NULL,
    "isVerified" boolean DEFAULT false,
    "isActive" boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Institutions" OWNER TO postgres;

--
-- Name: Institutions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Institutions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Institutions_id_seq" OWNER TO postgres;

--
-- Name: Institutions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Institutions_id_seq" OWNED BY public."Institutions".id;


--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "birthDate" date NOT NULL,
    address text NOT NULL,
    city character varying(255) NOT NULL,
    district character varying(255) NOT NULL,
    role public."enum_Users_role" DEFAULT 'user'::public."enum_Users_role",
    "isActive" boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments" ALTER COLUMN id SET DEFAULT nextval('public."Appointments_id_seq"'::regclass);


--
-- Name: Institutions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Institutions" ALTER COLUMN id SET DEFAULT nextval('public."Institutions_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Appointments" (id, "userId", "institutionId", date, "time", "serviceType", status, notes, "isActive", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Institutions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Institutions" (id, "userId", "institutionName", "taxNumber", "institutionPhone", "institutionEmail", "institutionAddress", city, district, "institutionType", "workingHours", "isVerified", "isActive", created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "firstName", "lastName", email, "phoneNumber", password, "birthDate", address, city, district, role, "isActive", created_at, updated_at) FROM stdin;
1	Admin	User	admin@amida.com	5551234567	$2a$10$XKQvz8Uq8Uq8Uq8Uq8Uq8O	1990-01-01	Admin Adresi	İstanbul	Kadıköy	admin	t	2025-05-08 08:23:21.235+03	2025-05-08 08:23:21.235+03
\.


--
-- Name: Appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Appointments_id_seq"', 1, false);


--
-- Name: Institutions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Institutions_id_seq"', 1, false);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 1, true);


--
-- Name: Appointments Appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_pkey" PRIMARY KEY (id);


--
-- Name: Institutions Institutions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Institutions"
    ADD CONSTRAINT "Institutions_pkey" PRIMARY KEY (id);


--
-- Name: Institutions Institutions_taxNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Institutions"
    ADD CONSTRAINT "Institutions_taxNumber_key" UNIQUE ("taxNumber");


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_phoneNumber_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_phoneNumber_key" UNIQUE ("phoneNumber");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Appointments Appointments_institutionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES public."Institutions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Appointments Appointments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointments"
    ADD CONSTRAINT "Appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Institutions Institutions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Institutions"
    ADD CONSTRAINT "Institutions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

