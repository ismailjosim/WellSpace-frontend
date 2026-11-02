export const doctorQualifications: string[] = [
  // Undergraduate medical degrees
  "MBBS",
  "BDS",
  "BAMS",
  "BHMS",
  "BUMS",
  "BPT",
  "BSc Nursing",
  "BPharm",

  // Postgraduate degrees
  "MD",
  "MS",
  "MDS",
  "MPH",
  "MSc",
  "MPhil",
  "PhD",
  "DNB",
  "FCPS",
  "MRCP",
  "MRCS",
  "MRCOG",
  "FRCS",
  "FRCP",
  "FRCOG",
  "FACS",
  "FACP",

  // Diplomas
  "DCH",
  "DGO",
  "DLO",
  "DO",
  "DA",
  "D-Ortho",
  "DTM&H",
  "Diploma in Cardiology",
  "Diploma in Dermatology",
  "Diploma in Radiology",

  // Super-specialty degrees
  "DM",
  "MCh",
  "DM Cardiology",
  "DM Neurology",
  "DM Gastroenterology",
  "DM Nephrology",
  "DM Endocrinology",
  "DM Oncology",
  "MCh Neurosurgery",
  "MCh Cardiothoracic Surgery",
  "MCh Urology",
  "MCh Plastic Surgery",
  "MCh Pediatric Surgery",
];

export const doctorQualificationOptions = doctorQualifications.map((q) => ({
  value: q,
  label: q,
}));
