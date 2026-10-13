# Abuse model

## Threats considered

| Threat | Mitigation (MVP) | Limitation |
| --- | --- | --- |
| Read-count inflation | Dedup by hashed reader key + time bucket; rate limits | Not Sybil-proof for anonymous users |
| Spam publication | Input validation + per-IP rate limits | Determined attackers can rotate IPs |
| Duplicate relations | Unique (source, target, type) | Users may create weak RELATED links |
| Sensitive data in stories | Privacy checkbox + warnings | Cannot fully prevent disclosure |
| Ranking manipulation via funding | Funding never writes to readCount/order | Must keep treasury decoupled |
| Fake on-chain success | UI only confirms after DB/tx success | Demo mode must stay labeled |

## Explicit non-claims

- Witnesses / chain registration do **not** prove a memory is true.
- Anonymous read counts are **not** cryptographically Sybil-resistant.
- Cloaking is **not** anonymity.

## Moderation

Reports increment `reportCount`. Hidden/removed content is a moderation status change — distinct from any on-chain registration that may already exist.
