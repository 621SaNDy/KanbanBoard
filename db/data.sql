--
-- PostgreSQL database dump
--

\restrict 8pYyrCiRPHcwhRS1JkDfQtzaqicIec3sYuznhSSuzK7IRefNr6U3UJU5hza5O8N

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boards (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.boards OWNER TO postgres;

--
-- Name: boards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boards_id_seq OWNER TO postgres;

--
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.boards_id_seq OWNED BY public.boards.id;


--
-- Name: card_labels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card_labels (
    card_id integer NOT NULL,
    label_id integer NOT NULL
);


ALTER TABLE public.card_labels OWNER TO postgres;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cards (
    id integer NOT NULL,
    column_id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    due_date date,
    "position" integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cards OWNER TO postgres;

--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cards_id_seq OWNER TO postgres;

--
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- Name: columns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.columns (
    id integer NOT NULL,
    board_id integer NOT NULL,
    name character varying(120) NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.columns OWNER TO postgres;

--
-- Name: columns_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.columns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.columns_id_seq OWNER TO postgres;

--
-- Name: columns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.columns_id_seq OWNED BY public.columns.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    card_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: labels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.labels (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    color character varying(20) NOT NULL,
    board_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.labels OWNER TO postgres;

--
-- Name: labels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.labels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.labels_id_seq OWNER TO postgres;

--
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.labels_id_seq OWNED BY public.labels.id;


--
-- Name: boards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards ALTER COLUMN id SET DEFAULT nextval('public.boards_id_seq'::regclass);


--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- Name: columns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns ALTER COLUMN id SET DEFAULT nextval('public.columns_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels ALTER COLUMN id SET DEFAULT nextval('public.labels_id_seq'::regclass);


--
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.boards (id, name, created_at) FROM stdin;
9	Perfectly Normal List Of Things To Do	2026-06-05 14:34:29.047849
10	poor board	2026-06-05 14:50:30.387403
\.


--
-- Data for Name: card_labels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card_labels (card_id, label_id) FROM stdin;
18	5
20	6
17	6
17	8
16	5
16	9
19	5
16	6
20	9
20	10
\.


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cards (id, column_id, title, description, due_date, "position", created_at) FROM stdin;
25	21	or comments		\N	4	2026-06-05 14:53:06.638726
26	21	all budget went into the first one		\N	5	2026-06-05 14:53:34.779135
19	19	Check for XSS		\N	2	2026-06-05 14:43:57.87814
16	19	Do the Docker thingy	I guess it's better than Postgresing with 5 different versions on raw metal, but we gotta download more RAAAAM	2026-06-06	1	2026-06-05 14:39:08.899537
17	18	Go to sleep	Feels good this whole sleeping thing. Watching Spider-Noir til 2 AM feels better tho-	2026-06-04	1	2026-06-05 14:41:06.06595
18	15	Go look for more bugs	Naaaaaahhh, it's fiiiiiineeee, nothing will explooooode	2026-06-09	1	2026-06-05 14:43:03.687727
20	15	Study for INF04	I swear to HolyC, if there's PySide I'mma look for an open window	2026-06-15	2	2026-06-05 14:46:16.562457
24	20	hello there		\N	1	2026-06-05 14:52:39.980643
21	21	we don't have money for capital letters too		\N	1	2026-06-05 14:51:35.536968
22	21	and for labels either		\N	2	2026-06-05 14:52:25.655483
23	21	or descriptions		\N	3	2026-06-05 14:52:34.843268
\.


--
-- Data for Name: columns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.columns (id, board_id, name, "position", created_at) FROM stdin;
15	9	Will anyone even bother?	100	2026-06-05 14:35:34.554543
16	9	Wth, something's happening?	1100	2026-06-05 14:35:47.576636
18	9	In progress, how exciting!	2100	2026-06-05 14:36:32.262938
19	9	You thought we test things? Done!	3100	2026-06-05 14:36:43.258209
21	10	second poor column (we don't have money for a third one)	1100	2026-06-05 14:51:09.613324
20	10	first poor column	100	2026-06-05 14:50:49.453315
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, card_id, content, created_at) FROM stdin;
4	19	<b>Hello there</b>	2026-06-05 14:44:52.533192
5	19	<script>alert("I'm better than that, yk")</script>	2026-06-05 14:45:18.375736
6	17	My educated research provided me with a conclusion that sleep is solely voluntary and can be substituted with a high enough amount of cola	2026-06-05 14:56:34.87608
\.


--
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.labels (id, name, color, board_id, created_at) FROM stdin;
5	skul	#0061ff	9	2026-06-05 14:54:04.624866
6	actually importante	#ff4013	9	2026-06-05 14:54:18.841168
8	not skul	#232323	9	2026-06-05 14:54:58.900027
9	programien	#00f900	9	2026-06-05 14:57:06.956937
10	kinda skul	#ff40ff	9	2026-06-05 14:57:54.082308
\.


--
-- Name: boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.boards_id_seq', 10, true);


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cards_id_seq', 26, true);


--
-- Name: columns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.columns_id_seq', 21, true);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 6, true);


--
-- Name: labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.labels_id_seq', 10, true);


--
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- Name: card_labels card_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_labels
    ADD CONSTRAINT card_labels_pkey PRIMARY KEY (card_id, label_id);


--
-- Name: cards cards_column_id_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_column_id_position_key UNIQUE (column_id, "position");


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: columns columns_board_id_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_board_id_position_key UNIQUE (board_id, "position");


--
-- Name: columns columns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: labels labels_board_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_board_id_name_key UNIQUE (board_id, name);


--
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- Name: idx_card_labels_label_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_card_labels_label_id ON public.card_labels USING btree (label_id);


--
-- Name: idx_cards_column_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cards_column_id ON public.cards USING btree (column_id);


--
-- Name: idx_columns_board_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_columns_board_id ON public.columns USING btree (board_id);


--
-- Name: idx_comments_card_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_card_id ON public.comments USING btree (card_id);


--
-- Name: idx_labels_board_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_labels_board_id ON public.labels USING btree (board_id);


--
-- Name: card_labels card_labels_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_labels
    ADD CONSTRAINT card_labels_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE CASCADE;


--
-- Name: card_labels card_labels_label_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_labels
    ADD CONSTRAINT card_labels_label_id_fkey FOREIGN KEY (label_id) REFERENCES public.labels(id) ON DELETE CASCADE;


--
-- Name: cards cards_column_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


--
-- Name: columns columns_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- Name: comments comments_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE CASCADE;


--
-- Name: labels labels_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 8pYyrCiRPHcwhRS1JkDfQtzaqicIec3sYuznhSSuzK7IRefNr6U3UJU5hza5O8N

