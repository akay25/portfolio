import type { Experience } from '@/types'

export const experience: Experience[] = [
  {
    company: 'ACID Technologies',
    role: 'DevOps Engineer',
    period: '2019-06 — Present',
    description: 'Built CI/CD pipelines and managed cloud infrastructure for a data analytics platform. Implemented infrastructure-as-code across 3 environments with zero-downtime deployments.',
    techUsed: ['Docker', 'Jenkins', 'Terraform', 'AWS', 'Ansible', 'PostgreSQL'],
  },
  {
    company: 'BotBakery',
    role: 'Cyber Security and Infrastructure Intern',
    period: '2018-06 — 2019-01',
    description: 'I was working as  Cyber Security and Infrastructure intern. My role consists of migrating sites from one domain to another, setting up instances on different cloud platforms, recovering lost/ damaged sites or instances, fixing malware infected sites, scheduling backups, analysing resource consumption of different sites to purpose the best architecture for the business needs.',
    techUsed: [
      'Linux',
      'DNS',
      'Domain Management',
      'Cloud Platforms',
      'Virtual Machines',
      'Backup & Recovery',
      'Disaster Recovery',
      'Malware Removal',
      'Security Hardening',
      'Monitoring',
      'Resource Optimization'
    ],
  },
]
