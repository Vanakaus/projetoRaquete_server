-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_inscricao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "id_jogador" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'pendente',
    "dataInscricao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inscricao_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inscricao_id_jogador_fkey" FOREIGN KEY ("id_jogador") REFERENCES "users" ("cpf") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_inscricao" ("dataInscricao", "id", "id_campeonato", "id_jogador", "situacao") SELECT "dataInscricao", "id", "id_campeonato", "id_jogador", "situacao" FROM "inscricao";
DROP TABLE "inscricao";
ALTER TABLE "new_inscricao" RENAME TO "inscricao";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
