# Local Models Support

This application supports using local models via Ollama for offline AI coding assistance.

## Setup Instructions

### 1. Install Ollama

Download and install Ollama from [ollama.com](https://ollama.com)

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download the installer from [ollama.com](https://ollama.com)

### 2. Start Ollama Server

```bash
ollama serve
```

The server will run on `http://localhost:11434` by default.

### 3. Pull a Model

For coding tasks, we recommend these models:

```bash
# Recommended for coding
ollama pull codellama:7b

# Alternative options
ollama pull llama3:8b
ollama pull deepseek-coder:6.7b
ollama pull mistral:7b
```

### 4. Configure in Application

1. Open Settings → Beta Features
2. Enable "Offline Mode Features"
3. Select your preferred model from the dropdown
4. Enable "Auto Offline Mode" to automatically use local models when internet is unavailable

## Usage

### Using Local Models in Codex

When starting a new chat with Codex, you can select a local model by prefixing the model name with `local:`:

- `local:codellama:7b` - Use Codellama 7B locally
- `local:llama3:8b` - Use Llama 3 8B locally
- `local:mistral:7b` - Use Mistral 7B locally

The application will automatically:
- Check if Ollama is running
- Verify the model is installed
- Fall back to cloud models if local model fails

### Automatic Fallback

If a local model fails or is unavailable, the application will automatically fall back to cloud models. This ensures you always have access to AI assistance.

## Troubleshooting

### Ollama Not Running

**Error:** "Ollama is not running"

**Solution:** Start the Ollama server:
```bash
ollama serve
```

### Model Not Found

**Error:** "Model 'xxx' not found"

**Solution:** Pull the model:
```bash
ollama pull <model-name>
```

### Connection Refused

**Error:** "ECONNREFUSED"

**Solution:** 
1. Check if Ollama is running: `ps aux | grep ollama`
2. Restart Ollama: `ollama serve`
3. Check if port 11434 is available: `lsof -i :11434`

### Performance Tips

- Use smaller models (7B) for faster responses
- Ensure you have sufficient RAM (16GB+ recommended for 7B models)
- Close other memory-intensive applications
- Use GPU acceleration if available (Ollama supports Apple Silicon and NVIDIA GPUs)

## Supported Local Model Providers

Currently, the application supports:
- **Ollama** - Full support with streaming and error handling

Planned support:
- **LM Studio** - Coming soon
- **LocalAI** - Coming soon
