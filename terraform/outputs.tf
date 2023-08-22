output "lambda_security_group" {
  description = "security group to be assigned to lambda function"
  value = aws_security_group.lambda_sg.id
}

output "lambda_subnet_1" {
  value = aws_subnet.lambda_subnet[0].id
}

output "lambda_subnet_2" {
  value = aws_subnet.lambda_subnet[1].id
}

output "lambda_db_username" {
  value = var.lambda_db_username
}

output "rds_db_name" {
  value = aws_db_instance.fastapi_db.db_name
}

output "rds_proxy_endpoint" {
  value = aws_db_proxy.db_proxy.endpoint
}

output "rds_proxy_secret_arn" {
  value = aws_secretsmanager_secret.db_proxy_secret.arn
}
