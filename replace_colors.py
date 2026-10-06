import os

replacements = {
    'bg-white': 'bg-black',
    'bg-gray-50': 'bg-neutral-900',
    'bg-gray-100': 'bg-neutral-900',
    'bg-gray-200': 'bg-neutral-800',
    'border-gray-100': 'border-neutral-900',
    'border-gray-200': 'border-neutral-800',
    'border-gray-300': 'border-neutral-700',
    'border-gray-400': 'border-neutral-600',
    'text-gray-900': 'text-white',
    'text-gray-800': 'text-neutral-300',
    'text-gray-700': 'text-neutral-400',
    'text-gray-600': 'text-neutral-400',
    'text-gray-500': 'text-neutral-500',
    'hover:bg-gray-50': 'hover:bg-neutral-900',
    'hover:border-gray-300': 'hover:border-neutral-700',
    'hover:text-black': 'hover:text-white',
    'text-black': 'text-white',
    'decoration-gray-300': 'decoration-neutral-700',
    'hover:decoration-black': 'hover:decoration-white',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx'):
            process_file(os.path.join(root, file))
