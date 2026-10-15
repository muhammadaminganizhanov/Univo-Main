import type { Dictionary } from "./ru";

/** English — the full international version. Same facts as Russian, written for an English reader. */
export const en: Dictionary = {
  meta: {
    siteName: "UNIVO",
    home: {
      title: "UNIVO — a group of directions and products",
      description:
        "UNIVO is the masterbrand of a group: technology, production and its own products for retail and online booking. Different businesses, one standard of work.",
    },
    ecosystem: {
      title: "Ecosystem",
      description:
        "UNIVO TECH and UNIVO PRODUCTION directions and the UNIVO RETAIL and UNIVO SLOT products: what each part of the group does and how to reach it.",
    },
    about: {
      title: "About the group",
      description: "What UNIVO is, what connects the group's different businesses and the standards every part of it works by.",
    },
    contact: {
      title: "Discuss a project",
      description: "One form for the whole UNIVO group: describe the task and we will find the part of the group that solves it.",
    },
    earlyAccess: {
      description: "{name} is launching soon. Request early access.",
    },
    notFound: { title: "Page not found" },
  },

  common: {
    skipToContent: "Skip to content",
    nav: {
      label: "Main navigation",
      home: "Home",
      ecosystem: "Ecosystem",
      about: "About",
      contact: "Contact",
    },
    cta: {
      discuss: "Discuss a project",
      ecosystem: "The UNIVO ecosystem",
    },
    menu: {
      open: "Menu",
      close: "Close",
      title: "Menu",
    },
    locale: {
      label: "Site language",
    },
    group: {
      label: "Group sites",
      heading: "UNIVO group",
      current: "You are here",
      siteSoon: "Site in progress",
    },
    footer: {
      navTitle: "UNIVO",
      ecosystemTitle: "Ecosystem",
      contactTitle: "Get in touch",
      contactForm: "Write to us via the form",
      languagesTitle: "Languages",
      copyright: "© {year} UNIVO",
      privacy: "Privacy policy",
      terms: "Terms of use",
    },
    entity: {
      siteSoon: "The direction's site is in progress",
      discussWith: "Discuss a project with {name}",
      fields: {
        type: "Type",
        status: "Status",
        market: "Market",
        scope: "What it covers",
        segments: "First segments",
      },
    },
  },

  home: {
    hero: {
      title: "Different work. One standard",
      lead: "UNIVO is a group of directions and products run by the same owners. We take every piece of work to a working result and stand behind it.",
      structure: "The group",
      sourceRole: "Masterbrand",
      services: "Directions",
      products: "Products",
      next: "The next part of the group",
    },
    system: {
      statement: "One name for different businesses. What connects them is not an industry but a standard of work",
      caption: "Five standards run through every part of the group — and through every next one.",
      next: "The group's next business",
      more: "How the group is built",
      choose: "Choose a standard",
      applies: "The check applies to every part of the group",
      passes: "checked",
    },
    ecosystem: {
      title: "Two directions. Two products.",
      lead: "Directions do the work for your business. Products are systems your business uses on its own.",
      servicesTitle: "Directions",
      servicesNote: "Work on the client's task",
      productsTitle: "Products",
      productsNote: "Used by the business itself",
      next: "A new direction or product joins the same line",
      all: "The whole ecosystem",
    },
    how: {
      title: "One entry point for the whole group",
      lead: "A task enters UNIVO once. From there, the group builds the route.",
      steps: [
        { title: "Task", text: "You describe the task. There is no need to pick a direction in advance." },
        { title: "Route", text: "UNIVO decides who takes it on: one direction, several together, or a group product." },
        { title: "Owner", text: "Every project has one accountable person, named from the start." },
        { title: "Result", text: "The work is done when you can use it — and it is clear who supports it afterwards." },
      ],
      example: "For example, a launch website and a video: one project, one conversation.",
    },
  },

  end: {
    title: "Describe your task in two sentences",
    body: "We will work out the route inside the group.",
  },

  standards: [
    {
      title: "Result",
      text: "Work is done when it can be used: the system is live, the video is out.",
      check: "You can show what people are already using.",
    },
    {
      title: "System",
      text: "Every business has a process that can be repeated. Quality does not depend on who is on shift today.",
      check: "The process is written down, and a new employee can follow it.",
    },
    {
      title: "Clarity",
      text: "It is clear what you get, when and for how much. No small print, no advertising words.",
      check: "The terms fit on one page and match the contract.",
    },
    {
      title: "Accountability",
      text: "Every decision has someone accountable for it, and you know who in advance.",
      check: "A project, product or location has one named accountable person.",
    },
    {
      title: "Built to last",
      text: "We build things that should work for years, not just look good on launch day.",
      check: "There is a support plan after launch and someone who carries it out.",
    },
  ],
  standardsLabels: { rule: "Rule", check: "Check" },

  ecosystem: {
    intro: {
      title: "The UNIVO ecosystem",
      lead: "One line that carries the group's directions and products. Directions work on a client's task. Products are systems a business connects and uses on its own.",
    },
    map: {
      label: "Map of the group",
      source: "Masterbrand",
      services: "Directions",
      products: "Products",
      legendLive: "Live",
      legendLaunching: "Preparing to launch",
      openEnd: "New directions and products join this same line",
    },
    profiles: {
      scope: "What it does",
      market: "Market",
      process: "How the work runs",
      processSteps: ["Script", "Shoot", "Edit"],
      formats: "Formats",
      formatItems: ["Commercials", "Social media content"],
    },
    products: {
      title: "Our own products",
      lead: "Systems UNIVO builds for businesses. Both products are preparing to launch.",
      problem: "The problem it solves",
      modules: "What it is made of",
      segments: "First segments",
      retailFlow: "How goods move",
      retailFlowSteps: ["Warehouse", "Stock", "Branches", "Sales"],
      retailLedger: "Business control",
      slotAxis: "Time and availability",
      slotBooked: "Appointment",
      slotFree: "Free slot",
      slotModules: "What it is made of",
    },
    together: {
      title: "How the parts work together",
      steps: [
        { title: "One entry", text: "You can bring a task to UNIVO without knowing which direction you need." },
        { title: "One route", text: "The group decides who takes it on." },
        { title: "Several crafts", text: "When a task needs different directions, they work on it together." },
        { title: "One owner", text: "The project owner is named from the start." },
        { title: "One project", text: "For the client it is one project and one conversation, not several contractors." },
      ],
    },
  },

  about: {
    hero: {
      title: "A group connected by a standard of work",
      lead: "Not an industry, not a type of client. The way each business is built: taken to a working result, with someone accountable for it.",
    },
    identity: {
      statement: "UNIVO is a masterbrand. One name for the directions, products and companies of the same owners.",
      notes: [
        "Today the group has two directions and two products.",
        "The masterbrand is tied neither to an industry nor to a type of client: businesses from other industries may join later.",
        "The group starts its work in Kyrgyzstan.",
      ],
    },
    why: {
      title: "Different crafts. One standard",
      differs: "Different",
      shared: "Shared",
      sharedText: "Result, system, clarity, accountability, built to last",
      note: "For the client the result is the same: something that works in their business.",
    },
    result: {
      statement: "Work is done when it can be used",
      examples: [
        "The system is live, and the client's team works in it every day.",
        "The video is out and working for the brand.",
        "The product is connected and does its job without us.",
      ],
    },
    standards: {
      title: "Five standards, as working rules",
      lead: "They are shared by every part of UNIVO. Each comes with a check that shows whether it is met.",
    },
    join: {
      title: "How a new business becomes part of UNIVO",
      lead: "A universal group does not mean any business. The type of client does not matter.",
      start: "A business",
      pass: "Part of UNIVO",
      fail: "Did not pass — it may belong to the owners, but it does not carry the UNIVO name.",
      items: [
        { title: "Ownership", text: "The group owns or runs the business. A partner project or a client commission does not become part of UNIVO." },
        { title: "Standard", text: "It works by the group's five standards." },
        { title: "Purpose", text: "The group's name helps the business, and the business does not dilute the group's name." },
        { title: "Decision", text: "Its place — direction, product or company — is approved before launch." },
      ],
    },
    character: {
      title: "How UNIVO thinks and speaks",
      not: "not",
      items: [
        ["Systematic", "bureaucratic"],
        ["Confident", "loud"],
        ["Contemporary", "trendy"],
        ["Ambitious", "arrogant"],
        ["Flexible", "inconsistent"],
        ["Thoughtful", "overcomplicated"],
        ["International", "faceless"],
        ["Specific", "dry"],
      ],
    },
  },

  contact: {
    hero: {
      title: "Discuss a project",
      lead: "Describe the task. We will work out the route inside the group.",
    },
    route: {
      title: "What happens to your task",
      entry: "You",
      steps: [
        "The task enters UNIVO — one entry point for the whole group.",
        "We work out the route: a direction, several directions or a product.",
        "We get in touch via your contact and propose the next step.",
      ],
      routeLabel: "Possible route",
      decide: "UNIVO will decide the route",
    },
    groups: {
      task: "Task",
      contact: "How to reach you",
      direction: "Direction",
      directionHint: "If you already know. If not, we will work out the route.",
    },
    products: {
      title: "Early access to products",
      text: "UNIVO RETAIL and UNIVO SLOT have their own forms.",
    },
    direct: {
      title: "UNIVO contacts",
      email: "Email",
      phone: "Phone",
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      city: "City",
    },
  },

  earlyAccess: {
    back: "Ecosystem",
    label: "Product",
    scopeTitle: "What the system will cover",
    segmentsTitle: "Who it is for first",
    note: "The product is preparing to launch. Features and timing may change.",
  },

  forms: {
    optional: "optional",
    required: "required",
    name: "Name",
    company: "Company",
    contact: "Phone, email or Telegram",
    contactHint: "We will reply wherever suits you.",
    contactPlaceholder: "+996 … or name@company.com",
    interest: "What are you interested in?",
    interests: {
      tech: "UNIVO TECH",
      production: "UNIVO PRODUCTION",
      retail: "UNIVO RETAIL",
      slot: "UNIVO SLOT",
      unsure: "Let UNIVO decide",
    },
    message: "Task",
    messageLong: "Describe the task in two sentences",
    messagePlaceholder: "For example: we need a website and a video for opening our second branch.",
    business: "Business",
    businessHint: "Name and field, for example: “Building supplies store, 2 branches”.",
    comment: "Comment",
    commentPlaceholder: "What is inconvenient today and what you want to solve",
    consent: "I agree that UNIVO may process the data in this form to reply to my request.",
    submitContact: "Send",
    submitEarlyAccess: "Get early access",
    submitting: "Sending…",
    earlyAccessTitle: "Get early access",
    earlyAccessLead: "Leave your contact and we will let you know when {name} is ready for its first clients.",
    invalidSummary: "Please check the fields marked below.",
    errors: {
      required: "Please fill in this field.",
      too_short: "Too short — add a few words.",
      too_long: "Too long — please shorten it.",
      invalid_contact: "Enter a phone number (e.g. +996 555 123 456), an email or a Telegram @username.",
      invalid_choice: "Choose an option from the list.",
      consent_required: "We cannot accept the request without your consent.",
    },
    stagingNote: "Test mode: requests from this form are not sent anywhere yet.",
    staged: {
      title: "Request checked, but not sent",
      body: "The site is in test mode: your data passed server validation, but nobody will receive it. Requests will be accepted once the site launches.",
    },
    sent: {
      title: "Request sent",
      body: "We will reply via the contact you left.",
    },
    failed: {
      title: "The request could not be sent",
      body: "The request channel is unavailable right now. Your input is still in the form — please try again later.",
    },
    again: "Fill in again",
  },

  notFound: {
    title: "Page not found",
    body: "The address may have changed. Start from the home page or the ecosystem.",
    home: "Go to home page",
  },
};
