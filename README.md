# PersonaPlex for Pinokio

PersonaPlex is NVIDIA's state-of-the-art real-time speech-to-speech conversational AI model. This Pinokio package enables easy installation and use of PersonaPlex with natural full-duplex conversations and customizable personas and voices.

## System Requirements

⚠️ **Important**: PersonaPlex requires powerful hardware!

- **GPU**: NVIDIA GPU with CUDA support
  - Minimum: RTX generation with 16 GB VRAM
  - Recommended: 24 GB VRAM or more
- **RAM**: At least 32 GB
- **Storage**: Approx. 50 GB free SSD space
- **Operating System**: Windows 10/11 64-bit
- **Driver**: Current NVIDIA graphics driver
- **CUDA**: CUDA Toolkit 12.x (installed automatically)

## Before Installation

### 1. Update NVIDIA Driver

Download and install the latest NVIDIA driver for your GPU:
[https://www.nvidia.com/en-us/drivers/](https://www.nvidia.com/en-us/drivers/)

Restart your system after installation.

### 2. Set Up Hugging Face Account

PersonaPlex requires access to the model via Hugging Face:

1. **Create Account**: Register at [huggingface.co](https://huggingface.co)
2. **Accept License**: Visit [nvidia/personaplex-7b-v1](https://huggingface.co/nvidia/personaplex-7b-v1) and accept the NVIDIA Open Model License
3. **Create Access Token**:
   - Go to Settings → Access Tokens
   - Create a new token with "Read" permission
   - Copy the token

### 3. Set Hugging Face Token

Open PowerShell and set the environment variable:

```powershell
setx HF_TOKEN your_token_here
```

⚠️ **Important**: After setting the token, close and reopen PowerShell so the variable becomes available.

## Installation via Pinokio

1. **Open Pinokio**
2. **Find PersonaPlex**: Search for "PersonaPlex" in the Pinokio Store
3. **Click Install**: The installation process runs automatically:
   - PersonaPlex repository is cloned
   - Python virtual environment is created
   - PyTorch with CUDA 12.x support is installed
   - All dependencies are installed
   - Audio libraries (sounddevice, pyaudio) are added

Installation takes 10-20 minutes depending on your internet connection.

## Usage

### Starting the Server

1. **Click Start** in Pinokio
2. **First Start**: The model (14-17 GB) will automatically download from Hugging Face
   - This can take 10-30 minutes
   - Download only happens once
3. **Open Web UI**: Click "Open Web UI" when the server is ready

### In the Browser

1. **Open URL**: Browser opens automatically (usually `http://localhost:xxxx`)
2. **Allow Microphone Access**: The browser will ask for microphone permission
3. **Start Conversation**: Speak in English with the model
4. **Define Personas**: Use text prompts to define roles and characters

## Features

- 🗣️ **Real-time Speech-to-Speech**: Natural, flowing conversations
- 🎭 **Customizable Personas**: Define characters and roles
- 🔊 **Various Voices**: Choose from different voice options
- 💬 **Full-Duplex Conversation**: Interruptions and natural conversation flow
- ⚡ **Fast Response Times**: Optimized for real-time interaction

## Troubleshooting

### "CUDA not available"

**Problem**: GPU is not detected

**Solution**:
- Update NVIDIA driver
- Install CUDA Toolkit 12.x manually
- Restart system

### Out-of-Memory Error

**Problem**: GPU has insufficient VRAM

**Solution**:
- Close other GPU-intensive programs (browser with many tabs, games, etc.)
- Check GPU usage (Task Manager → Performance → GPU)
- If VRAM is consistently over 90%, the GPU is too weak

### Model Not Downloading

**Problem**: HF_TOKEN not set or license not accepted

**Solution**:
- Check if HF_TOKEN is set: `echo %HF_TOKEN%` in CMD
- Ensure license is accepted at [huggingface.co/nvidia/personaplex-7b-v1](https://huggingface.co/nvidia/personaplex-7b-v1)
- Reset token and restart terminal

### Microphone Not Working

**Problem**: Browser has no microphone access

**Solution**:
- Browser Settings → Privacy → Microphone
- Allow access for localhost URL
- Reload browser

### Server Won't Start

**Problem**: Port already in use or Python error

**Solution**:
- Check terminal output in Pinokio
- Close other Python processes
- Run "Reset" in Pinokio and reinstall

## Performance Tips

- **GPU Driver**: Always keep up to date
- **Background Programs**: Close for best performance
- **Storage Space**: Keep at least 50 GB free
- **VRAM Monitoring**: If consistently 90%+ usage, reduce quality

## Links

- **GitHub**: [https://github.com/NVIDIA/personaplex](https://github.com/NVIDIA/personaplex)
- **Hugging Face Model**: [https://huggingface.co/nvidia/personaplex-7b-v1](https://huggingface.co/nvidia/personaplex-7b-v1)
- **NVIDIA Research**: [https://research.nvidia.com/labs/adlr/personaplex/](https://research.nvidia.com/labs/adlr/personaplex/)

## License

PersonaPlex is subject to the **NVIDIA Open Model License**. Details can be found on the Hugging Face model page.

## Support

If you encounter problems:
1. Check the Troubleshooting section above
2. Consult the [official GitHub repository](https://github.com/NVIDIA/personaplex)
3. Create an issue on GitHub with detailed error descriptions

---

**Version**: 5.0  
**Maintainer**: Pinokio Community  
**Last Update**: January 2026
