/*
  Warnings:

  - You are about to drop the `atividade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `rankNew` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `rank` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- DropIndex
DROP INDEX "atividade_id_jogador_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "atividade";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "disponibilidade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_jogador" TEXT NOT NULL,
    "diaHora" DATETIME NOT NULL,
    CONSTRAINT "disponibilidade_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "rank" INTEGER DEFAULT 0,
    "classe" TEXT DEFAULT 'Class 6'
);
INSERT INTO "new_users" ("cargo", "celular", "classe", "cpf", "dataNascimento", "email", "nome", "rank", "senha", "sobrenome", "telefone", "username") SELECT "cargo", "celular", "classe", "cpf", "dataNascimento", "email", "nome", "rank", "senha", "sobrenome", "telefone", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidade_id_jogador_key" ON "disponibilidade"("id_jogador");
