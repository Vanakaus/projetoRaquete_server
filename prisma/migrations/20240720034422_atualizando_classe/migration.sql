-- AlterTable
ALTER TABLE "partidas" ADD COLUMN "localPartida" TEXT;

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
    "rank" INTEGER NOT NULL DEFAULT 0,
    "classe" TEXT NOT NULL DEFAULT 'Classe 6'
);
INSERT INTO "new_users" ("cargo", "celular", "classe", "cpf", "dataNascimento", "email", "nome", "rank", "senha", "sobrenome", "telefone", "username") SELECT "cargo", "celular", coalesce("classe", 'Classe 6') AS "classe", "cpf", "dataNascimento", "email", "nome", coalesce("rank", 0) AS "rank", "senha", "sobrenome", "telefone", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
