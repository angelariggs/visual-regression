BACKSTOP_BASE := ./tests/backstop
# ------------------------------------------------------------------------------

# NOTES:
# This Makefile assumes you've gone through the README steps in tests/backstop
# This Makefile is also only for running references and tests against the same environment
# Use the setup in tests/backstop to compare different environments, or local changes

prod-reference:
	@cd $(BACKSTOP_BASE) && backstop reference --configPath=backstop.js --pathFile=paths --env=prod

prod-test:
	@cd $(BACKSTOP_BASE) && backstop test --configPath=backstop.js --pathFile=paths --env=prod

prod-report:
	@cd $(BACKSTOP_BASE) && backstop openReport --configPath=backstop.js --env=prod

staging-reference:
	@cd $(BACKSTOP_BASE) && backstop reference --configPath=backstop.js --pathFile=paths --env=staging

staging-test:
	@cd $(BACKSTOP_BASE) && backstop test --configPath=backstop.js --pathFile=paths --env=staging

staging-report:
	@cd $(BACKSTOP_BASE) && backstop openReport --configPath=backstop.js --env=staging

dev-reference:
	@cd $(BACKSTOP_BASE) && backstop reference --configPath=backstop.js --pathFile=paths --env=dev

dev-test:
	@cd $(BACKSTOP_BASE) && backstop test --configPath=backstop.js --pathFile=paths --env=dev

dev-report:
	@cd $(BACKSTOP_BASE) && backstop openReport --configPath=backstop.js --env=dev
