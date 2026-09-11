# Traffipi DevOps — zero-cost path (for interviews)

**Goal:** show Docker + CI/CD + cloud deploy **without spending money**.

Do **not** run `terraform apply` unless you accept AWS bills (ALB + Fargate cost money).

---

## What is free

| Piece | Free? | How you use it |
| --- | --- | --- |
| **Docker + docker-compose** | Yes | Run locally on your laptop |
| **GitHub Actions CI** | Yes (public repo) | Auto-builds on every push |
| **Render free web services** | Yes | Live demo already (API + web) |
| **GoDaddy domain DNS only** | Domain fee only | Optional nicer URL; not required |
| **Terraform AWS code** | Free to keep in repo | **Do not apply** for zero-cost demo |
| **AWS ECS/ALB** | **Not free** | Skip for interview |

---

## Interview story (honest + strong)

> “I containerized Traffipi with Docker and docker-compose, added GitHub Actions CI to build the Next.js app, Flask API, and images on every push, and deployed the live demo on Render’s free tier. I also wrote Terraform for AWS ECS/ECR as infrastructure-as-code, but I didn’t apply it to keep the demo zero-cost.”

That shows DevOps skill without claiming a paid AWS production.

---

## Commands to practice before the interview

### 1) Local containers (shows Docker)

```bash
# from repo root
docker compose up --build
```

Open http://localhost:3000  
Stop with `Ctrl+C`, then `docker compose down`.

### 2) CI (shows CI/CD)

Push to GitHub → open **Actions** → show green **CI** workflow  
(builds web, checks API, builds Docker images — no deploy cost).

### 3) Live demo (shows cloud hosting)

Wake services, then open your Render frontend URL (or traffipi.in if DNS is ready).

Demo: Predict → Map → Influence.  
Say Detect is off on free hosting due to memory.

---

## What NOT to do for zero cost

- `terraform apply`
- Creating AWS load balancers / Fargate services
- Paid Render / paid Vercel plans
- Leaving AWS resources running

Terraform files can stay in the repo as **IaC samples**.

---

## Resume one-liner (DevOps, zero-cost)

- Containerized API/UI with Docker Compose; automated builds via GitHub Actions; deployed live demo on Render free tier; authored Terraform for AWS ECS (not applied, cost-aware).
