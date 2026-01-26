import os

def group_items(input_file, output_file):
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return

    items_by_type = {}
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except UnicodeDecodeError:
        try:
            with open(input_file, 'r', encoding='latin-1') as f:
                lines = f.readlines()
        except Exception as e:
            print(f"Error reading file: {e}")
            return

    print(f"Read {len(lines)} lines from {input_file}")

    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Parse line
        # Expected format: TYPE - MEASURE
        # Example: TORNILLO SOCKET CABEZA/CILINDRO NEGRO NC - 2-56 x 3/16
        
        parts = line.split(" - ")
        if len(parts) >= 2:
            # Rejoin just in case description had " - " (unlikely for type, but safer)
            # Actually, standard seems to be Type - Measure. Type usually doesn't have " - ".
            # Let's assume the LAST " - " separates the measure if multiple exist, 
            # OR the FIRST one. 
            # Looking at "TORNILLO SOCKET ... NC - 2-56 ...", the first one seems correct.
            
            item_type = parts[0].strip()
            item_measure = " - ".join(parts[1:]).strip() # In case measure part has hyphens
            
            if item_type not in items_by_type:
                items_by_type[item_type] = []
            
            items_by_type[item_type].append(item_measure)
        else:
            # Handle cases without standard separator or headers
            # If line looks like a header (all caps, no numbers?) - tricky.
            # Assuming widely uniform list based on user request.
            # If no separator, maybe it's just a type or just a measure? 
            # We'll log it for now.
            # Looking at previous data, some lines might be "TUERCA HEX ..."
            pass

    # Sort types
    sorted_types = sorted(items_by_type.keys())

    with open(output_file, 'w', encoding='utf-8') as f:
        for item_type in sorted_types:
            f.write(f"{item_type}\n")
            # Keep original order of measures or sort? User didn't specify, but original order usually implies size order.
            # We will keep original order as read.
            for measure in items_by_type[item_type]:
                f.write(f"{measure}\n")
            f.write("\n")

    print(f"Grouped items written to {output_file}")

if __name__ == "__main__":
    group_items('listado.txt', 'listado_agrupado.txt')
