/*
  Warnings:

  - You are about to alter the column `localPartida` on the `partidas` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "quadras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    CONSTRAINT "quadras_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_campeonato" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    CONSTRAINT "horarios_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "horarioPartida" INTEGER,
    "localPartida" INTEGER,
    CONSTRAINT "partidas_id_campeonato_fkey" FOREIGN KEY ("id_campeonato") REFERENCES "campeonatos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador1_fkey" FOREIGN KEY ("id_jogador1") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_jogador2_fkey" FOREIGN KEY ("id_jogador2") REFERENCES "inscricao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao1_fkey" FOREIGN KEY ("id_pontuacao1") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_id_pontuacao2_fkey" FOREIGN KEY ("id_pontuacao2") REFERENCES "placar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "partidas_localPartida_fkey" FOREIGN KEY ("localPartida") REFERENCES "quadras" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "partidas_horarioPartida_fkey" FOREIGN KEY ("horarioPartida") REFERENCES "horarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_partidas" ("chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_pontuacao1", "id_pontuacao2", "id_vencedor", "localPartida") SELECT "chave", "dataPartida", "id", "id_campeonato", "id_jogador1", "id_jogador2", "id_pontuacao1", "id_pontuacao2", "id_vencedor", "localPartida" FROM "partidas";
DROP TABLE "partidas";
ALTER TABLE "new_partidas" RENAME TO "partidas";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
