import profileData from "@/data/profile.json";
import experienceData from "@/data/experience.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import educationData from "@/data/education.json";
import achievementsData from "@/data/achievements.json";
import socialData from "@/data/social.json";

import type {
    Achievements,
    Education,
    Experience,
    Profile,
    Project,
    Skills,
    Social,
} from "@/types/portfolio";

export const profile: Profile = profileData;

export const experience: Experience[] = experienceData;

export const projects: Project[] = projectsData;

export const skills: Skills = skillsData;

export const education: Education[] = educationData;

export const achievements: Achievements = achievementsData;

export const social: Social = socialData;

/**
 * Controls whether each portfolio section has data
 * and should be rendered/displayed.
 */
export const sectionAvailability = {
    about: Boolean(
        profile.name ||
        profile.title ||
        profile.headline
    ),

    experience: experience.length > 0,

    skills: Object.values(skills).some(
        (category) => category.length > 0
    ),

    projects: projects.length > 0,

    education: education.length > 0,

    achievements:
    achievements.awards.length > 0 ||
    achievements.impact.length > 0,

    contact: Boolean(
        profile.email ||
        profile.phone ||
        profile.linkedin ||
        profile.github
    ),
};