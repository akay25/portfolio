import type { Skill } from '@/types'

export const skills: Skill[] = [
  // Architecture
  { name: "Architectural design", category: "architecture", proficiency: 3, years: 4 },

  // Cloud
  { name: 'AWS', category: 'cloud', proficiency: 4, years: 7 },
  { name: 'DigitalOcean', category: 'cloud', proficiency: 3, years: 4 },
  { name: 'Google Cloud', category: 'cloud', proficiency: 2, years: 2 },

  // Containers & Orchestration
  { name: 'Kubernetes', category: 'orchestration', proficiency: 5, years: 5 },
  { name: 'Helm', category: 'orchestration', proficiency: 4, years: 5 },
  { name: 'K3s', category: 'orchestration', proficiency: 4, years: 2 },
  { name: 'EKS', category: 'orchestration', proficiency: 3, years: 3 },
  { name: 'KEDA', category: 'orchestration', proficiency: 3, years: 2 },
  { name: 'Karpenter', category: 'orchestration', proficiency: 3, years: 2 },
  { name: 'Docker', category: 'containers', proficiency: 5, years: 6 },
  { name: 'Podman', category: 'containers', proficiency: 3, years: 2 },

  // DevOps
  { name: 'CI/CD', category: 'devops', proficiency: 5, years: 4 },
  { name: 'Git', category: 'devops', proficiency: 5, years: 6 },
  { name: 'Jenkins', category: 'devops', proficiency: 4, years: 5 },
  { name: 'ArgoCD', category: 'devops', proficiency: 4, years: 3 },
  { name: 'GitHub Actions', category: 'devops', proficiency: 4, years: 4 },

  // Infrastructure as Code
  { name: 'Terraform', category: 'iac', proficiency: 4, years: 3 },

  // Monitoring
  { name: 'Prometheus', category: 'monitoring', proficiency: 4, years: 4 },
  { name: 'Grafana', category: 'monitoring', proficiency: 4, years: 4 },
  { name: 'Fluent Bit', category: 'monitoring', proficiency: 4, years: 3 },
  { name: 'OpenTelemetry', category: 'monitoring', proficiency: 3, years: 2 },
  { name: 'OpenObserve', category: 'monitoring', proficiency: 3, years: 2 },
  { name: 'SigNoz', category: 'monitoring', proficiency: 3, years: 2 },
  { name: 'Elasticsearch & Kibana', category: 'monitoring', proficiency: 3, years: 3 },

  // OS
  { name: 'Linux', category: 'os', proficiency: 5, years: 8 },

  // Languages
  { name: 'Python', category: 'languages', proficiency: 4, years: 7 },
  { name: 'Rust', category: 'languages', proficiency: 3, years: 2 },

  // Frameworks
  { name: 'FastAPI', category: 'frameworks', proficiency: 4, years: 4 },
  { name: 'Django', category: 'frameworks', proficiency: 3, years: 3 },
  { name: 'Celery', category: 'frameworks', proficiency: 5, years: 6 },
  { name: 'Tokio & Axum', category: 'frameworks', proficiency: 3, years: 1 },

  // Data
  { name: 'Web Scraping', category: 'data', proficiency: 5, years: 7 },
  { name: 'Distributed Computing', category: 'data', proficiency: 4, years: 5 },

  // Networking
  { name: 'Nginx', category: 'networking', proficiency: 4, years: 7 },

  // Databases
  { name: 'Database optimization', category: 'database', proficiency: 4, years: 4 },
  { name: 'PostgreSQL', category: 'database', proficiency: 4, years: 5 },
  { name: 'MySQL', category: 'database', proficiency: 4, years: 6 },
  { name: 'MongoDB', category: 'database', proficiency: 3, years: 4 },
  { name: 'Redis', category: 'database', proficiency: 4, years: 5 },
  { name: 'Meilisearch', category: 'database', proficiency: 4, years: 2 },
];