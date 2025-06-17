from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2", device_map="auto")
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2")
chat = pipeline("text-generation", model=model, tokenizer=tokenizer)