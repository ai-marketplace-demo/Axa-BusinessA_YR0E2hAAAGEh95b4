help:
	@echo "install - install a virtualenv for development"
	@echo "lint - check source code with flake8"
	@echo "test - run unit tests"
	@echo "coverage - check code coverage"
	@echo "tox - test multiple versions of python"
	@echo "build env={env} - package new code and update the function in the cloud"
	@echo "describe env={env} - describe cloud stack"
	@echo "check env={env} - check the state of one function"
	@echo "clean - remove build, test, coverage and Python artifacts locally"
	@echo "tear-down env={env} - completely destroy stack in the cloud -- be cautious"

# by default, target this environment
env ?= staging

PROFILE ?= default
# by default, use following profile for AWS authentication
AWS_DEV_PROFILE ?= development

AWS_PROD_PROFILE ?= production

# by default, we settle down in this region
AWS_REGION ?= eu-west-1

# by default, use following bucket for artifacts upload
S3_BUCKET ?= datahub.platform.code

# by default, use following prefix for CloudFormation stack name
CFN_STACK ?= datahubui

# by default, use following prefix for names entered in Parameter Store -- do not put ending /
SSM_PREFIX ?= /datahub

#AWS DEV ACCOUNT
DEVELOPMENT_ACCOUNT_ID ?= 721806266359

#AWS PROD ACCOUNT
PRODUCTION_ACCOUNT_ID ?= 846154773561

#AWS PRODUCTION ROLE TO BE ASSUMED TO DEPLOY CODEPIPELINE PIPELINE
CODEPIPELINE_PRODUCTION_ROLE ?= moshirm@amazon.fr

#AWS CODECOMMIT REPOSITORY NAME
REPOSITORY_NAME = datahubui

# reflect attributes of this software package
PACKAGE_NAME = datahubui
PACKAGE_VERSION = 0.1

# reflect attributes of most recent commit to git repository
COMMIT_HASH = $(shell git log -1 --pretty=format:"%H")
COMMIT_PERSON = $(shell git log -1 --pretty=format:"%an")
COMMIT_SUBJECT = $(shell git log -1 --pretty=format:"%s" | tr -cs "[:alnum:]._:/@=+-" " ")

validate-pipeline:
	aws cloudformation validate-template --template-body file://templates/datahubui-pipeline.yaml

deploy-pipeline:
	aws --profile=${AWS_DEV_PROFILE} cloudformation deploy \
		     --template-file templates/datahubui-pipeline.yaml \
		     --region ${AWS_REGION} \
		     --stack-name "${CFN_STACK}-pipeline" \
		     --parameter-overrides PackageName="${PACKAGE_NAME}" \
		                           PackageVersion="${PACKAGE_VERSION}" \
		                           ArtifactBucket="${S3_BUCKET}" \
		                           CodeCommitRepository="${REPOSITORY_NAME}" \
		                           CommitHash="${COMMIT_HASH}" \
		                           CommitPerson="${COMMIT_PERSON}" \
		                           CommitSubject="${COMMIT_SUBJECT}" \
		                           SsmPrefix="${SSM_PREFIX}" \
		                           CodePipelineProductionRole="${CODEPIPELINE_PRODUCTION_ROLE}" \
		                           ProductionAccountID="${PRODUCTION_ACCOUNT_ID}" \
		     --capabilities CAPABILITY_NAMED_IAM \
		     --no-fail-on-empty-changeset

assume-role:
	aws sts assume-role --role-arn "arn:aws:iam::${PRODUCTION_ACCOUNT_ID}:role/${CODEPIPELINE_PRODUCTION_ROLE}" --role-session-name "session1" >.assume_role_json
	echo "export AWS_ACCESS_KEY_ID=$$(cat .assume_role_json | jq '.Credentials.AccessKeyId' -r)" >.env.assumed_role
	echo "export AWS_SECRET_ACCESS_KEY=$$(cat .assume_role_json | jq '.Credentials.SecretAccessKey' -r)" >>.env.assumed_role
	echo "export AWS_SESSION_TOKEN=$$(cat .assume_role_json | jq '.Credentials.SessionToken' -r)" >>.env.assumed_role
	rm .assume_role_json
