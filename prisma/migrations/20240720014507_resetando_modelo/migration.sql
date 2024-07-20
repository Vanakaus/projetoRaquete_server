/*
  Warnings:

  - Made the column `dataInscricao` on table `campeonatos` required. This step will fail if there are existing NULL values in that column.

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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
