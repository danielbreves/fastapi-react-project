terraform {
  cloud {
    organization = "djbreves"

    workspaces {
      name = "fastapi-react-workspace"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.12"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

resource "aws_ecr_repository" "ecr_repository" {
  name = "fastapi-lambda-ecr-repo"
  force_delete = true
}

resource "aws_ecr_lifecycle_policy" "ecr_repository_policy" {
  repository = aws_ecr_repository.ecr_repository.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description   = "Keep only the last 5 images",
        selection = {
          tagStatus = "untagged",
          countType = "imageCountMoreThan",
          countNumber = 5,
        },
        action = {
          type = "expire"
        }
      }
    ]
  })
}

resource "aws_db_instance" "fastapi-db" {
  allocated_storage           = 5
  db_name                     = "fastapi-db"
  engine                      = "postgres"
  engine_version              = "15.3"
  instance_class              = "db.t3.micro"
  manage_master_user_password = true
  username                    = "postgres"
  parameter_group_name        = "default.postgres15"
}
