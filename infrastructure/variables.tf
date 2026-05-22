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

variable "public_subnet_cidr" {
  description = "CIDR for the public subnet that hosts EC2"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidrs" {
  description = "CIDRs for private RDS subnets across two AZs"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "instance_type" {
  description = "EC2 instance type for app"
  type        = string
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "Name of an existing EC2 key pair in the selected AWS region"
  type        = string
  default     = "portfolio-key"
}

variable "allowed_ssh_ip" {
  description = "Your public IP address without /32, used for SSH and temporary port 8000 access"
  type        = string
  default     = ""
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
