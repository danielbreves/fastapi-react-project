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
    random = {
      source  = "hashicorp/random"
      version = "3.5.1"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

################################################################################
# VPC
################################################################################

resource "aws_vpc" "backend_vpc" {
  cidr_block = var.vpc_cidr
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = "fastapi-backend-vpc"
  }
}

resource "aws_subnet" "bastion_subnet" {
  vpc_id            = aws_vpc.backend_vpc.id
  cidr_block        = var.bastion_cidr
  availability_zone = var.bastion_az
  tags = {
    Name = "bastion-subnet-1"
  }
}

resource "aws_subnet" "db_subnet" {
  count             = length(var.db_cidr)
  vpc_id            = aws_vpc.backend_vpc.id
  cidr_block        = element(var.db_cidr, count.index)
  availability_zone = element(var.db_azs, count.index) # 1 subnet per AZ
  tags = {
    Name = "db-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "lambda_subnet" {
  count             = length(var.lambda_cidr)
  vpc_id            = aws_vpc.backend_vpc.id
  cidr_block        = element(var.lambda_cidr, count.index)
  availability_zone = element(var.lambda_azs, count.index) # 1 subnet per AZ
  tags = {
    Name = "lambda-subnet-${count.index + 1}"
  }
}

resource "aws_security_group" "bastion_sg" {
  name_prefix = "bastion-sg"
  vpc_id      = aws_vpc.backend_vpc.id

  lifecycle {
    # https://github.com/hashicorp/terraform/issues/8617
    create_before_destroy = true
  }
}

resource "aws_security_group" "db_sg" {
  name_prefix = "db-sg"
  vpc_id      = aws_vpc.backend_vpc.id

  lifecycle {
    # https://github.com/hashicorp/terraform/issues/8617
    create_before_destroy = true
  }
}

resource "aws_security_group" "lambda_sg" {
  name_prefix = "lambda-sg"
  vpc_id      = aws_vpc.backend_vpc.id

  lifecycle {
    # https://github.com/hashicorp/terraform/issues/8617
    create_before_destroy = true
  }
}

################################################################################
# Bastion Host
################################################################################

data "aws_ami" "amzn_linux_2023_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }
}

resource "aws_instance" "bastion_host" {
  ami                  = data.aws_ami.amzn_linux_2023_ami.id
  instance_type        = "t2.micro"
  subnet_id            = aws_subnet.bastion_subnet.id
  iam_instance_profile = aws_iam_instance_profile.ec2_ssm_instance_profile.id

  security_groups = [aws_security_group.bastion_sg.id]

  tags = {
    Name = "BastionHost"
  }
}

# See https://repost.aws/knowledge-center/ec2-systems-manager-vpc-endpoints
resource "aws_iam_role" "bastion_ssm_role" {
  name = "ec2-bastion-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_instance_profile" "ec2_ssm_instance_profile" {
  name_prefix = "ec2-bastion-ssm-profile"
  role        = aws_iam_role.bastion_ssm_role.name
}

resource "aws_iam_role_policy_attachment" "ec2_ssm_policy_attachment" {
  role       = aws_iam_role.bastion_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent-minimum-s3-permissions.html
resource "aws_iam_policy" "bastion_ssm_s3_policy" {
  name = "bastion-ssm-s3-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "s3:GetObject"
      Effect = "Allow"
      Resource = [
        "arn:aws:s3:::aws-ssm-${var.aws_region}/*",
        "arn:aws:s3:::aws-windows-downloads-${var.aws_region}/*",
        "arn:aws:s3:::amazon-ssm-${var.aws_region}/*",
        "arn:aws:s3:::amazon-ssm-packages-${var.aws_region}/*",
        "arn:aws:s3:::${var.aws_region}-birdwatcher-prod/*",
        "arn:aws:s3:::aws-ssm-distributor-file-${var.aws_region}/*",
        "arn:aws:s3:::aws-ssm-document-attachments-${var.aws_region}/*",
        "arn:aws:s3:::patch-baseline-snapshot-${var.aws_region}/*"
      ]
    }]
  })
}

resource "aws_iam_role_policy_attachment" "bastion_host_ssm_s3" {
  role       = aws_iam_role.bastion_ssm_role.name
  policy_arn = aws_iam_policy.bastion_ssm_s3_policy.arn
}

