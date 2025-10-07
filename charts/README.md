# Bluesky Sentiment Web - Helm Chart

This Helm chart deploys the Bluesky Sentiment Web Dashboard to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster with Gateway API support
- NGINX Gateway Fabric installed
- cert-manager installed
- External DNS configured
- NATS JetStream cluster running
- kubectl configured to access your cluster
- Helm 3.x installed

## Configuration

### Environment Variables

Before deploying, you need to create a `.env.prod` file with your production configuration. A template is provided in the root of the `bsky-sentiment-web` directory.

Example `.env.prod`:
```bash
# NATS Configuration (for Kubernetes cluster)
NATS_URL=nats://nats.nats.svc.cluster.local:4222

# Stream configuration (should match the processor output)
OUTPUT_STREAM=bluesky-posts-sentiment
OUTPUT_SUBJECT=bluesky.posts.sentiment
```

### Creating Secrets

Use the provided script to create Kubernetes secrets from your `.env.prod` file:

```bash
cd charts
./create-secrets.sh --namespace default

# Or specify a custom namespace
./create-secrets.sh --namespace production

# For a dry-run to see what would be created
./create-secrets.sh --dry-run
```

## Installation

### Basic Installation

```bash
# Create the secret first
cd charts
./create-secrets.sh --namespace default

# Install the chart
helm install bsky-sentiment-web ./bsky-sentiment-web --namespace default
```

### Custom Configuration

You can override values using a custom values file or command-line flags:

```bash
# Using a custom values file
helm install bsky-sentiment-web ./bsky-sentiment-web \
  --namespace default \
  --values custom-values.yaml

# Override specific values
helm install bsky-sentiment-web ./bsky-sentiment-web \
  --namespace default \
  --set image.tag=v1.0.0 \
  --set replicaCount=3 \
  --set httproute.hostname=myapp.example.com
```

## Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Container image repository | `ghcr.io/richardr1126/bsky-sentiment-web` |
| `image.tag` | Container image tag | `latest` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Kubernetes service type | `ClusterIP` |
| `service.port` | Service port | `3000` |
| `httproute.enabled` | Enable HTTPRoute for Gateway API | `true` |
| `httproute.hostname` | Hostname for the HTTPRoute | `bsky.gke.richardr.dev` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `256Mi` |
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |

## HTTPRoute Configuration

The chart includes an HTTPRoute resource for Gateway API integration. This allows you to expose your application through the NGINX Gateway with automatic TLS certificates from cert-manager.

To configure the HTTPRoute:

```yaml
httproute:
  enabled: true
  hostname: "bsky.gke.richardr.dev"
  parentRef:
    name: nginx
    namespace: nginx-gateway
    sectionName: https
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-staging
    external-dns.alpha.kubernetes.io/hostname: bsky.gke.richardr.dev
```

## Upgrading

```bash
# Update the secret if needed
cd charts
./create-secrets.sh --namespace default

# Upgrade the chart
helm upgrade bsky-sentiment-web ./bsky-sentiment-web --namespace default
```

## Uninstalling

```bash
# Uninstall the chart
helm uninstall bsky-sentiment-web --namespace default

# Delete the secret (optional)
kubectl delete secret bsky-sentiment-web-env --namespace default
```

## Accessing the Application

After deployment, the application will be accessible at the configured hostname (default: `https://bsky.gke.richardr.dev`).

To check the status:

```bash
# Check pods
kubectl get pods -n default -l app.kubernetes.io/name=bsky-sentiment-web

# Check service
kubectl get svc -n default -l app.kubernetes.io/name=bsky-sentiment-web

# Check HTTPRoute
kubectl get httproute -n default

# View logs
kubectl logs -n default -l app.kubernetes.io/name=bsky-sentiment-web -f
```

## Troubleshooting

### Check pod status
```bash
kubectl get pods -n default -l app.kubernetes.io/name=bsky-sentiment-web
kubectl describe pod <pod-name> -n default
```

### View logs
```bash
kubectl logs -n default -l app.kubernetes.io/name=bsky-sentiment-web -f
```

### Check secret
```bash
kubectl get secret bsky-sentiment-web-env -n default -o yaml
```

### Test connectivity to NATS
```bash
# Port forward to the pod
kubectl port-forward -n default <pod-name> 3000:3000

# Access locally
curl http://localhost:3000
```

### Check HTTPRoute status
```bash
kubectl get httproute -n default
kubectl describe httproute bsky-sentiment-web -n default
```

## Development

To test changes locally before deploying:

```bash
# Validate the chart
helm lint ./bsky-sentiment-web

# Dry-run installation
helm install bsky-sentiment-web ./bsky-sentiment-web \
  --namespace default \
  --dry-run --debug

# Template the chart to see rendered manifests
helm template bsky-sentiment-web ./bsky-sentiment-web
```

## License

See the main project README for license information.
