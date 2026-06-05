--
-- PostgreSQL database dump
--

\restrict NamcZzHDp6IQ2aYfEvL4P4P5JJBpzDuRSiueDgdCX9LNIUCns4YhtZhcUSeMRqV

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.2

-- Started on 2026-06-02 08:44:26 CEST

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
-- TOC entry 220 (class 1259 OID 16389)
-- Name: boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boards (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.boards OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16388)
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
-- TOC entry 3921 (class 0 OID 0)
-- Dependencies: 219
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.boards_id_seq OWNED BY public.boards.id;


--
-- TOC entry 227 (class 1259 OID 16453)
-- Name: card_labels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.card_labels (
    card_id integer NOT NULL,
    label_id integer NOT NULL
);


ALTER TABLE public.card_labels OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16420)
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
-- TOC entry 223 (class 1259 OID 16419)
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
-- TOC entry 3922 (class 0 OID 0)
-- Dependencies: 223
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- TOC entry 222 (class 1259 OID 16400)
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
-- TOC entry 221 (class 1259 OID 16399)
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
-- TOC entry 3923 (class 0 OID 0)
-- Dependencies: 221
-- Name: columns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.columns_id_seq OWNED BY public.columns.id;


--
-- TOC entry 229 (class 1259 OID 16485)
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
-- TOC entry 228 (class 1259 OID 16484)
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
-- TOC entry 3924 (class 0 OID 0)
-- Dependencies: 228
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 226 (class 1259 OID 16442)
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
-- TOC entry 225 (class 1259 OID 16441)
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
-- TOC entry 3925 (class 0 OID 0)
-- Dependencies: 225
-- Name: labels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.labels_id_seq OWNED BY public.labels.id;


--
-- TOC entry 3719 (class 2604 OID 16392)
-- Name: boards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards ALTER COLUMN id SET DEFAULT nextval('public.boards_id_seq'::regclass);


--
-- TOC entry 3723 (class 2604 OID 16423)
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- TOC entry 3721 (class 2604 OID 16403)
-- Name: columns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns ALTER COLUMN id SET DEFAULT nextval('public.columns_id_seq'::regclass);


--
-- TOC entry 3727 (class 2604 OID 16488)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 3725 (class 2604 OID 16445)
-- Name: labels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels ALTER COLUMN id SET DEFAULT nextval('public.labels_id_seq'::regclass);


--
-- TOC entry 3906 (class 0 OID 16389)
-- Dependencies: 220
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.boards (id, name, created_at) FROM stdin;
1	board1	2026-04-27 20:34:15.144106
2	board2	2026-04-27 20:34:59.076642
\.


--
-- TOC entry 3913 (class 0 OID 16453)
-- Dependencies: 227
-- Data for Name: card_labels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.card_labels (card_id, label_id) FROM stdin;
\.


--
-- TOC entry 3910 (class 0 OID 16420)
-- Dependencies: 224
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cards (id, column_id, title, description, due_date, "position", created_at) FROM stdin;
13	13	card1	\N	\N	100	2026-06-01 09:36:17.739143
14	13	card2	\N	\N	200	2026-06-01 09:36:17.753867
1	1	Test card	\N	\N	1	2026-04-27 21:09:49.577976
11	1	test-card	\N	\N	2	2026-06-01 09:33:56.932913
12	1	test-card-2	\N	\N	3	2026-06-01 09:34:11.843515
15	1	new-card	\N	\N	4	2026-06-01 10:13:33.034623
\.


--
-- TOC entry 3908 (class 0 OID 16400)
-- Dependencies: 222
-- Data for Name: columns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.columns (id, board_id, name, "position", created_at) FROM stdin;
2	1	column2	100	2026-04-27 20:38:48.563709
1	1	column1	200	2026-04-27 20:37:06.302596
12	1	test-col	300	2026-06-01 09:33:56.893092
13	1	new-col	400	2026-06-01 09:36:17.69616
14	1	another-col	500	2026-06-01 09:36:17.718399
\.


