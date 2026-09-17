const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

const scanAdditions = `
  scanType    String    @default("source")
  status      String    @default("complete")
  startedAt   DateTime?
  completedAt DateTime?
  errorText   String?
  riskSummary Json      @default("{}")`;

schema = schema.replace(/(model Scan \{[\s\S]*?)(^\})/m, `$1${scanAdditions}\n$2`);

const newModels = `
model Asset {
  id             String   @id @default(uuid())
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  kind           String   
  identifier     String   
  displayName    String?
  source         String   
  criticality    String   @default("unknown") 
  firstSeenAt    DateTime @default(now())
  lastSeenAt     DateTime @updatedAt
  active         Boolean  @default(true)
  metadata       Json     @default("{}")

  outgoing       AssetEdge[] @relation("FromAsset")
  incoming       AssetEdge[] @relation("ToAsset")
  cryptoUses     CryptoUse[]
  certificates   CertificateRecord[]

  @@unique([organizationId, kind, identifier])
  @@index([organizationId, kind])
}

model AssetEdge {
  id           String @id @default(uuid())
  fromAssetId  String
  toAssetId    String
  fromAsset    Asset  @relation("FromAsset", fields: [fromAssetId], references: [id])
  toAsset      Asset  @relation("ToAsset",   fields: [toAssetId],   references: [id])
  relation     String 
  confidence   Float  @default(1.0)
  createdAt    DateTime @default(now())

  @@unique([fromAssetId, toAssetId, relation])
}

model CryptoUse {
  id             String   @id @default(uuid())
  organizationId String
  assetId        String
  asset          Asset    @relation(fields: [assetId], references: [id])
  scanId         String?

  primitive      String   
  role           String   
  keyBits        Int?
  curve          String?
  parameterSet   String?  
  quantumStatus  String   
  location       String   
  evidence       Json     @default("{}")
  detectedAt     DateTime @default(now())

  @@index([organizationId, primitive])
  @@index([organizationId, quantumStatus])
}

model CertificateRecord {
  id                 String   @id @default(uuid())
  organizationId     String
  assetId            String
  asset              Asset    @relation(fields: [assetId], references: [id])
  serialNumber       String
  fingerprintSHA256  String
  subject            String
  issuer             String
  sans               String[]
  notBefore          DateTime
  notAfter           DateTime
  signatureAlgorithm String
  publicKeyAlgorithm String
  publicKeyBits      Int?
  isCA               Boolean  @default(false)
  chainPosition      Int      @default(0)
  selfSigned         Boolean  @default(false)

  @@unique([organizationId, fingerprintSHA256])
  @@index([organizationId, notAfter])
}

model DomainVerification {
  id             String    @id @default(uuid())
  organizationId String
  domain         String
  method         String    
  token          String    @unique
  verifiedAt     DateTime?
  lastCheckedAt  DateTime?
  createdAt      DateTime  @default(now())

  @@unique([organizationId, domain])
}

model Entitlement {
  id             String   @id @default(uuid())
  organizationId String   @unique
  planCode       String   @default("free") 
  source         String   
  maxDomains     Int      @default(1)
  maxAssets      Int      @default(50)
  scansPerMonth  Int      @default(3)
  features       Json     @default("{}") 
  validFrom      DateTime @default(now())
  validUntil     DateTime
  updatedAt      DateTime @updatedAt
}

model ScheduledJob {
  id             String    @id @default(uuid())
  organizationId String
  kind           String    
  targetRef      String
  cronExpr       String
  nextRunAt      DateTime
  lastRunAt      DateTime?
  lockedAt       DateTime?
  lockedBy       String?
  failureCount   Int       @default(0)
  enabled        Boolean   @default(true)

  @@index([enabled, nextRunAt])
}

model Alert {
  id             String   @id @default(uuid())
  organizationId String
  severity       String   
  kind           String   
  title          String
  body           String
  assetId        String?
  findingRef     String?
  deliveredAt    DateTime?
  acknowledgedAt DateTime?
  createdAt      DateTime @default(now())

  @@index([organizationId, createdAt])
}
`;

schema += "\n" + newModels + "\n";

// Add assets relation to Organization
schema = schema.replace(/(model Organization \{[\s\S]*?)(^\})/m, `$1  assets         Asset[]\n$2`);

// Add payload and receivedAt to WebhookEvent
schema = schema.replace(/(model WebhookEvent \{[\s\S]*?)(^\})/m, `$1  payload     Json      @default("{}")\n  receivedAt  DateTime  @default(now())\n$2`);

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema updated successfully');
