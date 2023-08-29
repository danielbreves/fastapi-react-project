variable "aws_region" {
  type        = string
  default     = "ap-southeast-2"
  description = "AWS region for all resources"
}

variable "vpc_cidr" {
  description = "CIDR block for the vpc"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_cidr" {
  type    = string
  default = "10.0.31.0/24"
}

variable "bastion_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "db_cidr" {
  type    = list(string)
  default = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "lambda_cidr" {
  type    = list(string)
  default = ["10.0.21.0/24", "10.0.22.0/24"]
}

variable "bastion_az" {
  type    = string
  default = "ap-southeast-2a"
}

variable "db_azs" {
  type    = list(string)
  default = ["ap-southeast-2a", "ap-southeast-2b"]
}

variable "lambda_azs" {
  type    = list(string)
  default = ["ap-southeast-2a", "ap-southeast-2b"]
}

variable "lambda_db_username" {
  type        = string
  default     = "app_db_username"
  description = "DB username for the app" # Needs to be created manually: https://github.com/aws-samples/serverless-patterns/blob/main/apigw-http-api-lambda-rds-proxy-terraform/vpc-rds-setup/main.tf#L236-L239
}
