import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mysql from "mysql2/promise";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function requireColumns(table, rows, expected) {
  const fields = new Set(rows.map((r) => r.Field));
  const missing = expected.filter((col) => !fields.has(col));
  if (missing.length) {
    throw new Error(
      `${table} is missing columns: ${missing.join(", ")}. Found: ${[...fields].join(", ")}`,
    );
  }
}

const EVENT_COLUMNS = [
  "title",
  "slug",
  "starts_at",
  "ends_at",
  "location",
  "excerpt",
  "body",
  "image_url",
  "status",
];

const NEWS_COLUMNS = [
  "title",
  "slug",
  "category",
  "excerpt",
  "body",
  "image_url",
  "published_at",
  "status",
];

const events = [
  {
    title: "Ghana Black Stars 100 Days Countdown Celebration",
    slug: "black-stars-100-days-countdown-2026",
    starts_at: "2026-03-03 17:30:00",
    ends_at: "2026-03-03 21:00:00",
    location: "Rebel Toronto, 11 Polson St, Toronto ON M5A 1A4",
    excerpt:
      "Join GCAO and the Ghana Consulate General for a free evening of culture, music, and football spirit ahead of the Black Stars’ historic match in Toronto.",
    body: "On March 3rd, 2026, the Ghanaian Canadian Association of Ontario (GCAO) and the Ghana Consulate General in Canada will bring our community together at Rebel Toronto, 11 Polson St., Toronto (M5A 1A4) for an unforgettable evening of culture, music, and football spirit. From 5:30 p.m. to 9:00 p.m., fans, families, and friends will gather under one roof to celebrate Ghana, rally behind the Black Stars, and show Canada that #GhanaWeAreComing and #GhanaYeeba in full force. Expect live entertainment, DJ music, special appearances, fan activities, and waves of red, gold, green, and black as we build momentum toward the big game. Entry is free, but registration is required.",
    image_url: "/images/mcs.jpg",
    status: "published",
  },
  {
    title: "GCAO Homework Club & Twi Language Classes",
    slug: "homework-club-twi-language-classes",
    starts_at: "2025-03-22 15:30:00",
    ends_at: "2027-01-31 17:00:00",
    location: "GCAO Resource Hub, 65 Mayall Avenue, North York ON M3L 1E7",
    excerpt:
      "Free Sunday homework support for ages 6–18 plus Twi language classes for all ages at the Resource Hub.",
    body: "The GCAO Homework Club is now open. We invite children in need of homework support to join, as well as those who want to learn the Twi language. Additionally, we welcome tutors and instructors interested in volunteering. The Twi program is open to all ages and teaches the basics of the language, helping participants to understand and speak Twi. This program is free for all Ghanaians. Sessions run every Sunday from 3:30 p.m. to 5:00 p.m. at the GCAO Resource Hub, 65 Mayall Avenue, North York.",
    image_url: "/images/programs/homework.jpg",
    status: "published",
  },
  {
    title: "Seniors Annual Picnic",
    slug: "seniors-annual-picnic-2026",
    starts_at: "2026-09-19 12:00:00",
    ends_at: "2026-09-19 16:00:00",
    location: "Greater Toronto Area (details via GCAO)",
    excerpt:
      "GCAO Golden Ages seniors gather for the annual picnic — food, fellowship, and community connection.",
    body: "The Ghanaian-Canadian Association of Ontario’s Golden Ages group hosts its Seniors Annual Picnic on September 19, 2026. The picnic continues GCAO’s work to reduce isolation and strengthen social connections among seniors 65 and above through culturally welcoming gatherings of food, games, and fellowship.",
    image_url: "/images/seniors-picnic.jpg",
    status: "published",
  },
  {
    title: "Black History Month Lecture Series with Prof. Dei",
    slug: "bhm-lecture-prof-dei-2026",
    starts_at: "2026-02-27 19:00:00",
    ends_at: "2026-02-27 20:30:00",
    location: "Online (Zoom)",
    excerpt:
      "GCAO’s Black History Month lecture series with Prof. Dei — education and community conversation on Zoom.",
    body: "Topic: Black History Month Lecture Series with Prof. Dei. Time: February 27, 2026, 7:00 p.m. Eastern Time (US and Canada). Join via Zoom. Event categories: Awareness, community, Education.",
    image_url: "/images/conference.jpg",
    status: "published",
  },
  {
    title: "Continental Africa-Sankofa (Emancipation Month)",
    slug: "continental-africa-sankofa-2024",
    starts_at: "2024-08-19 18:00:00",
    ends_at: "2024-08-19 22:00:00",
    location: "GCAO community gathering",
    excerpt:
      "A free Emancipation Month close with discussion, movie night, drumming, dance, and food celebrating Sankofa.",
    body: "As August is Emancipation Month, GCAO closed the month with Continental Africa-Sankofa. The event was free for all attendees. Everyone was invited for a night of discussion, movie night, dancing, and celebrating cultural heritage and diversity, with food and cultural drumming and dance at the beginning, finishing with a discussion on what Sankofa means.",
    image_url: "/images/emancipation.jpg",
    status: "published",
  },
];

