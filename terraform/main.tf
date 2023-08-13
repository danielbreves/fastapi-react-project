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
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = var.aws_region
}

resource "aws_instance" "app_server" {
  ami           = "ami-0a709bebf4fa9246f"
  instance_type = "t2.micro"

  tags = {
    Name = "ExampleAppServerInstance"
  }
}
