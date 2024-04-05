-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "dataNascimento" DATETIME NOT NULL,
    "telefone" TEXT,
    "celular" TEXT NOT NULL,
    "cargo" TEXT NOT NULL DEFAULT 'Jogador',
    "rank" TEXT
);
INSERT INTO "new_users" ("cargo", "celular", "dataNascimento", "email", "id", "nome", "rank", "senha", "sobrenome", "telefone", "username") SELECT "cargo", "celular", "dataNascimento", "email", "id", "nome", "rank", "senha", "sobrenome", "telefone", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE TABLE "new_campeonatos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_criador" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL,
    "regras" TEXT NOT NULL,
    "classe" TEXT NOT NULL DEFAULT 'aberto',
    "numJogadores" INTEGER NOT NULL,
    "premiacao" TEXT,
    "local" TEXT,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'inscricao',
    CONSTRAINT "campeonatos_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_campeonatos" ("classe", "dataFim", "dataInicio", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "status", "tipo") SELECT "classe", "dataFim", "dataInicio", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "status", "tipo" FROM "campeonatos";
DROP TABLE "campeonatos";
ALTER TABLE "new_campeonatos" RENAME TO "campeonatos";
CREATE UNIQUE INDEX "campeonatos_id_criador_key" ON "campeonatos"("id_criador");
CREATE UNIQUE INDEX "campeonatos_nome_key" ON "campeonatos"("nome");
CREATE TABLE "new_tabela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador" INTEGER NOT NULL,
    "posicao" INTEGER NOT NULL DEFAULT 0,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "vitorias" INTEGER NOT NULL DEFAULT 0,
    "derrotas" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "tabela_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tabela_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tabela" ("derrotas", "id", "id_campeonato", "id_jogador", "pontos", "posicao", "vitorias") SELECT "derrotas", "id", "id_campeonato", "id_jogador", "pontos", "posicao", "vitorias" FROM "tabela";
DROP TABLE "tabela";
ALTER TABLE "new_tabela" RENAME TO "tabela";
CREATE UNIQUE INDEX "tabela_id_campeonato_key" ON "tabela"("id_campeonato");
CREATE UNIQUE INDEX "tabela_id_jogador_key" ON "tabela"("id_jogador");
CREATE TABLE "new_partida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador1" INTEGER NOT NULL,
    "id_jogador2" INTEGER NOT NULL,
    "id_vencedor" INTEGER,
    "dataPartida" DATETIME,
    CONSTRAINT "partida_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partida_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partida_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_partida" ("dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_vencedor") SELECT "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_vencedor" FROM "partida";
DROP TABLE "partida";
ALTER TABLE "new_partida" RENAME TO "partida";
CREATE UNIQUE INDEX "partida_id_jogador1_key" ON "partida"("id_jogador1");
CREATE UNIQUE INDEX "partida_id_jogador2_key" ON "partida"("id_jogador2");
CREATE TABLE "new_chaveamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_partida" INTEGER,
    "chave" INTEGER NOT NULL,
    CONSTRAINT "chaveamento_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chaveamento_id_partida_fkey" FOREIGN KEY ("id_partida") REFERENCES "partida" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_chaveamento" ("chave", "id", "id_campeonato", "id_partida") SELECT "chave", "id", "id_campeonato", "id_partida" FROM "chaveamento";
DROP TABLE "chaveamento";
ALTER TABLE "new_chaveamento" RENAME TO "chaveamento";
CREATE UNIQUE INDEX "chaveamento_id_campeonato_key" ON "chaveamento"("id_campeonato");
CREATE UNIQUE INDEX "chaveamento_id_partida_key" ON "chaveamento"("id_partida");
CREATE TABLE "new_inscricao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'pendente',
    "dataInscricao" DATETIME NOT NULL,
    CONSTRAINT "inscricao_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inscricao_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_inscricao" ("dataInscricao", "id", "id_campeonato", "id_jogador", "situacao") SELECT "dataInscricao", "id", "id_campeonato", "id_jogador", "situacao" FROM "inscricao";
DROP TABLE "inscricao";
ALTER TABLE "new_inscricao" RENAME TO "inscricao";
CREATE UNIQUE INDEX "inscricao_id_campeonato_key" ON "inscricao"("id_campeonato");
CREATE UNIQUE INDEX "inscricao_id_jogador_key" ON "inscricao"("id_jogador");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
