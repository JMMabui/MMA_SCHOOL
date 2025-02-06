/*
  Warnings:

  - You are about to drop the column `dataOfBirth` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `documentExpiredAt` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `documentIssuedAt` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `documentNumber` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `documentType` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `educationOfficerId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `fatherName` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `maritalStatus` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `motherName` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `placeOfBirth` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `provincyAddress` on the `student` table. All the data in the column will be lost.
  - Added the required column `date_of_birth` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_expired_at` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_issued_at` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_number` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `document_type` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `father_name` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marital_status` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mother_name` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_of_birth` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provincy_address` to the `student` table without a default value. This is not possible if the table is not empty.

*/
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
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "student_id_fkey" FOREIGN KEY ("id") REFERENCES "login_data" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_education_officer_id_fkey" FOREIGN KEY ("education_officer_id") REFERENCES "education_officer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_student" ("address", "created_at", "gender", "id", "name", "nuit", "surname", "updated_at") SELECT "address", "created_at", "gender", "id", "name", "nuit", "surname", "updated_at" FROM "student";
DROP TABLE "student";
ALTER TABLE "new_student" RENAME TO "student";
CREATE UNIQUE INDEX "student_nuit_key" ON "student"("nuit");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
