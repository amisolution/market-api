-- Table: public.contracts

-- DROP TABLE public.contracts;

CREATE TABLE public.contracts
(
    name character varying(255) COLLATE pg_catalog."default",
    address character varying(255) COLLATE pg_catalog."default",
    collateral_token_name character varying(255) COLLATE pg_catalog."default",
    collateral_token_symbol character varying(255) COLLATE pg_catalog."default",
    collateral_token_address character varying(255) COLLATE pg_catalog."default",
    oracle_query text COLLATE pg_catalog."default",
    is_settled boolean,
    collateral_pool_balance bigint,
    expiration_timestamp bigint,
    price_cap bigint,
    price_floor bigint,
    price_decimal_places integer,
    last_trade_price bigint,
    last_queried_price bigint,
    qty_multiplier bigint,
    reference_asset character varying(255) COLLATE pg_catalog."default",
    is_whitelisted boolean,
    id bigint NOT NULL DEFAULT nextval('contracts_id_seq'::regclass),
    CONSTRAINT id PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.contracts
    OWNER to mpadmin;

-- Index: address

-- DROP INDEX public.address;

CREATE INDEX address
    ON public.contracts USING btree
    (address COLLATE pg_catalog."default")
    TABLESPACE pg_default;

-- Index: name

-- DROP INDEX public.name;

CREATE INDEX name
    ON public.contracts USING btree
    (name COLLATE pg_catalog."default")
    TABLESPACE pg_default;