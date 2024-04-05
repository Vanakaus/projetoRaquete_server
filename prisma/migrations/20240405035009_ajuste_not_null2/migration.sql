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
    "celular" TEXT,
    "cargo" TEXT NOT NULL DEFAULT 'Jogador',
    "rank" TEXT
);
INSERT INTO "new_users" ("cargo", "celular", "dataNascimento", "email", "id", "nome", "rank", "senha", "sobrenome", "telefone", "username") SELECT "cargo", "celular", "dataNascimento", "email", "id", "nome", "rank", "senha", "sobrenome", "telefone", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
