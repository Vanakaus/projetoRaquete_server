-- AlterTable
ALTER TABLE "campeonatos" ADD COLUMN "dataInscricao" DATETIME;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "classe" TEXT DEFAULT 'Class 6';
ALTER TABLE "users" ADD COLUMN "rankNew" INTEGER DEFAULT 0;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_partidas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "id_jogador1" INTEGER NOT NULL,
    "id_jogador2" INTEGER NOT NULL,
    "pontuacaoJog1" INTEGER NOT NULL DEFAULT 0,
    "pontuacaoJog2" INTEGER NOT NULL DEFAULT 0,
    "id_vencedor" INTEGER,
    "dataPartida" DATETIME,
    CONSTRAINT "partidas_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_partidas" ("chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_vencedor") SELECT "chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_vencedor" FROM "partidas";
DROP TABLE "partidas";
ALTER TABLE "new_partidas" RENAME TO "partidas";
CREATE UNIQUE INDEX "partidas_id_campeonato_key" ON "partidas"("id_campeonato");
CREATE UNIQUE INDEX "partidas_id_jogador1_key" ON "partidas"("id_jogador1");
CREATE UNIQUE INDEX "partidas_id_jogador2_key" ON "partidas"("id_jogador2");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
