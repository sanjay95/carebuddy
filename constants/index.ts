export const GenderOptions = ["male", "female", "other"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const Department = [
  {
    name: "Cardiology",
    image: "https://healthicons.org/icons/svg/outline/body/heart_organ.svg",
    doctors: ["John Green", "Leila Cameron", "David Livingston"],
  },
  {
    name: "Dermatology",
    image: "https://healthicons.org/icons/svg/outline/body/body.svg",
    doctors: ["Evan Peter", "Jane Powell", "Alex Ramirez"],
  },
  {
    name: "Endocrinology",
    image: "https://healthicons.org/icons/svg/outline/specialties/endocrinology.svg",
    doctors: ["Jasmine Lee", "Alyana Cruz", "Hardik Sharma"],
  },
  {
    name: "Gastroenterology",
    image: "https://healthicons.org/icons/svg/outline/specialties/gastroenterology.svg",
    doctors: ["John Green", "Leila Cameron", "David Livingston"],
  },
  {
    name: "Hematology",
    image: "https://healthicons.org/icons/svg/outline/specialties/hematology.svg",
    doctors: ["Evan Peter", "Jane Powell", "Alex Ramirez"],
  },
  {
    name: "Infectious Disease",
    image: "https://healthicons.org/icons/svg/outline/symbols/outbreak.svg",
    doctors: ["Jasmine Lee", "Alyana Cruz", "Hardik Sharma"],
  },
  {
    name: "Nephrology",
    image: "https://healthicons.org/icons/svg/outline/specialties/nephrology.svg",
    doctors: ["John Green", "Leila Cameron", "David Livingston"],
  },
  {
    name: "Neurology",
    image: "https://healthicons.org/icons/svg/outline/body/neurology.svg",
    doctors: ["Evan Peter", "Jane Powell", "Alex Ramirez"],
  },
  {
    name: "Oncology",
    image: "https://healthicons.org/icons/svg/outline/specialties/oncology.svg",
    doctors: ["Jasmine Lee", "Alyana Cruz", "Hardik Sharma"],
  },
  {
    name: "Ophthalmology",
    image: "https://healthicons.org/icons/svg/outline/devices/contact_lenses.svg",
    doctors: ["John Green", "Leila Cameron", "David Livingston"],
  },
  {
    name: "Orthopedics",
    image: "https://healthicons.org/icons/svg/outline/body/joints.svg",
    doctors: ["Evan Peter", "Jane Powell", "Alex Ramirez"],
  },
  {
    name: "Pulmonology",
    image: "https://healthicons.org/icons/svg/outline/body/lungs.svg",
    doctors: ["Evan Peter", "Jane Powell", "Alex Ramirez"],
  },
  {
    name: "Rheumatology",
    image: "https://healthicons.org/icons/svg/outline/specialties/rheumatology.svg",
    doctors: ["John Green", "Leila Cameron", "David Livingston"],
  },
  {
    name: "Urology",
    image: "https://healthicons.org/icons/svg/outline/specialties/urology.svg",
    doctors: ["Evan Peter", "Jane Powell", "Alex Ramirez"],
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};