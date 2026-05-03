import type { Skill } from '@/types'

export const skills: Skill[] = [
  // Architecture
  { name: "Architectural design", category: "architecture", proficiency: 3, years: 4 },

  // Cloud
  { name: 'AWS', category: 'cloud', proficiency: 4, years: 7 },

  // Containers & Orchestration
  { name: 'Kubernetes', category: 'orchestration', proficiency: 5, years: 5 },
  { name: 'Helm', category: 'orchestration', proficiency: 4, years: 5 },
  { name: 'Docker', category: 'containers', proficiency: 5, years: 6 },

  // DevOps
  { name: 'CI/CD', category: 'devops', proficiency: 5, years: 4 },
  { name: 'Git', category: 'devops', proficiency: 5, years: 6 },

  // Infrastructure as Code
  { name: 'Terraform', category: 'iac', proficiency: 4, years: 3 },

  // Monitoring
  { name: 'Prometheus', category: 'monitoring', proficiency: 4, years: 4 },
  { name: 'Grafana', category: 'monitoring', proficiency: 4, years: 4 },

  // OS
  { name: 'Linux', category: 'os', proficiency: 5, years: 8 },

  // Languages
  { name: 'Python', category: 'languages', proficiency: 4, years: 7 },

  // Networking
  { name: 'Nginx', category: 'networking', proficiency: 4, years: 7 },

  // Databases
  { name: 'Database optimization', category: 'database', proficiency: 4, years: 4 },
];