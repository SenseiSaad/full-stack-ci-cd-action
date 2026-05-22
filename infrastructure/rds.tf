resource "aws_db_subnet_group" "default" {
  name       = "${local.name_prefix}-db-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${local.name_prefix}-db-subnets"
  }
}

resource "aws_db_instance" "postgres" {
  identifier              = "${local.name_prefix}-postgres"
  allocated_storage       = var.db_allocated_storage
  backup_retention_period = var.db_backup_retention_period
  db_name                 = var.db_name
  db_subnet_group_name    = aws_db_subnet_group.default.name
  deletion_protection     = var.db_deletion_protection
  engine                  = "postgres"
  engine_version          = var.db_engine_version
  instance_class          = var.db_instance_class
  password                = var.db_password
  publicly_accessible     = false
  skip_final_snapshot     = true
  storage_encrypted       = true
  username                = var.db_username
  vpc_security_group_ids  = [aws_security_group.rds_sg.id]

  tags = {
    Name = "${local.name_prefix}-postgres"
  }
}
