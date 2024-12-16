-- CreateTable
CREATE TABLE "users" (
    "cpf" TEXT NOT NULL PRIMARY KEY DEFAULT '00000000000',
    "username" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "telefone" TEXT,
    "celular" TEXT,
    "cargo" TEXT NOT NULL DEFAULT 'Jogador',
    "rank" INTEGER NOT NULL DEFAULT 0,
    "classe" TEXT NOT NULL DEFAULT 'Classe 6'
);

-- CreateTable
CREATE TABLE "disponibilidade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_jogador" TEXT NOT NULL,
    "diaHora" DATETIME NOT NULL,
    CONSTRAINT "disponibilidade_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campeonatos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_criador" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "regras" TEXT NOT NULL,
    "classe" TEXT NOT NULL DEFAULT 'aberto',
    "numJogadores" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 3,
    "premiacao" TEXT,
    "local" TEXT,
    "dataInscricao" DATETIME NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "id_status" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "campeonatos_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "campeonatos_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL DEFAULT 'pendente'
);

-- CreateTable
CREATE TABLE "inscricao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'pendente',
    "dataInscricao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inscricao_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inscricao_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "partidas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "id_jogador1" INTEGER,
    "id_jogador2" INTEGER,
    "id_pontuacao1" INTEGER NOT NULL,
    "id_pontuacao2" INTEGER NOT NULL,
    "id_vencedor" INTEGER,
    "dataPartida" DATETIME,
    "id_data" INTEGER,
    "id_local" INTEGER,
    CONSTRAINT "partidas_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao1_fkey" FOREIGN KEY ("id_pontuacao1") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao2_fkey" FOREIGN KEY ("id_pontuacao2") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_local_fkey" FOREIGN KEY ("id_local") REFERENCES "quadras" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_data_fkey" FOREIGN KEY ("id_data") REFERENCES "horarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "placar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "set1" INTEGER NOT NULL DEFAULT -1,
    "set2" INTEGER NOT NULL DEFAULT -1,
    "set3" INTEGER NOT NULL DEFAULT -1,
    "set4" INTEGER NOT NULL DEFAULT -1,
    "set5" INTEGER NOT NULL DEFAULT -1,
    "tiebreak1" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak2" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak3" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak4" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak5" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "quadras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    CONSTRAINT "quadras_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    CONSTRAINT "horarios_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidade_id_jogador_key" ON "disponibilidade"("id_jogador");

-- CreateIndex
CREATE UNIQUE INDEX "campeonatos_nome_key" ON "campeonatos"("nome");
