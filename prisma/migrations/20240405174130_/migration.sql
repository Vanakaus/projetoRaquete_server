/*
  Warnings:

  - You are about to drop the `chaveamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partida` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tabela` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "chaveamento_id_partida_key";

-- DropIndex
DROP INDEX "chaveamento_id_campeonato_key";

-- DropIndex
DROP INDEX "partida_id_jogador2_key";

-- DropIndex
DROP INDEX "partida_id_jogador1_key";

-- DropIndex
DROP INDEX "tabela_id_jogador_key";

-- DropIndex
DROP INDEX "tabela_id_campeonato_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "chaveamento";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "partida";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tabela";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "partidas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "chave" INTEGER NOT NULL,
    "id_jogador1" INTEGER NOT NULL,
    "id_jogador2" INTEGER NOT NULL,
    "id_vencedor" INTEGER,
    "dataPartida" DATETIME,
    CONSTRAINT "partidas_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_atividade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_jogador" TEXT NOT NULL,
    "diaHora" DATETIME NOT NULL,
    CONSTRAINT "atividade_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_atividade" ("diaHora", "id", "id_jogador") SELECT "diaHora", "id", "id_jogador" FROM "atividade";
DROP TABLE "atividade";
ALTER TABLE "new_atividade" RENAME TO "atividade";
CREATE UNIQUE INDEX "atividade_id_jogador_key" ON "atividade"("id_jogador");
CREATE TABLE "new_inscricao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'pendente',
    "dataInscricao" DATETIME NOT NULL,
    CONSTRAINT "inscricao_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inscricao_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_inscricao" ("dataInscricao", "id", "id_campeonato", "id_jogador", "situacao") SELECT "dataInscricao", "id", "id_campeonato", "id_jogador", "situacao" FROM "inscricao";
DROP TABLE "inscricao";
ALTER TABLE "new_inscricao" RENAME TO "inscricao";
CREATE UNIQUE INDEX "inscricao_id_campeonato_key" ON "inscricao"("id_campeonato");
CREATE UNIQUE INDEX "inscricao_id_jogador_key" ON "inscricao"("id_jogador");
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
    CONSTRAINT "campeonatos_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_campeonatos" ("classe", "dataFim", "dataInicio", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "status", "tipo") SELECT "classe", "dataFim", "dataInicio", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "status", "tipo" FROM "campeonatos";
DROP TABLE "campeonatos";
ALTER TABLE "new_campeonatos" RENAME TO "campeonatos";
CREATE UNIQUE INDEX "campeonatos_id_criador_key" ON "campeonatos"("id_criador");
CREATE UNIQUE INDEX "campeonatos_nome_key" ON "campeonatos"("nome");
CREATE TABLE "new_users" (
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
    "rank" TEXT
);
INSERT INTO "new_users" ("cargo", "celular", "dataNascimento", "email", "nome", "rank", "senha", "sobrenome", "telefone", "username") SELECT "cargo", "celular", "dataNascimento", "email", "nome", "rank", "senha", "sobrenome", "telefone", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "partidas_id_campeonato_key" ON "partidas"("id_campeonato");

-- CreateIndex
CREATE UNIQUE INDEX "partidas_id_jogador1_key" ON "partidas"("id_jogador1");

-- CreateIndex
CREATE UNIQUE INDEX "partidas_id_jogador2_key" ON "partidas"("id_jogador2");
