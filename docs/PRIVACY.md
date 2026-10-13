# Privacy

## What is public

- Published story titles and text (off-chain database)
- Approximate place coordinates (neighborhood-level)
- Display names or cloaked label (“A neighbor”)
- Tags, temporal layers, relation descriptions
- Denormalized unique-read counts (not reader identities)
- On-chain content hashes / epoch commitments when registered

## What stays off-chain

- Full story text and personal details
- Exact residential coordinates (not collected for publish flow)
- Reader session identifiers (hashed server-side)
- Moderation notes and report payloads
- Privy / wallet linkage details beyond what the wallet itself exposes

## Cloaking

Cloaking replaces the public display name with “A neighbor.” It is **not** complete anonymity. Operators with database access may still see the author record. Do not promise cryptographic anonymity.

## Reads

Anonymous visitors receive an HttpOnly session cookie (`ms_reader`). The server stores a hash of that value with each qualified read. Private reader identities are not exposed in the API.
