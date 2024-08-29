-- AlterTable
ALTER TABLE "SolanaWallet" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "SolanaWallet" ADD CONSTRAINT "SolanaWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
