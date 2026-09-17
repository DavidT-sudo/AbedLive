#!/bin/sh
# Runs once after the dev container is created (see devcontainer.json's
# postCreateCommand). Gets the stack from "three empty containers" to
# "npm run dev just works": real node_modules, the SeaweedFS bucket
# created (SeaweedFS doesn't auto-create it), and the database migrated
# and seeded.
set -eu

echo "==> Installing dependencies"
npm ci

echo "==> Waiting for Postgres"
until pg_isready -h db -U abedlive >/dev/null 2>&1; do
  sleep 1
done

echo "==> Ensuring the SeaweedFS bucket exists"
node <<'NODE'
const { S3Client, CreateBucketCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

s3.send(new CreateBucketCommand({ Bucket: process.env.S3_BUCKET }))
  .then(() => console.log("Bucket created."))
  .catch((err) => {
    // SeaweedFS returns this even for the same owner re-creating the same
    // bucket (seaweedfs/seaweedfs#2069) — a rebuilt container hitting an
    // already-populated seaweed volume is expected, not a failure.
    if (err.name === "BucketAlreadyExists" || err.name === "BucketAlreadyOwnedByYou") {
      console.log("Bucket already exists — continuing.");
      return;
    }
    throw err;
  });
NODE

echo "==> Applying database migrations"
npm run db:migrate

echo "==> Seeding the database (skipped automatically if it already has content)"
npm run db:seed || true

echo ""
echo "Dev container ready. Run 'npm run dev', then create your first admin with:"
echo '  npm run admin:create -- --email you@example.com --password "..." --name "Your Name"'
