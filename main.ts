import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { AwsProvider, CloudfrontDistribution, AcmCertificate, DataAwsRoute53Zone, Route53Record, AcmCertificateValidation } from './.gen/providers/aws';

class CdkWeeklyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'Frankfurt', {
      region: 'eu-central-1'
    })

    new AwsProvider(this, 'aws.route53', {
      region: 'us-east-1',
      alias: 'route53'
     })

    const originId = 'myS3Origin'

    const cert = new AcmCertificate(this, 'cert', {
      domainName: "www.cdkweekly.com",
      validationMethod: "DNS"
    })

    cert.addOverride('provider', 'aws.route53')

    const zone = new DataAwsRoute53Zone(this, 'zone', {
      name: 'cdkweekly.com.',
      privateZone: false
    })

    const record = new Route53Record(this, 'foo', {
      name: cert.domainValidationOptions('0').resourceRecordName,
      type: cert.domainValidationOptions('0').resourceRecordType,
      records: [
        cert.domainValidationOptions('0').resourceRecordValue
      ],
      zoneId: zone.zoneId!,
      ttl: 60,
      allowOverwrite:  true
    })

    const certvalidation = new AcmCertificateValidation(this, 'certvalidation', {
      certificateArn: cert.arn,
      validationRecordFqdns: [record.fqdn]
    })

    certvalidation.addOverride('provider', 'aws.route53')

    const distribution = new CloudfrontDistribution(this, 'cloudfront', {
      enabled: true,
      isIpv6Enabled: true,

      viewerCertificate: [{
        acmCertificateArn: cert.arn,
        sslSupportMethod: 'sni-only'
      }],

      restrictions: [{
        geoRestriction: [{
          restrictionType: 'none'
        }]
      }],

      origin: [{
        originId,
        domainName: "www.getrevue.co",
        customOriginConfig: [{
          httpPort: 80,
          httpsPort: 443,
          originProtocolPolicy: 'http-only',
          originSslProtocols: ['TLSv1.2', 'TLSv1.1']
        }]
      }],

      aliases: [
        "www.cdkweekly.com"
      ],

      defaultCacheBehavior: [{
        minTtl: 0,
        defaultTtl: 60,
        maxTtl: 86400,
        allowedMethods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
        cachedMethods: ["GET", "HEAD"],
        targetOriginId: originId,
        viewerProtocolPolicy: 'redirect-to-https',
        forwardedValues: [{
          cookies: [{
            forward: 'all'
          }],
          headers: ['Host', 'Accept-Datetime', 'Accept-Encoding', 'Accept-Language', 'User-Agent', 'Referer', 'Origin', 'X-Forwarded-Host'],
          queryString: true
        }]
      }]
    })

    new Route53Record(this, 'distribution_domain', {
      name: 'www.cdkweekly.com',
      type: 'A',
      zoneId: zone.zoneId!,
      alias: [{
        name: distribution.domainName,
        zoneId: distribution.hostedZoneId,
        evaluateTargetHealth: true
      }]
    })
  }
}

const app = new App();
new CdkWeeklyStack(app, 'cdkweekly');
app.synth();
