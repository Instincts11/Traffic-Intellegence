# Traffipi on local Kubernetes (free)

Run the same Docker images on **local Kubernetes** — no AWS cost.

Works with **Docker Desktop Kubernetes** or **kind**.

## Prerequisites

1. Docker Desktop running  
2. Enable **Kubernetes** in Docker Desktop → Settings → Kubernetes → Enable  
   (or install [kind](https://kind.sigs.k8s.io/))  
3. `kubectl` available (`kubectl version --client`)

## Steps

```powershell
# 1) From repo root — build images (same as compose)
cd "c:\Users\AMAL V R\Downloads\traffic"
docker compose build

# 2) Apply manifests
kubectl apply -k k8s

# 3) Wait for pods
kubectl get pods -n traffipi -w

# 4) Open the app (pick one)
kubectl port-forward -n traffipi svc/web 3000:3000
# then open http://localhost:3000
```

On Docker Desktop Kubernetes, NodePort **30080** may also work: http://localhost:30080

## Cleanup

```powershell
kubectl delete -k k8s
```

## Interview line

> “I deployed Traffipi to local Kubernetes with Deployments, Services, probes, and Kustomize, using the same images built for Docker Compose.”

Do **not** claim EKS/AKS/GKE unless you actually ran a cloud cluster.
