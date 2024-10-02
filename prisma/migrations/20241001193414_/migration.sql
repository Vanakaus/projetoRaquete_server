/*
  Warnings:

  - You are about to alter the column `tiebreak1` on the `placar` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `tiebreak2` on the `placar` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `tiebreak3` on the `placar` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `tiebreak4` on the `placar` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - You are about to alter the column `tiebreak5` on the `placar` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Boolean`.
  - Made the column `id_pontuacao1` on table `partidas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_pontuacao2` on table `partidas` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campeonatos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_criador" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "regras" TEXT NOT NULL,
    "classe" TEXT NOT NULL DEFAULT 'aberto',
    "numJogadores" INTEGER NOT NULL,
    "games" INTEGER NOT NULL DEFAULT 3,
    "premiacao" TEXT,
    "local" TEXT,
    "dataInscricao" DATETIME NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'inscricao',
    CONSTRAINT "campeonatos_id_criador_fkey" FOREIGN KEY ("id_criador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_campeonatos" ("classe", "dataFim", "dataInicio", "dataInscricao", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "status") SELECT "classe", "dataFim", "dataInicio", "dataInscricao", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "status" FROM "campeonatos";
DROP TABLE "campeonatos";
ALTER TABLE "new_campeonatos" RENAME TO "campeonatos";
CREATE UNIQUE INDEX "campeonatos_nome_key" ON "campeonatos"("nome");
CREATE TABLE "new_partidas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "id_jogador1" INTEGER,
    "id_jogador2" INTEGER,
    "id_pontuacao1" INTEGER NOT NULL,
    "id_pontuacao2" INTEGER NOT NULL,
    "id_vencedor" INTEGER,
    "dataPartida" DATETIME,
    "localPartida" TEXT,
    CONSTRAINT "partidas_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao1_fkey" FOREIGN KEY ("id_pontuacao1") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao2_fkey" FOREIGN KEY ("id_pontuacao2") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_partidas" ("chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_pontuacao1", "id_pontuacao2", "id_vencedor", "localPartida") SELECT "chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_pontuacao1", "id_pontuacao2", "id_vencedor", "localPartida" FROM "partidas";
DROP TABLE "partidas";
ALTER TABLE "new_partidas" RENAME TO "partidas";
CREATE TABLE "new_placar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "set1" INTEGER NOT NULL DEFAULT 0,
    "set2" INTEGER NOT NULL DEFAULT 0,
    "set3" INTEGER NOT NULL DEFAULT 0,
    "set4" INTEGER NOT NULL DEFAULT 0,
    "set5" INTEGER NOT NULL DEFAULT 0,
    "tiebreak1" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak2" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak3" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak4" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak5" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_placar" ("id", "set1", "set2", "set3", "set4", "set5", "tiebreak1", "tiebreak2", "tiebreak3", "tiebreak4", "tiebreak5") SELECT "id", coalesce("set1", 0) AS "set1", coalesce("set2", 0) AS "set2", coalesce("set3", 0) AS "set3", coalesce("set4", 0) AS "set4", coalesce("set5", 0) AS "set5", coalesce("tiebreak1", false) AS "tiebreak1", coalesce("tiebreak2", false) AS "tiebreak2", coalesce("tiebreak3", false) AS "tiebreak3", coalesce("tiebreak4", false) AS "tiebreak4", coalesce("tiebreak5", false) AS "tiebreak5" FROM "placar";
DROP TABLE "placar";
ALTER TABLE "new_placar" RENAME TO "placar";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
