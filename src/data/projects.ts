import type { Project } from '@/types'

export const projects: Project[] = [
  {
    name: 'k8s-cluster-setup',
    status: 'Running',
    techStack: ['Kubernetes', 'Terraform', 'AWS EKS', 'Helm'],
    description: 'Production-grade Kubernetes cluster provisioning with Terraform on AWS EKS. Includes monitoring stack, ingress controller, cert-manager, and GitOps with ArgoCD.',
    links: { github: 'https://github.com/ajay/k8s-cluster-setup' },
    startDate: '2024-01',
    namespace: 'devops',
  },
  {
    name: 'ci-cd-pipelines',
    status: 'Running',
    techStack: ['GitHub Actions', 'Docker', 'Terraform', 'AWS'],
    description: 'Reusable CI/CD pipeline templates for building, testing, and deploying containerized applications. Supports multi-environment promotion with approval gates.',
    links: { github: 'https://github.com/ajay/ci-cd-pipelines' },
    startDate: '2023-06',
    namespace: 'devops',
  },
  {
    name: 'infra-monitoring',
    status: 'Running',
    techStack: ['Prometheus', 'Grafana', 'Alertmanager', 'Loki'],
    description: 'Full observability stack with Prometheus metrics, Grafana dashboards, Loki log aggregation, and Alertmanager for incident notifications.',
    links: { github: 'https://github.com/ajay/infra-monitoring' },
    startDate: '2023-09',
    namespace: 'devops',
  },
  {
    name: 'terraform-modules',
    status: 'Completed',
    techStack: ['Terraform', 'AWS', 'GCP'],
    description: 'Library of reusable Terraform modules for common cloud infrastructure patterns: VPCs, RDS, S3, IAM roles, and CloudFront distributions.',
    links: { github: 'https://github.com/ajay/terraform-modules' },
    startDate: '2022-11',
    namespace: 'devops',
  },
  {
    name: 'devops-portfolio',
    status: 'In Progress',
    techStack: ['Vue 3', 'TypeScript', 'Vite'],
    description: 'This terminal-themed portfolio website. A fully interactive CLI experience built with Vue 3 and TypeScript.',
    links: { github: 'https://github.com/ajay/devops-portfolio', live: 'https://ajay.dev' },
    startDate: '2026-04',
    namespace: 'frontend',
  },
]