const news = [
  {
    title: "Ghanaian Community Comes Together for Life-Saving Prostate Cancer Screening",
    slug: "prostate-cancer-screening",
    category: "Health",
    excerpt:
      "Prostate cancer remains one of the most common cancers affecting men, and research continues to show that Black men—including Ghanaian men—are at a significantly higher risk of developing the disease.",
    body: "Prostate cancer remains one of the most common cancers affecting men, and research continues to show that Black men—including Ghanaian men—are at a significantly higher risk of developing the disease and often at a younger age. On Sunday, March 15, 2026, the Ghanaian community gathered at the Ghanaian Presbyterian Church of Toronto for a free PSA screening clinic. The event successfully screened 78 men, including several who received their first PSA test. GCAO thanks the Walnut Foundation, Princess Margaret Cancer Centre / University Health Network, MPP Tom Rakocevic, Mary Akuamoah-Boateng, and community volunteers who made the initiative possible.",
    image_url: "/images/programs/health.jpg",
    published_at: "2026-03-16 20:42:00",
    status: "published",
  },
  {
    title: "Promoting Mental Health First Aid for Black Communities",
    slug: "mental-health-first-aid-black-communities",
    category: "Health",
    excerpt:
      "Culturally focused Mental Health First Aid builds capacity in Black and African diaspora communities where supports are often least available.",
    body: "Ensuring mental well-being is crucial, especially when tailored to address the specific needs of Black communities. Like first aid for physical injuries, Mental Health First Aid prepares people to help when someone is experiencing mental challenges. To tackle stigma, GCAO creates toolkits and training programs that empower community members to offer aid. GCAO has trained over 270 community members across Canada, including Calgary, Edmonton, Toronto, and Vaughan. You do not need to be a mental health expert to take the training.",
    image_url: "/images/mhfa.jpg",
    published_at: "2024-01-21 15:49:00",
    status: "published",
  },
  {
    title: "The Ghanaian Community in Toronto Hold Vigil for Mr. Adu Boakye",
    slug: "vigil-adu-boakye",
    category: "Community",
    excerpt:
      "Following the passing of Mr. Adu Boakye on February 17, 2024 through a random act of gun violence, the community gathered for a vigil one week later.",
    body: "With the passing of Mr. Adu Boakye on February 17th, 2024 through a random act of gun violence, a vigil was organized one week later, February 24th, at Jane and Driftwood. The vigil started at 1:00 p.m. with community members, law enforcement officers, civic leaders, and the press. GCAO President Emmanuel C. Duodu welcomed attendees and appealed for opportunities for young people in education, employment, mentoring, after-school programs, and housing. Community members and civic leaders walked to the bus stop where Adu Boakye was shot, and a prayer was offered by Reverend Father Kenneth Korsah.",
    image_url: "/images/vigil.jpg",
    published_at: "2024-02-26 12:36:00",
    status: "published",
  },
  {
    title: "GCAO Women’s Wing Celebrates Black History Month 2024",
    slug: "womens-wing-black-history-month-2024",
    category: "Culture",
    excerpt:
      "On Saturday, Feb. 24th the GCAO Women’s Wing led by Ms. Maud Cole and Ms. Liz Okai organized and celebrated Black History Month.",
    body: "On Saturday, Feb. 24th the Ghanaian Canadian Association of Ontario (GCAO)’s women’s wing led by Ms. Maud Cole and Ms. Liz Okai organized and celebrated Black History Month. The theme was Black African and the Arts, focused on empowering Black families and the Ghanaian community to tell their stories through poetry, music, visual arts, spoken word, storytelling, dancing, and drumming. Keynote speaker Mr. Acquaah-Harrison urged families to proudly own their individual and collective identities.",
    image_url: "/images/women-bhm.jpg",
    published_at: "2024-02-26 11:23:00",
    status: "published",
  },
  {
    title: "A Night of Giving: Ontario’s Ghanaian-Canadian Community Rallies for Heritage Center",
    slug: "night-of-giving-heritage-center",
    category: "Community",
    excerpt:
      "On September 30th, GCAO hosted a fundraiser at the Toronto Pearson Convention Center toward establishing a Ghanaian-Canadian Heritage Center.",
    body: "On September 30th, the Ghanaian-Canadian Association of Ontario orchestrated a highly successful fundraiser at the Toronto Pearson Convention Center. The event was a significant milestone in their mission to establish a Ghanaian Canadian Heritage and Resource Center for Ghanaian-Canadians and other minority communities in Ontario. Through speeches, cultural performances, and community engagement, funds raised will support a hub for cultural exchange, education, and resource support.",
    image_url: "/images/heritage-wide.jpg",
    published_at: "2023-10-17 10:04:00",
    status: "published",
  },
];

async function upsert(conn, table, uniqueKey, row) {
  const cols = Object.keys(row);
  const placeholders = cols.map(() => "?").join(", ");
  const updates = cols
    .filter((c) => c !== uniqueKey)
    .map((c) => `${c} = VALUES(${c})`)
    .join(", ");
  const sql = `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`;
  await conn.execute(sql, cols.map((c) => row[c]));
}

async function main() {
  loadEnvLocal();
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_SERVER,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(msg);
    console.error(
      "If this is an IP allowlist error, enable Remote MySQL in hPanel for this machine’s public IP, then retry. No schema change is needed.",
    );
    process.exit(1);
  }

  console.log(`Connected to ${process.env.DB_SERVER}/${process.env.DB_DATABASE}`);

  try {
    const [eventDesc] = await conn.query("DESCRIBE events");
    const [newsDesc] = await conn.query("DESCRIBE news");
    requireColumns("events", eventDesc, EVENT_COLUMNS);
    requireColumns("news", newsDesc, NEWS_COLUMNS);

    for (const row of events) await upsert(conn, "events", "slug", row);
    for (const row of news) await upsert(conn, "news", "slug", row);

    const [eventRows] = await conn.query(
      "SELECT id, title, slug, status FROM events ORDER BY starts_at DESC",
    );
    const [newsRows] = await conn.query(
      "SELECT id, title, slug, status FROM news ORDER BY published_at DESC",
    );

    console.log("events", eventRows.length);
    for (const r of eventRows) console.log(`  ${r.id} ${r.slug} | ${r.title}`);
    console.log("news", newsRows.length);
    for (const r of newsRows) console.log(`  ${r.id} ${r.slug} | ${r.title}`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
