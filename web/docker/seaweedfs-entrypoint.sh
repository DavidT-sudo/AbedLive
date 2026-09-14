#!/bin/sh
# Writes SeaweedFS's S3 identity config from env vars at container start,
# instead of committing real access/secret keys into the repo. Heredoc
# interpolation (not sed/envsubst) so an arbitrary base64/hex secret can't
# break the substitution by containing a regex-special character.
set -eu

: "${S3_ACCESS_KEY_ID:?S3_ACCESS_KEY_ID must be set}"
: "${S3_SECRET_ACCESS_KEY:?S3_SECRET_ACCESS_KEY must be set}"

cat > /etc/seaweedfs/s3.json <<EOF
{
  "identities": [
    {
      "name": "abedlive-app",
      "credentials": [
        { "accessKey": "${S3_ACCESS_KEY_ID}", "secretKey": "${S3_SECRET_ACCESS_KEY}" }
      ],
      "actions": ["Admin", "Read", "Write", "List", "Tagging"]
    },
    {
      "name": "anonymous",
      "actions": ["Read:abedlive-media"]
    }
  ]
}
EOF

exec weed "$@"
