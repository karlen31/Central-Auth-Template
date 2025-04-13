# Documentation Rule

## Always Document Changes

When making changes to the codebase, ensure proper documentation is maintained:

### Changelog Updates
1. Add a new entry to `docs/changelog.md` for:
   - New features
   - Bug fixes
   - Configuration changes
   - Dependency updates
   - Breaking changes

2. Follow the format:
   ```markdown
   ## [Version] - YYYY-MM-DD

   ### Added
   - New features

   ### Changed
   - Modified functionality

   ### Fixed
   - Bug fixes

   ### Technical Details
   - File changes
   - Configuration updates
   - Environment variables
   ```

### README Updates
1. Update `README.md` when changes affect:
   - Setup instructions
   - Dependencies
   - Environment variables
   - Deployment process
   - Access URLs
   - Features list

### API Documentation
1. Update `docs/api.md` when modifying:
   - API endpoints
   - Request/response formats
   - Authentication methods
   - Rate limits

### Deployment Guide
1. Update `docs/deployment.md` when changing:
   - Deployment process
   - Kubernetes configurations
   - Environment setup
   - Infrastructure requirements

### Code Comments
1. Add JSDoc comments for:
   - New functions
   - Modified function signatures
   - Complex logic
   - Configuration objects

### Commit Messages
1. Use conventional commit format:
   ```
   type(scope): description

   - feat: new feature
   - fix: bug fix
   - docs: documentation
   - chore: maintenance
   - refactor: code restructuring
   - test: testing
   ```

### Directory Structure
1. Update `.cursor/rules/directory-structure.md` when:
   - Adding new directories
   - Moving files
   - Restructuring the project 