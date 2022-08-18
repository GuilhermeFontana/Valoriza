-- CRIAÇÃO DO SCHEMA
CREATE SCHEMA valoriza AUTHORIZATION postgres;

--CRIAÇÃO DAS TABELASS
CREATE TABLE valoriza.usuario (
	id numeric NOT NULL,
	nome varchar NOT NULL,
	email varchar NOT NULL,
	"admin" bool NOT NULL DEFAULT false,
	dthr_criacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	dthr_atualizacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_usuario PRIMARY KEY (id)
);
INSERT INTO valoriza.usuario (id,nome,email,"admin",dthr_criacao,dthr_atualizacao,senha) VALUES
	 (1,'Usu','usu@email.com',true,'2022-07-18 22:14:48.480','2022-07-18 22:14:48.480','$2a$08$lcHWgQ9PF/bsKAK/bQCzW.6nZodsgWWmK1yNAl1YctiT6v9KeLDD6');

CREATE TABLE valoriza.etiqueta (
	id numeric NOT NULL,
	nome varchar NOT NULL,
	senha varchar NOT NULL,
	dthr_criacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	dthr_atualizacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_etiqueta PRIMARY KEY (id)
);

CREATE TABLE valoriza.elogio (
	id numeric NOT NULL,
	remetente_id numeric NOT NULL,
	destinatario_id numeric NOT NULL,
	mensagem varchar,
	dthr_criacao information_schema."time_stamp" NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT pk_elogio PRIMARY KEY (id),
	CONSTRAINT fk_elogio_destinatario FOREIGN KEY (usuid_destinatario) REFERENCES valoriza.usuario(id) ON DELETE CASCADE,
	CONSTRAINT fk_elogio_remetente FOREIGN KEY (usuid_remetente) REFERENCES valoriza.usuario(id) ON DELETE CASCADE
);

CREATE TABLE valoriza.elogios_etiquetas (
	id serial NOT NULL,
	etiqueta_id numeric NOT NULL,
	elogio_id numeric NOT NULL,
	CONSTRAINT pk_elogios_etiquetas PRIMARY KEY (id),
	CONSTRAINT uk_elogios_etiquetas UNIQUE (elogio_id,etiqueta_id),
	CONSTRAINT fk_elogios FOREIGN KEY (elogio_id) REFERENCES valoriza.elogio(id) ON DELETE CASCADE,
	CONSTRAINT fk_etiquetas FOREIGN KEY (etiqueta_id) REFERENCES valoriza.etiqueta(id) ON DELETE CASCADE
);
