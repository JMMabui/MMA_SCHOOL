/*
  Warnings:

  - You are about to drop the `acess_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "acess_data_student_id_key";

-- DropIndex
DROP INDEX "acess_data_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "acess_data";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "login_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataOfBirth" DATETIME NOT NULL,
    "placeOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "provincyAddress" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentIssuedAt" DATETIME NOT NULL,
    "documentExpiredAt" DATETIME NOT NULL,
    "nuit" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "educationOfficerId" TEXT,
    CONSTRAINT "student_id_fkey" FOREIGN KEY ("id") REFERENCES "login_data" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_educationOfficerId_fkey" FOREIGN KEY ("educationOfficerId") REFERENCES "education_officer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_student" ("address", "created_at", "dataOfBirth", "documentExpiredAt", "documentIssuedAt", "documentNumber", "documentType", "educationOfficerId", "fatherName", "gender", "id", "maritalStatus", "motherName", "name", "nuit", "placeOfBirth", "provincyAddress", "surname", "updated_at") SELECT "address", "created_at", "dataOfBirth", "documentExpiredAt", "documentIssuedAt", "documentNumber", "documentType", "educationOfficerId", "fatherName", "gender", "id", "maritalStatus", "motherName", "name", "nuit", "placeOfBirth", "provincyAddress", "surname", "updated_at" FROM "student";
DROP TABLE "student";
ALTER TABLE "new_student" RENAME TO "student";
CREATE UNIQUE INDEX "student_nuit_key" ON "student"("nuit");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "login_data_email_key" ON "login_data"("email");
