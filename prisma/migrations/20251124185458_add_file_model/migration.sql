-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "files_request_id_idx" ON "files"("request_id");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
