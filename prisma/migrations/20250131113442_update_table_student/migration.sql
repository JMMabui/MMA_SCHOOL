-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" DATETIME NOT NULL,
    "place_of_birth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "marital_status" TEXT NOT NULL,
    "provincy_address" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "father_name" TEXT NOT NULL,
    "mother_name" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_number" TEXT NOT NULL,
    "document_issued_at" DATETIME NOT NULL,
    "document_expired_at" DATETIME NOT NULL,
    "nuit" INTEGER NOT NULL,
    "education_officer_id" TEXT,
    "login_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "student_login_id_fkey" FOREIGN KEY ("login_id") REFERENCES "login_data" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "student_education_officer_id_fkey" FOREIGN KEY ("education_officer_id") REFERENCES "education_officer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_student" ("address", "created_at", "date_of_birth", "document_expired_at", "document_issued_at", "document_number", "document_type", "education_officer_id", "father_name", "gender", "id", "marital_status", "mother_name", "name", "nuit", "place_of_birth", "provincy_address", "surname", "updated_at") SELECT "address", "created_at", "date_of_birth", "document_expired_at", "document_issued_at", "document_number", "document_type", "education_officer_id", "father_name", "gender", "id", "marital_status", "mother_name", "name", "nuit", "place_of_birth", "provincy_address", "surname", "updated_at" FROM "student";
DROP TABLE "student";
ALTER TABLE "new_student" RENAME TO "student";
CREATE UNIQUE INDEX "student_nuit_key" ON "student"("nuit");
CREATE UNIQUE INDEX "student_login_id_key" ON "student"("login_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
