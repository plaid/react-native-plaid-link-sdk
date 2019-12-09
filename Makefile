NPM_ENV_VARS = npm_config_registry=https://registry.npmjs.org
XYZ = $(NPM_ENV_VARS) node_modules/.bin/xyz --repo git@github.com:plaid/react-native-plaid-link-sdk.git


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)