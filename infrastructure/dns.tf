resource "aws_route53_record" "app" {
  count   = var.route53_zone_id == null ? 0 : var.app_domain_name == null ? 0 : trimspace(var.app_domain_name) == "" ? 0 : 1
  zone_id = var.route53_zone_id
  name    = var.app_domain_name
  type    = "A"
  ttl     = 300
  records = [aws_instance.app_server.public_ip]
}