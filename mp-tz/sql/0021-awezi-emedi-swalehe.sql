-- D1 case mirror: Awezi Emedi Swalehe (registry record 0021-awezi-emedi-swalehe)
-- Target database: mp-tz-submissions   Target table: cases
--
-- Apply locally (offline, no login needed — writes .wrangler/state):
--   cd mp-tz
--   npx wrangler d1 execute mp-tz-submissions --local  --file=sql/0021-awezi-emedi-swalehe.sql
--
-- Apply to production (run `npx wrangler login` once first):
--   cd mp-tz
--   npx wrangler d1 execute mp-tz-submissions --remote --file=sql/0021-awezi-emedi-swalehe.sql
--
-- Idempotent: re-running replaces the row with the same primary-key id, so the D1
-- row always matches records/0021-awezi-emedi-swalehe.json.

INSERT OR REPLACE INTO cases (id, data)
VALUES (
  '0021-awezi-emedi-swalehe',
  '{"id":"0021-awezi-emedi-swalehe","full_name":"Awezi Emedi Swalehe","age":23,"gender":"male","photo_path":"","last_seen_date":"2026-09-11","location":{"name":"Sinza, Dar es Salaam","latitude":-6.78,"longitude":39.23,"region":"Dar es Salaam","district":"Ubungo"},"status":"found_deceased","circumstances":"23-year-old young man taken from his home in the Sinza area of Dar es Salaam on the night of 11 September 2026, at about 10:00 PM (saa 4 usiku), by people who had followed him and arrived on motorcycles. According to his maternal aunt (mama mdogo), his body was afterwards seen at Mwananyamala Hospital in Dar es Salaam, where it was reported that he appeared to have been struck on the head with a heavy object. Mwananyamala Hospital management says it does not know who brought the body in, because the person who delivered it did not register and simply abandoned it there — by those accounts the hospital received the body on the night of 12 September 2026. The family is asking whether he was killed during the night of 11 September or on 12 September, and who took his body to the hospital without identifying themselves. (Account as published on 21 September 2026 by Tanzanian journalist Hilda Newton (@hilda_newton_chadema) in a public Instagram post, relaying what the family said and what Mwananyamala Hospital said. It remains a single-source, social-media account: not independently confirmed, and no suspects have been officially named.)","tags":["dar es salaam","sinza","abduction","reported killed"],"verified":false,"sources":["https://www.instagram.com/p/DdjmLY4NtQA/"],"is_public":true,"created_at":"2026-09-22T09:00:00Z"}'
);
