-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "telefone" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "cargo" TEXT NOT NULL DEFAULT 'Jogador',
    "rank" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "atividade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_jogador" TEXT NOT NULL,
    "diaHora" DATETIME NOT NULL,
    CONSTRAINT "atividade_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campeonatos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_criador" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "regras" TEXT NOT NULL,
    "classe" TEXT NOT NULL,
    "numJogadores" INTEGER NOT NULL,
    "premiacao" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "campeonatos_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inscricao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador" TEXT NOT NULL,
    "situacao" TEXT NOT NULL,
    "dataInscricao" DATETIME NOT NULL,
    CONSTRAINT "inscricao_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inscricao_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tabela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador" INTEGER NOT NULL,
    "posicao" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL,
    "vitorias" INTEGER NOT NULL,
    "derrotas" INTEGER NOT NULL,
    CONSTRAINT "tabela_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tabela_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chaveamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_partida" INTEGER NOT NULL,
    "chave" INTEGER NOT NULL,
    CONSTRAINT "chaveamento_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chaveamento_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador1" INTEGER NOT NULL,
    "id_jogador2" INTEGER NOT NULL,
    "id_vencedor" INTEGER NOT NULL,
    "dataPartida" DATETIME NOT NULL,
    CONSTRAINT "partida_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partida_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partida_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "atividade_id_jogador_key" ON "atividade"("id_jogador");

-- CreateIndex
CREATE UNIQUE INDEX "campeonatos_id_criador_key" ON "campeonatos"("id_criador");

-- CreateIndex
CREATE UNIQUE INDEX "campeonatos_nome_key" ON "campeonatos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "inscricao_id_campeonato_key" ON "inscricao"("id_campeonato");

-- CreateIndex
CREATE UNIQUE INDEX "inscricao_id_jogador_key" ON "inscricao"("id_jogador");

-- CreateIndex
CREATE UNIQUE INDEX "tabela_id_campeonato_key" ON "tabela"("id_campeonato");

-- CreateIndex
CREATE UNIQUE INDEX "tabela_id_jogador_key" ON "tabela"("id_jogador");

-- CreateIndex
CREATE UNIQUE INDEX "chaveamento_id_campeonato_key" ON "chaveamento"("id_campeonato");

-- CreateIndex
CREATE UNIQUE INDEX "chaveamento_id_partida_key" ON "chaveamento"("id_partida");

-- CreateIndex
CREATE UNIQUE INDEX "partida_id_jogador1_key" ON "partida"("id_jogador1");

-- CreateIndex
CREATE UNIQUE INDEX "partida_id_jogador2_key" ON "partida"("id_jogador2");
