/*
  Warnings:

  - You are about to drop the column `orderId` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `order_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "orderId",
ADD COLUMN     "order_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
