variable "aws_region" {
  type        = string
  default     = "ap-southeast-2"
  description = "AWS region for all resources"
}

variable "vpc_cidr" {
  description = "CIDR block for the vpc"
  type    = string
  default = "10.0.0.0/16"
}

variable "db_cidr" {
	type = list
	default = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "lambda_cidr" {
	type = list
	default = ["10.0.21.0/24", "10.0.22.0/24"]
}

variable "db_azs" {
	type = list
	default = ["ap-southeast-2a", "ap-southeast-2b"]
}

variable "lambda_azs" {
	type = list
	default = ["ap-southeast-2a", "ap-southeast-2b"]
}

variable "lambda_db_username" {
  type        = string
  default     = "app_db_username"
  description = "DB username for the app" # Needs to be created manually: https://github.com/aws-samples/serverless-patterns/blob/main/apigw-http-api-lambda-rds-proxy-terraform/vpc-rds-setup/main.tf#L236-L239
}
