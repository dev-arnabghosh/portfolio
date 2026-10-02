export interface Profile {
    name: string;
    title: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    experience: string;
    linkedin: string;
    github: string;
}

export interface Experience {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
}

export interface Skill {
  name: string;
  icon: string;
}

export interface Skills {
  languages: Skill[];
  backend: Skill[];
  frontendAndMobile: Skill[];
  databases: Skill[];
  toolsAndDevelopment: Skill[];
  practices: Skill[];
}

export interface Education {
    degree: string;
    field?: string;
    institution: string;
    university: string;
    startYear?: string;
    endYear: string;
    cgpa?: string;
    percentage?: string;
    coursework?: string[];
}

export interface AchievementAward {
    title: string;
    date: string;
    count?: number;
}

export interface AchievementImpact {
    value: string;
    label: string;
    description: string;
}

export interface Achievements {
    awards: AchievementAward[];
    impact: AchievementImpact[];
}

export interface Social {
    linkedin: string;
    github: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    image?: string;
    liveUrl?: string;
    githubUrl?: string;
}

