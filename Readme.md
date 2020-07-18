# Terraform CDK SSL Proxy for cdkweekly.com

The [CDK Weekly](https://www.cdkweekly.com/) newsletter is served by [revue.co](https://www.getrevue.co/), which doesn't support SSL for custom domains.

This little workaround was initially built on top of [Terrastack](https://github.com/terrastackio/terrastack) and got migrated to its successor [Terraform CDK](https://github.com/hashicorp/terraform-cdk/). It's the first real world example for the Terraform CDK and is running in production for a while now.

## Setup

```
npm install
cdktf get
```

## Deploy

```
cdktf deploy
```