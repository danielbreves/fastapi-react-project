output "ecr_repository_url" {
  value = aws_ecr_repository.ecr_repository.repository_url
}

output "db_endpoint" {
  value = aws_db_instance.fastapi-db.endpoint
}

output "db_master_user_secret" {
  value = aws_db_instance.fastapi-db.master_user_secret
}