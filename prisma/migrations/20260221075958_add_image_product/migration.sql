-- DropForeignKey
ALTER TABLE "DetailSales" DROP CONSTRAINT "DetailSales_product_id_fkey";

-- DropForeignKey
ALTER TABLE "DetailSales" DROP CONSTRAINT "DetailSales_sales_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_category_id_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSales" ADD CONSTRAINT "DetailSales_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "Sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailSales" ADD CONSTRAINT "DetailSales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