resource "aws_vpc_endpoint" "ssm_endpoints" {
  for_each            = toset(["ssmmessages", "ec2messages", "ssm"])
  service_name        = "com.amazonaws.${var.aws_region}.${each.key}"
  vpc_id              = aws_vpc.backend_vpc.id
  vpc_endpoint_type   = "Interface"
  subnet_ids          = [aws_subnet.bastion_subnet.id]
  security_group_ids  = [aws_security_group.vpc_endpoints_sg.id]
  private_dns_enabled = true
}

resource "aws_security_group" "vpc_endpoints_sg" {
  name_prefix = "vpc-endpoints-ssm-sg"
  vpc_id      = aws_vpc.backend_vpc.id

  lifecycle {
    # https://github.com/hashicorp/terraform/issues/8617
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "vpc_endpoints_ingress_rule" {
  security_group_id            = aws_security_group.vpc_endpoints_sg.id
  referenced_security_group_id = aws_security_group.bastion_sg.id
  from_port                    = 443
  ip_protocol                  = "tcp"
  to_port                      = 443
}

resource "aws_vpc_security_group_egress_rule" "bastion_host_egress_rule" {
  security_group_id            = aws_security_group.bastion_sg.id
  referenced_security_group_id = aws_security_group.vpc_endpoints_sg.id
  from_port                    = 443
  ip_protocol                  = "tcp"
  to_port                      = 443
}

################################################################################
# RDS
################################################################################

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "fastapi-db-subnet-group"
  subnet_ids = [aws_subnet.db_subnet[0].id, aws_subnet.db_subnet[1].id]
}

# TODO: Configure backups
resource "aws_db_instance" "fastapi_db" {
  allocated_storage           = 5
  db_name                     = "fastapidb"
  engine                      = "postgres"
  engine_version              = "15.3"
  instance_class              = "db.t3.micro"
  manage_master_user_password = true
  username                    = "postgres"
  parameter_group_name        = "default.postgres15"
  skip_final_snapshot         = true
  # final_snapshot_identifier   = "final-snapshot"

  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.id

  multi_az = true

  tags = {
    Name = "fastapi-rds-instance"
  }
}

################################################################################
# RDS Proxy
################################################################################

resource "random_password" "db_proxy_password" {
  length = 24
}

resource "aws_secretsmanager_secret" "db_proxy_secret" {
  name = "db-proxy-secret"
}

resource "aws_secretsmanager_secret_version" "db_version" {
  secret_id = aws_secretsmanager_secret.db_proxy_secret.id
  # https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy-setup.html#rds-proxy-secrets-arns
  secret_string = jsonencode({
    "username" = var.lambda_db_username
    "password" = random_password.db_proxy_password.result
  })
}

resource "aws_iam_role" "db_proxy_role" {
  name = "db-proxy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "rds.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "db_proxy_policy" {
  name = "db-proxy-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action   = "secretsmanager:GetSecretValue"
      Effect   = "Allow"
      Resource = aws_secretsmanager_secret.db_proxy_secret.arn
    }]
  })
}

resource "aws_iam_role_policy_attachment" "db_proxy_role_policy_attachment" {
  role       = aws_iam_role.db_proxy_role.name
  policy_arn = aws_iam_policy.db_proxy_policy.arn
}

resource "aws_db_proxy" "db_proxy" {
  name                = "db-proxy"
  debug_logging       = true
  idle_client_timeout = 1800
  require_tls         = true
  role_arn            = aws_iam_role.db_proxy_role.arn
  engine_family       = "POSTGRESQL"

  vpc_security_group_ids = [aws_security_group.db_sg.id]
  vpc_subnet_ids         = [aws_subnet.lambda_subnet[0].id, aws_subnet.lambda_subnet[1].id]

  auth {
    auth_scheme = "SECRETS"
    description = "using secret manager"
    iam_auth    = "DISABLED"
    secret_arn  = aws_secretsmanager_secret.db_proxy_secret.arn
  }

  depends_on = [aws_cloudwatch_log_group.db_proxy_log_group]
}

resource "aws_db_proxy_default_target_group" "db_proxy_target_group" {
  db_proxy_name = aws_db_proxy.db_proxy.name
}

resource "aws_db_proxy_target" "db_proxy_target" {
  db_instance_identifier = aws_db_instance.fastapi_db.identifier
  db_proxy_name          = aws_db_proxy.db_proxy.name
  target_group_name      = aws_db_proxy_default_target_group.db_proxy_target_group.name
}

resource "aws_cloudwatch_log_group" "db_proxy_log_group" {
  name              = "/aws/rds/proxy/fastapidb"
  retention_in_days = 30
}
