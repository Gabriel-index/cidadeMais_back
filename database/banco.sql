CREATE DATABASE cidades_mais;
USE cidades_mais;

CREATE TABLE cidadao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  cep VARCHAR(8) NOT NULL,
  bairro VARCHAR(80),
  cidade VARCHAR(80),
  estado CHAR(2),
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prefeitura (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome_orgao VARCHAR(150) NOT NULL,
  secretaria VARCHAR(150),
  email_institucional VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  gestor_responsavel VARCHAR(120),
  cidade VARCHAR(80),
  estado CHAR(2),
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problema (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT NOT NULL,
  imagem_url VARCHAR(255),
  status ENUM('reportado','em_andamento','concluido') NOT NULL DEFAULT 'reportado',
  endereco VARCHAR(200) NOT NULL,
  bairro VARCHAR(80) NOT NULL,
  cidade VARCHAR(80) NOT NULL,
  estado CHAR(2) NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  cidadao_id INT NOT NULL,
  prefeitura_id INT,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  em_andamento_em DATETIME,
  concluido_em DATETIME,
  FOREIGN KEY (cidadao_id) REFERENCES cidadao(id),
  FOREIGN KEY (prefeitura_id) REFERENCES prefeitura(id)
);
