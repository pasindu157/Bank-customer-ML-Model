import json
import re

try:
    with open('d:/Y3S2/FDM/fdm_mini_project.ipynb', 'r', encoding='utf-8') as f:
        nb = json.load(f)
        
    print("--- SEARCHING FOR MODEL METRICS ---")
    extracted = False
    
    for count, cell in enumerate(nb.get('cells', [])):
        if cell['cell_type'] == 'code':
            source = "".join(cell.get('source', [])).lower()
            
            # Look for code that evaluates all models or prints metrics
            if 'accuracy' in source or 'f1' in source or 'roc_auc' in source:
                
                # Check the output of this cell
                for output in cell.get('outputs', []):
                    if 'data' in output and 'text/plain' in output['data']:
                        text = "".join(output['data']['text/plain'])
                        
                        # Only show text that actually looks like a metrics table or stats
                        keys = ['logistic', 'gradient', 'random', 'decision', 'auc', 'f1', 'precision', 'recall']
                        if any(k in text.lower() for k in keys):
                            print(f"\n[CELL {count} OUTPUT]")
                            print(text)
                            extracted = True
                    
                    elif 'text' in output:
                        text = "".join(output['text'])
                        keys = ['logistic', 'gradient', 'random', 'decision', 'auc', 'f1', 'precision', 'recall']
                        if any(k in text.lower() for k in keys):
                            print(f"\n[CELL {count} STDOUT]")
                            print(text)
                            extracted = True
                            
        # Maybe they put it in a markdown summary table at the end?
        elif cell['cell_type'] == 'markdown':
            source = "".join(cell.get('source', [])).lower()
            if '|' in source and 'logistic' in source and 'accuracy' in source:
                print("\n[FOUND A MARKDOWN RESULTS TABLE]")
                print(source)
                extracted = True

    if not extracted:
        print("Could not directly find the metrics table. You might need to run the notebook manually.")

except Exception as e:
    print(f"Error reading notebook: {e}")
