# Health Check Documentation

## Overview
The auth-service implements a health check endpoint at `/api/health` that provides information about the service's status and connectivity to its dependencies (Redis and MongoDB).

## Health Check Endpoint

### Accessing the Health Check
The health check endpoint can be accessed in several ways:

1. **Through LoadBalancer (External Access)**:
   ```bash
   curl http://<EXTERNAL-IP>:5001/api/health
   ```

2. **Through ClusterIP (Internal Access)**:
   ```bash
   curl http://<CLUSTER-IP>:5001/api/health
   ```

3. **Through Port Forwarding**:
   ```bash
   kubectl port-forward service/auth-service 5001:5001
   curl http://localhost:5001/api/health
   ```

### Response Headers
The health check endpoint includes several security and rate-limiting headers:

- **Security Headers**:
  - Content-Security-Policy
  - Cross-Origin-Opener-Policy
  - Cross-Origin-Resource-Policy
  - Strict-Transport-Security
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection

- **Rate Limiting**:
  - RateLimit-Policy: 100 requests per 900 seconds
  - RateLimit-Limit: Current limit
  - RateLimit-Remaining: Remaining requests
  - RateLimit-Reset: Time until reset

## Troubleshooting

### Common Issues and Solutions

1. **Connection Refused**
   - Symptom: `curl: (7) Failed to connect to localhost port 5001`
   - Solution: 
     - Verify the service is running: `kubectl get pods -l app=auth-service`
     - Check service logs: `kubectl logs deployment/auth-service`
     - Ensure port forwarding is active: `kubectl port-forward service/auth-service 5001:5001`

2. **Redis Connection Issues**
   - Symptom: `Redis connection error: Error: getaddrinfo ENOTFOUND redis`
   - Solution:
     - Verify Redis service is running: `kubectl get service redis`
     - Check Redis pod status: `kubectl get pods -l app=redis`
     - Ensure Redis service name is correctly configured in auth-service

3. **Empty Response**
   - Symptom: `curl: (52) Empty reply from server`
   - Solution:
     - Restart the auth-service deployment: `kubectl rollout restart deployment auth-service`
     - Check application logs for startup messages
     - Verify the application is binding to port 5001

### Diagnostic Commands

1. **Check Service Status**:
   ```bash
   kubectl get service auth-service
   kubectl get pods -l app=auth-service
   ```

2. **View Logs**:
   ```bash
   kubectl logs deployment/auth-service
   kubectl logs deployment/auth-service --since=5m
   ```

3. **Check Network Configuration**:
   ```bash
   kubectl describe service auth-service
   kubectl describe deployment auth-service
   ```

4. **Test Internal Connectivity**:
   ```bash
   kubectl run -i --tty --rm debug --image=curlimages/curl --restart=Never -- curl http://<CLUSTER-IP>:5001/api/health
   ```

## Monitoring

The health check endpoint can be used for:
- Load balancer health checks
- Kubernetes liveness and readiness probes
- External monitoring systems
- Service mesh health checks

## Security Considerations

1. The health check endpoint is protected by:
   - Rate limiting to prevent abuse
   - Security headers to prevent common web vulnerabilities
   - Internal network access restrictions

2. Access to the health check endpoint should be:
   - Restricted to internal networks when possible
   - Monitored for unusual patterns
   - Included in security scanning routines

## Maintenance

Regular maintenance tasks:
1. Monitor health check response times
2. Review rate limit settings
3. Update security headers as needed
4. Test connectivity to dependencies
5. Document any changes to the health check implementation 