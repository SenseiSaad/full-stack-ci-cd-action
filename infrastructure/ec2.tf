resource "aws_instance" "app_server" {
  ami                         = "ami-0c7217cdde317cfec"
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  key_name                    = var.key_pair_name
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.ec2_profile.name

  user_data = <<-EOF
#!/bin/bash
set -euo pipefail

apt-get update -y
apt-get install -y certbot curl docker.io docker-compose-plugin git nginx python3-certbot-nginx unzip
systemctl enable --now docker
systemctl enable --now nginx
usermod -aG docker ubuntu

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
cd /tmp
unzip -q awscliv2.zip
./aws/install

mkdir -p /home/ubuntu/app
chown -R ubuntu:ubuntu /home/ubuntu/app

cat >/etc/nginx/sites-available/${local.name_prefix} <<'NGINX'
server {
    listen 80 default_server;
    server_name saadops.site www.saadops.site _;

    client_max_body_size 20M;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.saadops.site;

    client_max_body_size 20M;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location = / {
        return 302 /admin/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/${local.name_prefix} /etc/nginx/sites-enabled/${local.name_prefix}
nginx -t
systemctl reload nginx
EOF

  tags = {
    Name = "${local.name_prefix}-instance"
  }
}
