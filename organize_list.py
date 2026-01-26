import csv
import os

def organize_list(input_file, output_file):
    # Dictionary to store grouped items: {type: [measurements]}
    grouped_items = {}

    try:
        with open(input_file, mode='r', encoding='utf-8', errors='replace') as csvfile:
            # Using semi-colon as delimiter based on file inspection
            reader = csv.reader(csvfile, delimiter=';')
            
            # Skip header if present
            header = next(reader, None)
            
            for row in reader:
                if len(row) < 2:
                    continue
                
                full_name = row[1].strip()
                
                # Split by " - " to separate Type and Measurement
                # Using maxsplit=1 to only split on the first occurrence if multiple exist, 
                # though usually it seems to be Type - Measurement
                parts = full_name.split(' - ', 1)
                
                if len(parts) == 2:
                    item_type = parts[0].strip()
                    measurement = parts[1].strip()
                    
                    if item_type not in grouped_items:
                        grouped_items[item_type] = []
                    
                    grouped_items[item_type].append(measurement)
                else:
                    # Handle cases where the split didn't work as expected
                    # Maybe put them in a "Others" category or just keep the full name
                    # For now, let's log them to a separate list or just append as is if needed, 
                    # but grouping implies we need a key. Let's use the full name as key and empty measurement 
                    # or try to guess. The user example was very specific about " - ".
                    pass

        # Write to output file
        with open(output_file, mode='w', encoding='utf-8') as outfile:
            for item_type, measurements in grouped_items.items():
                outfile.write(f"{item_type}\n")
                for measure in measurements:
                    outfile.write(f"{measure}\n")
                outfile.write("\n") # Add extra newline between groups
        
        print(f"Successfully processed items. Output written to {output_file}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Using absolute paths as per best practices
    input_path = r"c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\temp_sample.csv"
    output_path = r"c:\Users\Ever\Documents\GitHub\birlos-tuercas-tornillos\listado_organizado.txt"
    organize_list(input_path, output_path)
