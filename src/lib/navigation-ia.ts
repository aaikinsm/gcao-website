export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
  note?: string;
};

export type PageMerge = {
  oldPath: string;
  newLocation: string;
  section: string;
};

export type LowValuePage = {
  name: string;
  summary: string;
};

export type DroppedPage = {
  slug: string;
  reason: string;
};

export const navComparison = {
  before: { totalLinks: 30, topLevelCount: 10 },
  after: { totalLinks: 17, topLevelCount: 6 },
};

export const todayProblems = [
  "Broken Events link and duplicate homepages",
  "5 separate news/media entry points",
  "Mental health split across 3 menu items",
  "Volunteer & Registration not grouped logically",
];

export const proposedNav: NavItem[] = [
  {
    label: "About",
    children: [
      { label: "Mission & history" },
      { label: "Team" },
      { label: "Impact stats" },
      { label: "Projects & fundraising" },
    ],
  },
  {
    label: "Programs",
    children: [
      { label: "All programs" },
      { label: "Homework Club" },
      { label: "Youth · Seniors · Women · Men" },
      { label: "Health & wellness" },
      { label: "Chamber of Commerce · DETT" },
    ],
  },
  {
    label: "Events",
    children: [
      { label: "Upcoming & past events" },
      { label: "Featured campaigns (e.g. Black Stars 2026)" },
    ],
  },
  {
    label: "News",
    children: [
      { label: "Community news" },
      { label: "Editorials · Bulletin · Archive" },
    ],
  },
  {
    label: "Get Involved",
    children: [
      { label: "Volunteer · Membership · Jobs" },
      { label: "Donate (also header button)" },
    ],
  },
  {
    label: "Contact",
    children: [
      { label: "Contact form" },
      { label: "Resource Hub — 65 Mayall Ave" },
    ],
  },
];

export const pageMap: PageMerge[] = [
  { section: "About", oldPath: "/about-us/", newLocation: "/about" },
  { section: "About", oldPath: "/our-team/", newLocation: "/about/team" },
  { section: "About", oldPath: "/our-impact/", newLocation: "/about#impact" },
  { section: "About", oldPath: "/projects/", newLocation: "/about/projects" },
  { section: "Programs", oldPath: "/programs/", newLocation: "/programs" },
  { section: "Programs", oldPath: "/homework-club/", newLocation: "/programs/homework-club" },
  { section: "Programs", oldPath: "/youth-young-adults/", newLocation: "/programs/youth" },
  { section: "Programs", oldPath: "/seniors-program/", newLocation: "/programs/seniors" },
  { section: "Programs", oldPath: "/womens-group/", newLocation: "/programs/women" },
  { section: "Programs", oldPath: "/programs/mens-group/", newLocation: "/programs/men" },
  { section: "Programs", oldPath: "/mentalhealth/", newLocation: "/programs/health" },
  { section: "Programs", oldPath: "/training/", newLocation: "/programs/health#training" },
  { section: "Programs", oldPath: "/resources/", newLocation: "/programs/health#resources" },
  { section: "Programs", oldPath: "/chamber-of-commerce/", newLocation: "/programs/chamber-of-commerce" },
  { section: "Programs", oldPath: "/diaspora-engagement-think-tank-dett/", newLocation: "/programs/dett" },
  { section: "Events", oldPath: "/events-list/", newLocation: "/events" },
  { section: "Events", oldPath: "/black-stars/", newLocation: "/events/campaigns/black-stars-2026" },
  { section: "News", oldPath: "/blog-list/", newLocation: "/news" },
  { section: "News", oldPath: "/editorials/", newLocation: "/news?category=editorials" },
  { section: "News", oldPath: "Community News (47 posts)", newLocation: "/news?category=news" },
  { section: "News", oldPath: "Community bulletin (25 posts)", newLocation: "/news?category=bulletin" },
  { section: "News", oldPath: "COVID-19 (8 posts)", newLocation: "/news?category=archive" },
  { section: "Get Involved", oldPath: "/become-volunteer/", newLocation: "/get-involved#volunteer" },
  { section: "Get Involved", oldPath: "/registration/", newLocation: "/get-involved#membership" },
  { section: "Get Involved", oldPath: "/job-postings/", newLocation: "/get-involved#jobs" },
  { section: "Contact", oldPath: "/contact/", newLocation: "/contact" },
  { section: "Contact", oldPath: "Resource Hub info", newLocation: "/contact#visit" },
  { section: "Footer", oldPath: "/marketplace/", newLocation: "/marketplace" },
  { section: "Footer", oldPath: "Vendor signup", newLocation: "/marketplace/signup" },
  { section: "Footer", oldPath: "/services/", newLocation: "/partners" },
  { section: "Footer", oldPath: "/newsletters-reports/", newLocation: "/newsletters" },
  { section: "Footer", oldPath: "/galllery/", newLocation: "/gallery" },
  { section: "Footer", oldPath: "/covid-19-resources/", newLocation: "/resources/covid-19" },
  { section: "Footer", oldPath: "/faq/", newLocation: "/faq" },
];

export const lowValuePages: LowValuePage[] = [
  { name: "Our Impact", summary: "Merge into About; update stats in CMS." },
  { name: "COVID-19", summary: "Archive under News; footer link only." },
  { name: "Black Stars 2026", summary: "Featured on Events until mid-2026, then archive." },
  { name: "COVID Trust Fund", summary: "Archive; keep Resource Center project on About/Donate." },
  { name: "Registration", summary: "Rebuild broken form on Get Involved." },
  { name: "Gallery", summary: "Footer only unless staff will maintain it." },
  { name: "Newsletters/Reports", summary: "Footer only — PDF archive for members." },
];

export const droppedPages: DroppedPage[] = [
  { slug: "hom, home-three, new", reason: "Duplicate homepages" },
  { slug: "blog, blog-grid, blog-list", reason: "Duplicate blog layouts" },
  { slug: "cart, checkout, shop, my-account", reason: "Unused WooCommerce" },
  { slug: "crowdfundly-*, donor-dashboard-*", reason: "Donation plugin shells" },
  { slug: "customer-cabinet", reason: "Empty plugin page" },
  { slug: "business-form, professional-services-form", reason: "Orphan forms" },
  { slug: "causes-grid, event-grid", reason: "Theme demo layouts" },
  { slug: "gallery + galllery", reason: "Duplicate gallery pages" },
  { slug: "virtual", reason: "Empty or stale" },
];

export const footerLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Partners", href: "/partners" },
  { label: "Newsletters & Reports", href: "/newsletters" },
  { label: "Gallery", href: "/gallery" },
  { label: "COVID-19 Resources", href: "/resources/covid-19" },
  { label: "FAQ", href: "/faq" },
];
