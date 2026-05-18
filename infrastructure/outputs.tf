output "ec2_public_ip" {
  description = "Public IP of the app EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "backend_url" {
  description = "Backend API URL through the EC2-hosted Nginx reverse proxy"
  value       = "http://${local.app_host}/api"
}

output "app_url" {
  description = "Application URL served by the EC2-hosted Django container"
  value       = "http://${local.app_host}"
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "vpc_id" {
  description = "VPC id"
  value       = aws_vpc.main.id
}

output "ecr_backend_url" {
  description = "Backend ECR repository URL"
  value       = aws_ecr_repository.backend.repository_url
}

output "route53_record" {
  description = "Optional Route53 A record created for the app domain"
  value       = try(aws_route53_record.app[0].fqdn, null)
}
