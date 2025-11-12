// Mock data for materials and discussions
export const mockMaterials = [
  {
    id: "m1",
    title: "Operating Systems - Lecture Notes",
    subject: "Operating Systems",
    branch: "CSE",
    uploader: "AM.SC.U4CSE23101",
    type: "pdf",
    uploadedAt: "2025-10-01",
    downloads: 34,
    description: "Comprehensive notes covering scheduling, memory, and file systems."
  },
  {
    id: "m2",
    title: "Thermodynamics - Important Formulas",
    subject: "Thermodynamics",
    branch: "MEC",
    uploader: "AM.EN.U4MEC23105",
    type: "pdf",
    uploadedAt: "2025-10-02",
    downloads: 12,
    description: "One-page PDF of key thermodynamics formulas."
  },
  {
    id: "m3",
    title: "Digital Logic - Past Year Questions",
    subject: "Digital Logic",
    branch: "CSE",
    uploader: "AM.SC.U4CSE23103",
    type: "pyq",
    uploadedAt: "2025-10-05",
    downloads: 52,
    description: "Compilation of PYQs of last 5 years."
  },
  {
    id: "m4",
    title: "Mechanics - Short Notes",
    subject: "Mechanics",
    branch: "MEC",
    uploader: "AM.EN.U4MEC23120",
    type: "ppt",
    uploadedAt: "2025-09-28",
    downloads: 5,
    description: "Slide deck for quick revision."
  }
];

export const mockDiscussions = [
  {
    id: "d1",
    title: "How to approach OS scheduling questions?",
    branch: "CSE",
    author: "AM.SC.U4CSE23101",
    createdAt: "2025-10-07",
    replies: [
      { id: "r1", text: "Start with concepts, then solve sample problems.", author: "AM.SC.U4CSE23102", createdAt: "2025-10-07" }
    ]
  },
  {
    id: "d2",
    title: "Which topics from Thermodynamics are most important?",
    branch: "MEC",
    author: "AM.EN.U4MEC23105",
    createdAt: "2025-10-05",
    replies: []
  }
];
