/*
  Warnings:

  - A unique constraint covering the columns `[student_id]` on the table `acess_data` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "acess_data_student_id_key" ON "acess_data"("student_id");
