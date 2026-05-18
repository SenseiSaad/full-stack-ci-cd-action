resource "aws_instance" "app_server" {
  ami                         = "ami-0c7217cdde317cfec"
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  key_name                    = var.key_name
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
#!/bin/bash
set -euo pipefail

apt-get update -y
apt-get install -y curl docker.io docker-compose-plugin unzip
systemctl enable --now docker
usermod -aG docker ubuntu

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
cd /tmp
unzip -q awscliv2.zip
./aws/install

mkdir -p /home/ubuntu/app
chown -R ubuntu:ubuntu /home/ubuntu/app
EOF

  tags = {
    Name = "${local.name_prefix}-instance"
  }
}
