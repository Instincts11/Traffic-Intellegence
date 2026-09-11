# Traffipi DevOps — zero-cost path (for interviews)

**Goal:** show Docker + Kubernetes + CI/CD + cloud deploy **without spending money**.

Do **not** run `terraform apply` unless you accept AWS bills (ALB + Fargate usually cost money).

---

## AWS free tier — honest answer

| Question | Answer |
| --- | --- |
| Is there an AWS free tier? | Yes |
| Can **everything** on AWS be $0 forever? | **No** |
| Can **this repo’s ECS + ALB Terraform** be guaranteed free? | **No** — ALB and Fargate often bill |
| Can you use *some* AWS with $0 if careful? | Sometimes (limits, 12‑month offers, always‑free quotas) — still set billing alerts |
| Safe zero-cost path for Traffipi | Docker Compose + local K8s + GitHub Actions + Render |

**Rule:** free tier ≠ “run production ECS/ALB for free.” Skip applying that Terraform for interviews.

---

## What is free

| Piece | Free? | How you use it |
| --- | --- | --- |
| **Docker + docker-compose** | Yes | Run locally on your laptop |
| **Local Kubernetes** | Yes | Docker Desktop K8s / kind + `k8s/` manifests |
| **GitHub Actions CI** | Yes (public repo) | Auto-builds on every push |
| **Render free web services** | Yes | Live demo already (API + web) |
| **GoDaddy domain DNS only** | Domain fee only | Optional nicer URL; not required |
| **Terraform AWS code** | Free to keep in repo | **Do not apply** for zero-cost demo |
| **AWS ECS/ALB live** | **Usually not free** | Skip for interview |

---

## Interview story (honest + strong)

> “I containerized Traffipi with Docker and docker-compose, deployed the same images to local Kubernetes with Kustomize, added GitHub Actions CI to build the Next.js app, Flask API, and images on every push, and hosted the live demo on Render’s free tier. I also wrote Terraform for AWS ECS/ECR as infrastructure-as-code, but I didn’t apply it to keep the demo zero-cost.”

---

## Commands to practice before the interview

### 1) Local containers (Docker)

```bash
# from repo root
docker compose up --build
```

Open http://localhost:3000  
Stop with `Ctrl+C`, then `docker compose down`.

### 2) Local Kubernetes (free)

See [`k8s/README.md`](../k8s/README.md). Short version:

```bash
docker compose build
kubectl apply -k k8s
kubectl port-forward -n traffipi svc/web 3000:3000
```

Cleanup: `kubectl delete -k k8s`

### 3) CI (CI/CD)

Push to GitHub → open **Actions** → show green **CI** workflow  
(builds web, checks API, builds Docker images — no deploy cost).

### 4) Live demo (cloud hosting)

Wake services, then open your Render frontend URL (or traffipi.in if DNS is ready).

Demo: Predict → Map → Influence.  
Say Detect is off on free hosting due to memory.

---

## What NOT to do for zero cost

- `terraform apply` for ECS/ALB
- Creating AWS load balancers / Fargate / EKS without watching billing
- Paid Render / paid Vercel plans
- Leaving AWS resources running

Terraform files can stay in the repo as **IaC samples**.

---

## Resume one-liner (DevOps, zero-cost)

- Containerized API/UI with Docker Compose; deployed locally on Kubernetes (Deployments/Services/Kustomize); CI via GitHub Actions; live demo on Render free tier; Terraform for AWS ECS authored but not applied (cost-aware).
