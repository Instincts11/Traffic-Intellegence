output "alb_url" {
  description = "Public HTTP URL of the application load balancer"
  value       = "http://${aws_lb.app.dns_name}"
}

output "ecr_api_url" {
  value = aws_ecr_repository.api.repository_url
}

output "ecr_web_url" {
  value = aws_ecr_repository.web.repository_url
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}
