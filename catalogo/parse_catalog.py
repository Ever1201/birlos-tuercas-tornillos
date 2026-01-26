
import os
import re

def parse_listado(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    products = []
    current_product = None
    current_measurements = []

    # Regex to identify product headers (usually uppercase, starts with text)
    # Looking at the file, headers are like "TORNILLO SOCKET..."
    # Measurements are indented or start with numbers/fractions.
    
    # Actually, looking at the previous view_file output:
    # 1: TORNILLO SOCKET CABEZA/CILINDRO NEGRO NC
    # 2: 2-56 x 3/16
    # ...
    # 321: 
    # 322: TORNILLO SOCKET CABEZA/CILINDRO NEGRO FINO
    
    # So empty lines separate blocks? Or just non-indented lines?
    # It seems headers are uppercase. Measurements start with numbers or fractions.

    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # heuristic: if line starts with specific keywords or is fully uppercase and doesn't look like a measurement
        is_header = False
        
        # Check if it looks like a measurement (starts with digit, fraction, or specific chars)
        if re.match(r'^[\d/]+', line) or line.startswith('.'):
            is_measurement = True
        else:
            is_measurement = False

        # Refined heuristic: Headers are uppercase usually.
        # But some measurements might have text "NVO"
        # Let's assume if it doesn't start with a number, it's a product, UNLESS it's a known non-numeric measurement start?
        # Actually in the file: "2-56...", "1/4...", "10-24..."
        # Headers: "TORNILLO...", "TUERCA...", "ARANDELA..."
        
        if not is_measurement and (line.isupper() or "TORNILLO" in line.upper() or "TUERCA" in line.upper() or "RONDANA" in line.upper() or "LLAVE" in line.upper() or "BROCA" in line.upper() or "BIRLO" in line.upper()):
            # Save previous
            if current_product:
                products.append({
                    "name": current_product,
                    "measurements": current_measurements
                })
            current_product = line
            current_measurements = []
        else:
            if current_product:
                # Clean "NVO" or "nuevo" from measurement if needed, but user might want it.
                # The user asked to "separando por tipo de producto", so we keep them grouped.
                current_measurements.append(line)

    # Add last
    if current_product:
        products.append({
            "name": current_product,
            "measurements": current_measurements
        })
        
    return products

def determine_family(product_name):
    name_upper = product_name.upper()
    if "TORNILLO" in name_upper:
        return "Tornillos"
    elif "TUERCA" in name_upper:
        return "Tuercas"
    elif "RONDANA" in name_upper or "ARANDELA" in name_upper:
        return "Rondanas"
    elif "PIJA" in name_upper:
        return "Pijas"
    elif "BIRLO" in name_upper:
        return "Birlos"
    elif "VARILLA" in name_upper:
        return "Varillas"
    elif "HERRAMIENTA" in name_upper or "LLAVE" in name_upper or "DADO" in name_upper or "BROCA" in name_upper:
        return "Herramientas"
    return "Otros"

def determine_subfamily(product_name):
    # heuristic: first 2 words
    parts = product_name.split()
    if len(parts) >= 2:
        return " ".join(parts[:2]).title()
    return product_name.title()

def generate_csv_content(products):
    csv_lines = []
    # Header is already in the file, we will append or replace.
    # FAMILIA;SUBFAMILIA;PRODUCTO;MEDIDAS
    
    for p in products:
        family = determine_family(p['name'])
        subfamily = determine_subfamily(p['name'])
        measurements = "|".join(p['measurements'])
        if not measurements:
            measurements = "N/A"
            
        line = f"{family};{subfamily};{p['name']};{measurements}"
        csv_lines.append(line)
        
    return "\n".join(csv_lines)

def main():
    base_path = r"c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\catalogo"
    input_file = os.path.join(base_path, "listado_organizado.txt")
    output_js_file = os.path.join(base_path, "js", "products_data.js")

    products = parse_listado(input_file)
    new_csv_data = generate_csv_content(products)
    
    # Read existing JS file
    with open(output_js_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine where to insert or replace. 
    # The user wants to "show these items".
    # I should probably REPLACE the existing data if the user implies this is the NEW catalog,
    # OR append. The user said: "en esta pagina muestro un tipo de catalogo pero quisiera mejorarlo mostrando los items que tengo en el listado... ayudame a mostrar estos archivos"
    # It sounds like `listado_organizado.txt` IS the source of truth now.
    # So I will replace the CSV string in `products_data.js`.
    
    # Construct new file content
    new_content_start = "const PRODUCT_CSV_DATA = `FAMILIA;SUBFAMILIA;PRODUCTO;MEDIDAS\n"
    new_content_end = "`"
    
    # We need to find the variable declaration and replace the string content.
    # Regex to find `const PRODUCT_CSV_DATA = `...`;` (multiline)
    
    # Safety: Escape backticks in data if any (unlikely in this context but good practice)
    new_csv_data = new_csv_data.replace("`", "'") 
    
    new_full_csv = new_content_start + new_csv_data + new_content_end
    
    # Replace using simple string manipulation or regex
    # Assuming the file starts with the const declaration
    pattern = r"const PRODUCT_CSV_DATA = `[\s\S]*?`"
    
    if re.search(pattern, content):
        updated_file_content = re.sub(pattern, new_full_csv, content)
        
        with open(output_js_file, 'w', encoding='utf-8') as f:
            f.write(updated_file_content)
        print("Updated products_data.js successfully.")
    else:
        print("Could not find PRODUCT_CSV_DATA constant in js file.")

if __name__ == "__main__":
    main()
