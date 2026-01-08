from google import genai
import os

# 1. Initialize the client
# It will automatically look for the GEMINI_API_KEY environment variable.
# Or you can pass it directly: client = genai.Client(api_key="YOUR_API_KEY")
client = genai.Client()

print(f"{'Model Name':<30} | {'Capability'}")
print("-" * 60)

try:
    # 2. List all available models
    for model in client.models.list():
        # Clean up the name for readability (removes 'models/')
        clean_name = model.name.replace("models/", "")
        
        # Check what the model supports (e.g., generateContent, embedContent)
        actions = ", ".join(model.supported_actions)
        
        print(f"{clean_name:<30} | {actions}")

except Exception as e:
    print(f"Error fetching models: {e}")
