-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_placar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "set1" INTEGER NOT NULL DEFAULT -1,
    "set2" INTEGER NOT NULL DEFAULT -1,
    "set3" INTEGER NOT NULL DEFAULT -1,
    "set4" INTEGER NOT NULL DEFAULT -1,
    "set5" INTEGER NOT NULL DEFAULT -1,
    "tiebreak1" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak2" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak3" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak4" BOOLEAN NOT NULL DEFAULT false,
    "tiebreak5" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_placar" ("id", "set1", "set2", "set3", "set4", "set5", "tiebreak1", "tiebreak2", "tiebreak3", "tiebreak4", "tiebreak5") SELECT "id", "set1", "set2", "set3", "set4", "set5", "tiebreak1", "tiebreak2", "tiebreak3", "tiebreak4", "tiebreak5" FROM "placar";
DROP TABLE "placar";
ALTER TABLE "new_placar" RENAME TO "placar";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
