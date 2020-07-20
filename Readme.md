# Terraform CDK SSL Proxy for cdkweekly.com

The [CDK Weekly](https://www.cdkweekly.com/) newsletter is served by [revue.co](https://www.getrevue.co/), which doesn't support SSL for custom domains.

This little workaround was initially built on top of [Terrastack](https://github.com/terrastackio/terrastack) and got migrated to its successor [Terraform CDK](https://github.com/hashicorp/terraform-cdk/). It's the first real world example for the Terraform CDK and in production for a while now.

That's where one of the [Terraform CDK examples](https://github.com/hashicorp/terraform-cdk/tree/master/examples/typescript-aws-cloudfront-proxy) is stemming from.

Next Up:

- [ ] Redirect naked domain -> www (probably including SSL via Cloudfront distrubtion)
- [ ] Inject Google Analytics or something similar
