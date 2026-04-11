import type { Experience } from '@/types'

export const experience: Experience[] = [
  {
    company: 'CloudScale Inc',
    role: 'Senior DevOps Engineer',
    period: '2023-01 — Present',
    description: 'Leading infrastructure automation and cloud-native migration. Designed and maintained Kubernetes clusters serving 50M+ requests/day. Reduced deployment time by 70% through GitOps adoption.',
    techUsed: ['Kubernetes', 'Terraform', 'AWS', 'ArgoCD', 'Prometheus', 'GitHub Actions'],
  },
  {
    company: 'DataFlow Systems',
    role: 'DevOps Engineer',
    period: '2021-03 — 2022-12',
    description: 'Built CI/CD pipelines and managed cloud infrastructure for a data analytics platform. Implemented infrastructure-as-code across 3 environments with zero-downtime deployments.',
    techUsed: ['Docker', 'Jenkins', 'Terraform', 'AWS', 'Ansible', 'PostgreSQL'],
  },
  {
    company: 'WebCraft Agency',
    role: 'Junior Systems Engineer',
    period: '2019-06 — 2021-02',
    description: 'Managed Linux servers, automated deployments with Ansible, and set up monitoring with Prometheus and Grafana. First exposure to container orchestration with Docker Swarm.',
    techUsed: ['Linux', 'Ansible', 'Docker', 'Nginx', 'Grafana', 'Bash'],
  },
]
