# PersonaPlex for Pinokio

PersonaPlex is NVIDIA's state-of-the-art real-time speech-to-speech conversational AI model. This Pinokio package enables easy installation and use of PersonaPlex with natural full-duplex conversations and customizable personas and voices.

## System Requirements

⚠️ **Important**: PersonaPlex requires powerful hardware!

- **GPU**: NVIDIA GPU with CUDA support
  - Minimum: RTX generation with 16 GB VRAM
  - Recommended: 24 GB VRAM or more
- **RAM**: At least 32 GB
- **Storage**: Approx. 50 GB free SSD space
- **Operating System**: Windows 10/11 64-bit or modern 64-bit Linux
- **Driver**: Current NVIDIA graphics driver
- **CUDA runtime**: CUDA 12.8 libraries are installed with PyTorch. The launcher does not install the full CUDA Toolkit; a compatible NVIDIA driver is required.

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

### 3. Provide the Token to Pinokio

You do **not** need to set any environment variable manually. The launcher asks for your Hugging Face token directly:

- The first time you **Install** or **Start** PersonaPlex, Pinokio prompts for `HF_TOKEN`.
- Paste your Read token there and it is stored with the app and passed to the server automatically.

You can update it later via the launcher's environment settings.

## Installation via Pinokio

1. **Open Pinokio**
2. **Find PersonaPlex**: Search for "PersonaPlex" in the Pinokio Store
3. **Click Install**: The installation process runs automatically:
   - PersonaPlex repository is cloned
   - Python virtual environment is created or refreshed
   - The PersonaPlex (moshi) package and its dependencies are installed
   - PyTorch 2.7.0 with CUDA 12.8 support (plus matching Triton) is installed
   - Linux audio libraries (Opus and PortAudio) are installed through Conda
   - Runtime imports and the PyTorch build are verified before Start becomes available

Installation takes 10-20 minutes depending on your internet connection.

## Usage

### Starting the Server

1. **Click Start** in Pinokio
   - PersonaPlex currently supports NVIDIA GPUs on Windows or Linux only
2. **First Start**: The model (14-17 GB) will automatically download from Hugging Face
   - This can take 10-30 minutes
   - Download only happens once
3. **Open Web UI**: Click "Open Web UI" when the server is ready

### In the Browser

1. **Open URL**: Click "Open Web UI"; the server runs locally at `http://127.0.0.1:<port>` (Pinokio assigns a free port automatically)
2. **Allow Microphone Access**: The browser will ask for microphone permission
3. **Start Conversation**: Speak in English with the model
4. **Define Personas**: Use text prompts to define roles and characters

## Programmatic Access

The launcher runs `python ../launch.py --host 127.0.0.1 --port <port>` from the `app` folder. This wrapper runs `moshi.server` and ensures aiohttp actually binds to loopback: upstream currently parses `--host` without passing it to `web.run_app`. Pinokio waits for aiohttp's ready message before exposing the "Open Web UI" button. The upstream server is primarily intended for browser-based real-time audio interaction; this launcher does not define additional custom REST endpoints.

Use the examples below to verify that the local server is reachable. Replace `PORT` with the port shown by Pinokio after startup.

### Curl

```bash
curl "http://127.0.0.1:PORT/"
```

### Python

```python
import requests

base_url = "http://127.0.0.1:PORT"
response = requests.get(f"{base_url}/", timeout=30)
response.raise_for_status()
print(response.text[:500])
```

### JavaScript

```javascript
const baseUrl = "http://127.0.0.1:PORT";

const response = await fetch(`${baseUrl}/`);
if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

console.log((await response.text()).slice(0, 500));
```

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
- Run Repair Installation to restore the CUDA-enabled PyTorch build
- Restart system

### Out-of-Memory Error

**Problem**: GPU has insufficient VRAM

**Solution**:
- Close other GPU-intensive programs (browser with many tabs, games, etc.)
- Check GPU usage (Task Manager → Performance → GPU)
- If allocation still fails, use a GPU with more available VRAM; high utilization alone does not indicate a failure

### Model Not Downloading

**Problem**: HF_TOKEN not set or license not accepted

**Solution**:
- Re-enter your `HF_TOKEN` in the launcher's environment settings
- Ensure the license is accepted at [huggingface.co/nvidia/personaplex-7b-v1](https://huggingface.co/nvidia/personaplex-7b-v1)
- Make sure the token has "Read" permission

### Microphone Not Working

**Problem**: Browser has no microphone access

**Solution**:
- Browser Settings → Privacy → Microphone
- Allow access for the `127.0.0.1` URL shown by Pinokio
- Reload browser

### Server Won't Start

**Problem**: Port already in use or Python error

**Solution**:
- Check terminal output in Pinokio
- Stop this app in Pinokio and start it again
- Run "Repair Installation" (or "Install" after an incomplete installation)
- If the checkout is damaged, use "Reset" and reinstall; this removes the app checkout and virtual environment

### Windows Triton/Inductor Error

**Problem**: Startup fails during model warmup with `torch._inductor.exc.InductorError: SystemError: PY_SSIZE_T_CLEAN macro must be defined for '#' formats`

**Solution**:
- Update this launcher, then start PersonaPlex again
- The Windows launch path disables Moshi/PyTorch compile integration with `NO_TORCH_COMPILE=1` and `TORCH_COMPILE_DISABLE=1` to avoid the failing Triton code generation path
- If the error persists, inspect the terminal traceback and repair the installation. Reset removes the checkout and virtual environment but does not clear caches stored elsewhere.

### Install Appears Again After Updating the Launcher

Older installations have no runtime verification marker. Click Install once to refresh and verify the existing checkout; it is not cloned again. A failed verification keeps Start hidden and leaves Install and Reset available for recovery.

### Dependency Checks Report a PyTorch Conflict

Upstream's [package metadata](https://github.com/NVIDIA/personaplex/blob/main/moshi/pyproject.toml) currently declares `torch<2.5`. This launcher retains its existing PyTorch 2.7.0/CUDA 12.8 override for newer GPUs, so `pip check` or `uv pip check` can report that metadata conflict. The final install check verifies runtime imports and the selected CUDA build; it does not prove model inference works on every GPU. Do not run a general dependency synchronization command after installation, since it can replace the launcher's CUDA build.

### Update Doesn't Change the App

**Problem**: You clicked Update but PersonaPlex still behaves the same

**Solution**:
- Update now refreshes both the launcher and the checked-out `app` repository
- It also reinstalls the packaged PersonaPlex Python dependencies and CUDA wheels
- If you still have stale behavior after updating, use "Reset" and then reinstall

## Performance Tips

- **GPU Driver**: Always keep up to date
- **Background Programs**: Close for best performance
- **Storage Space**: Keep at least 50 GB free
- **VRAM Monitoring**: If allocation fails, free GPU memory or use a GPU with more VRAM

## Launcher Development

Run the dependency-free regression checks from the repository root:

```bash
node --test tests/launcher.test.js
python -m unittest discover -s tests -v
```

These checks cover URL readiness, loopback enforcement, menu recovery, template evaluation, and installation verification. A full smoke test additionally requires Pinokio, an NVIDIA GPU, model access, and a model download. Reset retains model caches outside `app`.

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
