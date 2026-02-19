-- CreateTable
CREATE TABLE "SourceProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "trustScore" INTEGER NOT NULL DEFAULT 10,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "config" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CrawlEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "status" TEXT NOT NULL,
    "itemsFound" INTEGER NOT NULL DEFAULT 0,
    "itemsNew" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT,
    CONSTRAINT "CrawlEvent_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "SourceProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SourceSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawHtml" TEXT,
    "rawJson" TEXT,
    "contentHash" TEXT NOT NULL,
    "imagesEnriched" BOOLEAN NOT NULL DEFAULT false,
    "enrichedAt" DATETIME,
    "enrichmentError" TEXT,
    CONSTRAINT "SourceSnapshot_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "SourceProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ObservedListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "snapshotId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "price" REAL,
    "currency" TEXT NOT NULL DEFAULT 'MXN',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "lat" REAL,
    "lng" REAL,
    "status" TEXT,
    "listedAt" DATETIME,
    "geoHash" TEXT,
    "addressHash" TEXT,
    "mediaHash" TEXT,
    "confidenceScore" REAL NOT NULL DEFAULT 0.5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ObservedListing_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "SourceSnapshot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "observedListingId" TEXT NOT NULL,
    "matchedListingId" TEXT,
    "payload" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Signal_observedListingId_fkey" FOREIGN KEY ("observedListingId") REFERENCES "ObservedListing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SourceProfile_name_key" ON "SourceProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ObservedListing_snapshotId_key" ON "ObservedListing"("snapshotId");
