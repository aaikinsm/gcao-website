export const siteContent = {
  orgName: "Ghanaian-Canadian Association of Ontario",
  orgShort: "GCAO",
  tagline: "Strengthening Ghanaian-Canadian communities across Ontario",
  subtagline:
    "Social, cultural, and educational programs serving our community since the 1970s.",
  mission:
    "To enhance the living standards of Ghanaian-Canadians in Ontario through social, cultural, and educational programs, and through other diaspora initiatives.",
  contact: {
    address: "65 Mayall Avenue, North York, ON M3L 1E7",
    hours: "11AM – 4PM (EST), Monday – Friday",
    phone: "1-416-243-2003",
    email: "info@gcaocanada.org",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Events", href: "#events" },
    { label: "News", href: "#news" },
    { label: "Get Involved", href: "#get-involved" },
    { label: "Contact", href: "#contact" },
  ],
  pillars: [
    {
      title: "Programs",
      description:
        "Homework Club, immigration & settlement support, seniors programs, and health education for all ages.",
      icon: "programs",
    },
    {
      title: "Advocacy",
      description:
        "Community voice, diaspora initiatives, and civic engagement that represent Ghanaian-Canadians across Ontario.",
      icon: "advocacy",
    },
    {
      title: "Volunteer",
      description:
        "Join GCAO's volunteer network and help support programs at the Resource Hub and across the community.",
      icon: "volunteer",
    },
  ],
  featuredProgram: {
    title: "GCAO Homework Club",
    description:
      "Free after-school academic support for children in need. Our Homework Club is now open — helping youth build confidence, skills, and community connections.",
    cta: "Learn More",
  },
  featuredEvent: {
    title: "GCAO Homework Club Launch",
    date: "Ongoing — Register Now",
    location: "Resource Hub, 65 Mayall Ave, North York",
    description:
      "We invite children in need of academic support to join our free Homework Club program at the GCAO Resource Hub.",
  },
  news: [
    {
      title: "Ghanaian Community Comes Together for Life-Saving Prostate Cancer Screening",
      category: "Community",
      excerpt:
        "Prostate cancer remains one of the most common cancers affecting men, and research continues to show that Black men — including Ghanaian-Canadians — face elevated risk.",
      tag: "Health",
    },
    {
      title: "Emancipation Month — Continental Africa-Sankofa",
      category: "Events",
      excerpt:
        "As August is Emancipation Month, we closed the month with 'Continental Africa-Sankofa' — a free community celebration of heritage and resilience.",
      tag: "Culture",
    },
    {
      title: "Resource Hub Programs Update",
      category: "Programs",
      excerpt:
        "Youth & Adult programs, Homework Club, Women Support, Men Engagement, and Seniors services continue at our North York Resource Hub.",
      tag: "Programs",
    },
  ],
  placeholders: [
    { label: "Resource Hub exterior — 65 Mayall Ave", aspect: "wide" },
    { label: "Community event / cultural celebration", aspect: "square" },
    { label: "Homework Club / youth program", aspect: "square" },
    { label: "Seniors program / intergenerational gathering", aspect: "wide" },
    { label: "Volunteer team / staff at work", aspect: "square" },
  ],
  stats: [
    { value: "50+", label: "Years serving the community" },
    { value: "6+", label: "Active programs" },
    { value: "1", label: "Community Resource Hub" },
    { value: "1000s", label: "Families supported annually" },
  ],
  about: {
    intro: "Who we are, who we serve, and the work that holds Ghanaian-Canadian communities together.",
    mission:
      "GCAO strengthens the wellbeing of Ghanaian-Canadians across every generation, through trusted social, cultural, educational, and health programs, and advocates for the community as one unified voice.",
    vision:
      "A thriving, sustainable, and connected Ghanaian-Canadian community that belongs, contributes, and leads across Ontario and Canada, with support and opportunity for every generation.",
    whatWeDo:
      "GCAO is a non-profit umbrella for Ghanaian-Canadian people, faith groups, professionals, and community organizations in the Greater Toronto Area.",
    history:
      "GCAO began in the 1970s as Ghanaians arrived in Canada to study and work. The association grew to support newcomers in school and careers, and still does today.\n\nWe partner with community agencies and all levels of government on social policy and programs that improve daily life for Ghanaian residents in Canada.",
    objectives: [
      "Foster acceptance, understanding, and goodwill across multicultural Canada",
      "Build resource centres for social, educational, and welfare programs",
      "Advocate on social welfare, civic engagement, and community development",
      "Engage youth and elders in citizenship and community-building",
      "Coordinate cultural festivals and civic-day events",
      "Support youth through programs, workshops, and seminars",
      "Promote Ghanaian-Canadian businesses through expos and workshops",
      "Advance peace through respect, conflict resolution, and mutual understanding",
      "Offer space for mentorship, reflection, and growth",
      "Showcase local Ghanaian-Canadian businesses and organizations",
      "Grow civic voice, Black wealth, and community wellness",
    ],
    teamGroups: [
      {
        id: "executive",
        label: "Executive Board",
        layout: "cards" as const,
        members: [
          {
            name: "Emmanuel Duodu",
            role: "President",
            image: "/images/team/emmanuel-duodu.jpeg",
            alt: "Portrait of Emmanuel Duodu, GCAO President",
          },
          {
            name: "Juliet Opoku",
            role: "Vice President, Programs",
            image: "/images/team/juliet-opoku.jpeg",
            alt: "Portrait of Juliet Opoku, GCAO Vice President, Programs",
          },
          {
            name: "Mary Akuamoah-Boateng",
            role: "Vice President, Special Projects",
            image: "/images/team/mary-akuamoah-boateng.jpeg",
            alt: "Portrait of Mary Akuamoah-Boateng, GCAO Vice President, Special Projects",
          },
          { name: "Maureen Boateng", role: "Executive Secretary" },
          { name: "Felix S. Agbogah", role: "Finance Director" },
          { name: "Larry Kutuadu", role: "Treasurer" },
          { name: "Joachim Duodu", role: "Technology Director" },
          { name: "Emmanuel Quaye", role: "External Outreach Director" },
        ],
      },
      {
        id: "wings",
        label: "Wing Leaders",
        layout: "cards" as const,
        members: [
          {
            name: "Maud Cole",
            role: "President, Women’s Wing",
            image: "/images/team/maud-cole.jpeg",
            alt: "Portrait of Maud Cole, President of the GCAO Women’s Wing",
          },
          { name: "Liz Okai", role: "Vice President, Women’s Wing" },
          { name: "Kwame Anane Frimpong", role: "Men’s Wing Leader" },
          {
            name: "Michael Ampah Baiden",
            role: "Youth and Young Adult Leader",
            image: "/images/team/michael-ampah-baiden.jpeg",
            alt: "Portrait of Michael Ampah Baiden, GCAO Youth and Young Adult Leader",
          },
          {
            name: "Felicia Botchway",
            role: "Seniors Wing Leader",
            image: "/images/team/felicia-botchway.jpeg",
            alt: "Portrait of Felicia Botchway, GCAO Seniors Wing Leader",
          },
          {
            name: "Naomi Apenteng",
            role: "Welfare Wing Leader",
            image: "/images/team/naomi-apenteng.jpeg",
            alt: "Portrait of Naomi Apenteng, GCAO Welfare Wing Leader",
          },
          { name: "Evelyne Boachie", role: "Homework Club Leader" },
        ],
      },
      {
        id: "staff",
        label: "Staff",
        layout: "cards" as const,
        members: [
          { name: "Joana Gyimah", role: "Office Manager" },
          { name: "Daniella Tibill", role: "Office Assistant" },
        ],
      },
      {
        id: "advisory",
        label: "Advisory Board",
        layout: "list" as const,
        members: [
          { name: "Dr. Victor Awafo", role: "Chairman" },
          { name: "Prince Gbeklui", role: "Member" },
          { name: "Theresa Awuni", role: "Member" },
          { name: "Joseph Ntow-Duku", role: "Member" },
          { name: "Nana Aframea", role: "Member" },
          {
            name: "Kingsley Eyiah",
            role: "Member",
            image: "/images/team/joseph-kingsley-eyiah.jpeg",
            alt: "Portrait of Kingsley Eyiah, GCAO Advisory Board member",
          },
          { name: "John Anati", role: "Member" },
          { name: "Appiah Kubi", role: "Member" },
          { name: "Alhaji Toloba", role: "Member" },
          { name: "Nana Fosu", role: "Member" },
          { name: "Eugene Kotey", role: "Member" },
          { name: "Nana Anokye", role: "Member" },
          { name: "Nana Yaw Richie", role: "Member" },
          { name: "Rita Appiah", role: "Member" },
          { name: "Ray Ansah", role: "Member" },
        ],
      },
    ],
    projects: [
      {
        title: "Homework Club",
        description:
          "Free after-school academic support for children — confidence, skills, and community connection at the Resource Hub.",
        cta: "Support youth learning",
      },
      {
        title: "Resource Hub",
        description:
          "Keep programs, tutoring, settlement support, and community space open at 65 Mayall Avenue.",
        cta: "Donate to the Hub",
      },
      {
        title: "Community campaigns",
        description:
          "Heritage celebrations, health screenings, and World Cup–year community events that bring Ghanaian-Canadians together.",
        cta: "Fuel the next campaign",
      },
    ],
  },
  programsPage: {
    intro:
      "Social, cultural, educational, and wellness programs serving Ghanaian-Canadians across Ontario — from after-school learning to seniors, family wings, mental health training, and diaspora advocacy.",
    homework: {
      title: "Homework Club",
      eyebrow: "Education",
      summary:
        "One of GCAO’s first programs, the Homework Club is an after-school program for elementary to high school students aged 6 to 18. It supports homework completion and broader skill development, run by registered and retired teachers and experienced community members.",
      context:
        "Nearly 50% of Ontario students have failed to meet standards in math and English on EQAO assessments. The Homework Club offers valuable support for working parents and new immigrant families who may face economic or language barriers.",
      mission:
        "To develop a creative, respectful, and intellectual learning environment for the Ghanaian-Canadian community — empowering young leaders to mentor and assist the next generation.",
      offers: [
        "Homework support",
        "Mentorship",
        "Summer camp",
        "Language and cultural education",
        "Seminars and educational opportunities",
      ],
      schedule: "Every Sunday afternoon from 3:30 p.m. to 5:00 p.m.",
      contact: "asp@gcaocanada.org",
      contactLabel: "Mr. Eyiah",
      image: "/images/programs/homework.jpg",
      alt: "GCAO Homework Club online classes",
    },
    community: {
      title: "Youth · Seniors · Women · Men",
      eyebrow: "Community wings",
      summary:
        "Four interconnected wings keep Ghanaian-Canadian families supported across generations — leadership for youth, connection for seniors, empowerment for women, and fellowship for men.",
      groups: [
        {
          id: "youth",
          title: "Youth & Young Adults",
          summary:
            "GCAO’s Youth Wing elevates and inspires young people to act as positive change agents in local communities.",
          highlights: [
            "Youth Leadership Summit workshops",
            "Mentorship for ages 18–29",
            "Leadership, entrepreneurship & identity seminars",
            "Scholarships for students of Ghanaian heritage",
          ],
          image: "/images/programs/youth-soccer.jpg",
          alt: "Participants at GCAO Youth Soccer Camp",
        },
        {
          id: "seniors",
          title: "Golden Ages Seniors",
          summary:
            "A community-based program for Ghanaian-Canadian seniors 65+ that promotes active aging, reduces isolation, and strengthens social connection — engaging 400+ seniors with support from the Ontario Seniors Community Grant Program.",
          highlights: [
            "Virtual fitness, Zumba & fall-prevention classes",
            "Health education on chronic disease and wellness",
            "Social engagement and community connection",
            "Culturally relevant lifelong learning",
          ],
          image: "/images/programs/seniors.jpg",
          alt: "GCAO seniors program participants",
        },
        {
          id: "women",
          title: "Women’s Program",
          summary:
            "A community-centered initiative empowering women and girls through culturally responsive spaces for connection, learning, and resources that support personal, professional, and family well-being.",
          highlights: [
            "Health, wellness & self-care",
            "Financial literacy & economic empowerment",
            "Leadership and mentorship",
            "Gender-based violence awareness",
          ],
          image: "/images/womens-conf.jpg",
          alt: "GCAO Women’s Empowerment Conference",
        },
        {
          id: "men",
          title: "Men’s Group",
          summary:
            "A safe space where Ghanaian and non-Ghanaian men of all ages discuss, learn, teach, mentor each other, and build community.",
          highlights: [
            "Mental health and complete well-being",
            "Financial education and professional networks",
            "Passing culture and tradition to youth",
            "Marriage and relationships conversations",
          ],
          image: "/images/programs/mens-group.jpeg",
          alt: "GCAO Men’s Group gathering",
        },
      ],
    },
    health: {
      title: "Health & wellness",
      eyebrow: "Mental Health First Aid",
      summary:
        "Mental Health First Aid for Africans in the Diaspora builds capacity among Black Canadians and African diaspora communities through culturally focused MHFA courses and training.",
      context:
        "Mental health supports are often the least available resources for African immigrants. Incorporating culture into MHFA increases uptake and helps communities address unique barriers to care.",
      highlights: [
        "Culturally relevant Mental Health First Aid courses",
        "Capacity building for community responders",
        "Training delivered across Canadian cities",
        "Education that reduces stigma and superstition around mental health",
      ],
      image: "/images/programs/health.jpg",
      alt: "Mental Health First Aid training with GCAO participants",
    },
    dett: {
      title: "Diaspora Engagement Think Tank (DETT)",
      eyebrow: "Advocacy",
      summary:
        "DETT is a non-profit, voluntary organization anchored under GCAO in Toronto that promotes critical analysis of policies and community challenges — and advocacy to support Ghanaian-Canadians in Canada or wishing to return to Ghana.",
      mission:
        "Voice of the Ghanaian-Canadian community in developing policies and partnering with governments, professional, and business groups to meet community challenges.",
      vision:
        "To be recognized by Ghanaian-Canadians in the diaspora as serving their interests in advocacy on community challenges.",
      membership:
        "A constituted body of subject-matter experts from academia, industry, and community organizations, by special invitation from the GCAO executive board.",
      benefits: [
        "Close knowledge gaps that block equitable policy for Ghanaian-Canadian communities",
        "Advocate for diaspora interests with governments and partners",
        "Network with think tanks in Canada and beyond",
        "Collate ideas and develop policies for Canadian–Ghanaian challenges",
      ],
      image: "/images/programs/grocery.jpg",
      alt: "GCAO community food program volunteers",
    },
  },
};

export const previewMeta = [
  {
    id: "sankofa-light",
    option: "A",
    description:
      "Light Sankofa. Cream canvas, green accents, full-bleed video hero, scroll-filled mission, CEE-style headlines.",
    bestFor: "Daytime readability and everyday visitors",
    href: "/preview/sankofa-light",
  },
  {
    id: "sankofa",
    option: "B",
    description:
      "Dark Sankofa. Forest canvas, gold accents, the same Obama.org video hero and interactive text system.",
    bestFor: "A bold, memorable brand statement",
    href: "/preview/sankofa",
  },
];
