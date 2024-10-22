/*
  Warnings:

  - You are about to drop the column `status` on the `campeonatos` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL DEFAULT 'pendente'
);

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
INSERT INTO "new_campeonatos" ("classe", "dataFim", "dataInicio", "dataInscricao", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "sets") SELECT "classe", "dataFim", "dataInicio", "dataInscricao", "descricao", "id", "id_criador", "local", "nome", "numJogadores", "premiacao", "regras", "sets" FROM "campeonatos";
DROP TABLE "campeonatos";
ALTER TABLE "new_campeonatos" RENAME TO "campeonatos";
CREATE UNIQUE INDEX "campeonatos_nome_key" ON "campeonatos"("nome");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
