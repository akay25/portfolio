import type { Experience } from '@/types'

export const experience: Experience[] = [
  {
    company: 'ACID Technologies',
    role: 'DevOps Engineer (previously Python Bot Developer, 2019-07 — 2021-10)',
    period: '2019-07 — Present',
    description: 'Implemented AWS Landing Zone Accelerator (LZA) with AWS Control Tower and Microsoft Entra ID integration, enabling centralized SSO, team-based RBAC, permission sets and secure multi-account AWS access. Designed and deployed a production-grade K3s Kubernetes cluster from scratch, cutting infrastructure costs by moving to a self-managed setup while maintaining reliability and scalability. Built a reliable distributed data ingestion pipeline for a large-scale data lake, handling high-throughput ingestion, asynchronous processing, retries and fault recovery across distributed workers. Built CI/CD pipelines for Node.js and Python projects with Helm chart based deployments across multiple K8s clusters. Managed resource allocation for logging and monitoring tools like Fluent Bit and Grafana, and moved applications to OpenTelemetry. As a Python Bot Developer, migrated legacy bots from Ruby to Python, built long-running bots to scrape platforms like IRC, Discord, Facebook, Weibo and dark web forums, worked on an in-house generic captcha solver for Selenium and Playwright projects, and designed a distributed Celery-based web-scraping architecture for large-scale asynchronous workloads.',
    techUsed: [
      'AWS',
      'Control Tower',
      'Entra ID',
      'Kubernetes',
      'K3s',
      'Helm',
      'Jenkins',
      'ArgoCD',
      'GitHub Actions',
      'Docker',
      'Fluent Bit',
      'Grafana',
      'OpenTelemetry',
      'Python',
      'Celery',
      'Selenium',
      'Playwright',
    ],
  },
  {
    company: 'BotBakery',
    role: 'Cyber Security and Infrastructure Intern',
    period: '2018-07 — 2019-01',
    description: 'Migrated sites from one cloud provider to another and set up and managed instances on different cloud providers for clients. Fixed malware-infected PHP based sites and scheduled backups. Configured monitoring and alerts for website downtime and service availability.',
    techUsed: [
      'Linux',
      'Cloud Platforms',
      'Virtual Machines',
      'PHP',
      'Backup & Recovery',
      'Malware Removal',
      'Monitoring',
    ],
  },
]
