# EC2 Recovery: IP 404 or Domain Redirect Loop

Use this when the EC2 public IP shows `404 Not Found nginx/1.18.0 (Ubuntu)` or the domain gets stuck in a loading/redirect loop.

## 1. Check containers

```bash
docker ps
curl -I http://127.0.0.1:3000/
curl -I http://127.0.0.1:8000/health/
```

The frontend should answer on `127.0.0.1:3000`. The backend health check should answer on `127.0.0.1:8000/health/`.

## 2. Replace host Nginx with the HTTP config

```bash
sudo tee /etc/nginx/sites-available/portfolio >/dev/null <<'NGINX'
server {
    listen 80 default_server;
    server_name slancer.site www.slancer.site _;

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
    server_name api.slancer.site;

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

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t
sudo systemctl reload nginx
```

After this, the EC2 IP and `http://slancer.site` should proxy to the frontend container.

## 3. Issue certificates after DNS is correct

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d slancer.site -d www.slancer.site
sudo certbot --nginx -d api.slancer.site
sudo nginx -t
sudo systemctl reload nginx
```

If the domain is registered at Namecheap but DNS is managed in Route 53, make sure Namecheap is using the Route 53 hosted zone nameservers. Then create `A` records in Route 53 for `slancer.site`, `www.slancer.site`, and `api.slancer.site` pointing to the EC2 public IP.
