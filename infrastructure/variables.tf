variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
  default     = "portfolio"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "common_tags" {
  description = "Additional tags to add to every supported AWS resource"
  type        = map(string)
  default     = {}
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "instance_type" {
  description = "EC2 instance type for app"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of existing SSH key pair"
  type        = string
  default     = "portfolio-key"
}

variable "allowed_ssh_cidr" {
  description = "CIDR range allowed to SSH (e.g. your IP). Leave null to disable SSH access."
  type        = string
  default     = null
}

variable "app_domain_name" {
  description = "Optional domain name for Route53 and URL outputs, e.g. example.com"
  type        = string
  default     = null
}

variable "route53_zone_id" {
  description = "Optional Route53 hosted zone ID used to create an A record for app_domain_name"
  type        = string
  default     = null
}

variable "backend_image" {
  description = "Optional backend container image to run from EC2 user data"
  type        = string
  default     = null
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password (sensitive)"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage (GB)"
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "portfolio"
}

variable "db_engine_version" {
  description = "PostgreSQL engine major version"
  type        = string
  default     = "16"
}

variable "db_backup_retention_period" {
  description = "Number of days to keep RDS automated backups"
  type        = number
  default     = 7
}

variable "db_deletion_protection" {
  description = "Protect the RDS instance from accidental deletion"
  type        = bool
  default     = false
}
