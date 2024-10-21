/*
  Warnings:

  - You are about to drop the column `id_horario` on the `partidas` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "id_data" INTEGER,
    "id_local" INTEGER,
    CONSTRAINT "partidas_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao1_fkey" FOREIGN KEY ("id_pontuacao1") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao2_fkey" FOREIGN KEY ("id_pontuacao2") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_local_fkey" FOREIGN KEY ("id_local") REFERENCES "quadras" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_data_fkey" FOREIGN KEY ("id_data") REFERENCES "horarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_partidas" ("chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_local", "id_pontuacao1", "id_pontuacao2", "id_vencedor") SELECT "chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_local", "id_pontuacao1", "id_pontuacao2", "id_vencedor" FROM "partidas";
DROP TABLE "partidas";
ALTER TABLE "new_partidas" RENAME TO "partidas";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