--
-- TOC entry 3915 (class 0 OID 16485)
-- Dependencies: 229
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, card_id, content, created_at) FROM stdin;
\.


--
-- TOC entry 3912 (class 0 OID 16442)
-- Dependencies: 226
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.labels (id, name, color, board_id, created_at) FROM stdin;
4	urgent	#ff0000	1	2026-05-28 13:21:10.988391
\.


--
-- TOC entry 3926 (class 0 OID 0)
-- Dependencies: 219
-- Name: boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.boards_id_seq', 8, true);


--
-- TOC entry 3927 (class 0 OID 0)
-- Dependencies: 223
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cards_id_seq', 15, true);


--
-- TOC entry 3928 (class 0 OID 0)
-- Dependencies: 221
-- Name: columns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.columns_id_seq', 14, true);


--
-- TOC entry 3929 (class 0 OID 0)
-- Dependencies: 228
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 2, true);


--
-- TOC entry 3930 (class 0 OID 0)
-- Dependencies: 225
-- Name: labels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.labels_id_seq', 4, true);


--
-- TOC entry 3730 (class 2606 OID 16398)
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- TOC entry 3747 (class 2606 OID 16459)
-- Name: card_labels card_labels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_labels
    ADD CONSTRAINT card_labels_pkey PRIMARY KEY (card_id, label_id);


--
-- TOC entry 3737 (class 2606 OID 16435)
-- Name: cards cards_column_id_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_column_id_position_key UNIQUE (column_id, "position");


--
-- TOC entry 3739 (class 2606 OID 16433)
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- TOC entry 3732 (class 2606 OID 16413)
-- Name: columns columns_board_id_position_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_board_id_position_key UNIQUE (board_id, "position");


--
-- TOC entry 3734 (class 2606 OID 16411)
-- Name: columns columns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);


--
-- TOC entry 3750 (class 2606 OID 16497)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 3743 (class 2606 OID 16481)
-- Name: labels labels_board_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_board_id_name_key UNIQUE (board_id, name);


--
-- TOC entry 3745 (class 2606 OID 16450)
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- TOC entry 3748 (class 1259 OID 16472)
-- Name: idx_card_labels_label_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_card_labels_label_id ON public.card_labels USING btree (label_id);


--
-- TOC entry 3740 (class 1259 OID 16471)
-- Name: idx_cards_column_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cards_column_id ON public.cards USING btree (column_id);


--
-- TOC entry 3735 (class 1259 OID 16470)
-- Name: idx_columns_board_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_columns_board_id ON public.columns USING btree (board_id);


--
-- TOC entry 3751 (class 1259 OID 16503)
-- Name: idx_comments_card_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_card_id ON public.comments USING btree (card_id);


--
-- TOC entry 3741 (class 1259 OID 16504)
-- Name: idx_labels_board_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_labels_board_id ON public.labels USING btree (board_id);


--
-- TOC entry 3755 (class 2606 OID 16460)
-- Name: card_labels card_labels_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_labels
    ADD CONSTRAINT card_labels_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE CASCADE;


--
-- TOC entry 3756 (class 2606 OID 16465)
-- Name: card_labels card_labels_label_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.card_labels
    ADD CONSTRAINT card_labels_label_id_fkey FOREIGN KEY (label_id) REFERENCES public.labels(id) ON DELETE CASCADE;


--
-- TOC entry 3753 (class 2606 OID 16436)
-- Name: cards cards_column_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


--
-- TOC entry 3752 (class 2606 OID 16414)
-- Name: columns columns_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- TOC entry 3757 (class 2606 OID 16498)
-- Name: comments comments_card_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE CASCADE;


--
-- TOC entry 3754 (class 2606 OID 16475)
-- Name: labels labels_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


-- Completed on 2026-06-02 08:44:26 CEST

--
-- PostgreSQL database dump complete
--

\unrestrict NamcZzHDp6IQ2aYfEvL4P4P5JJBpzDuRSiueDgdCX9LNIUCns4YhtZhcUSeMRqV

