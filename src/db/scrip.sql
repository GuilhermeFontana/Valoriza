-- CRIAÇÃO DO SCHEMA
CREATE SCHEMA valoriza AUTHORIZATION postgres;

--CRIAÇÃO DAS TABELASS
CREATE TABLE valoriza.etiqueta (
	id numeric NOT NULL,
	nome varchar NOT NULL,
	dthr_criacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	dthr_atualizacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_etiqueta PRIMARY KEY (id)
);

CREATE TABLE valoriza.usuario (
	id numeric NOT NULL,
	nome varchar NOT NULL,
	email varchar NOT NULL,
	"admin" bool NOT NULL DEFAULT false,
	dthr_criacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	dthr_atualizacak information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_usuario PRIMARY KEY (id)
);

CREATE TABLE valoriza.elogio (
	id numeric NOT NULL,
	usuid_remetente numeric NOT NULL,
	usuid_destinatario numeric NOT NULL,
	etiquetaid numeric NOT NULL,
	dthr_criacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_elogio PRIMARY KEY (id),
	CONSTRAINT fk_elogio_destinatario FOREIGN KEY (usuid_destinatario) REFERENCES valoriza.usuario(id),
	CONSTRAINT fk_elogio_etiqueta FOREIGN KEY (etiquetaid) REFERENCES valoriza.etiqueta(id),
	CONSTRAINT fk_elogio_remetente FOREIGN KEY (usuid_remetente) REFERENCES valoriza.usuario(id)
);