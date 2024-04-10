# Node.js Project (Backend)


## Installation

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Create the necessary components:

AWS `S3 bucket,SNS topic, Cloudfront` and 
Google auth

4. Set the environment variables:
#### AWS config


``` AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
S3_BUCKET_NAME="cmpe295-professorai"
SNS_TOPIC_ARN=arn:aws:sns:us-west-1:578421149959:professorai
CLOUDFRONT_DOMAIN_NAME=
CLOUDFRONT_PRIVATE_KEY_PATH=
CLOUDFRONT_PUBLIC_KEY_ID=
```
#### Admin auth config

```
adminEmail=""
adminPassword=""
jwtSecretKey=""
 ```
#### Google auth config for users(students and professors)

```
clientID = ""
clientSecret = ""
secret = ""
 ```
## Usage

- Run the project with `npm start`.
- Access the API at `http://localhost:5000/`.
