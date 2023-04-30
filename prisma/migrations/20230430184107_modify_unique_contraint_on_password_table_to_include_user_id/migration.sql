/*
  Warnings:

  - A unique constraint covering the columns `[url,username,userId]` on the table `Password` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Password_url_username_key";

-- CreateIndex
CREATE UNIQUE INDEX "Password_url_username_userId_key" ON "Password"("url", "username", "userId");
