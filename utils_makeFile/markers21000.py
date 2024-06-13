import csv

def create_markers_1000(input_file, output_file):
    with open(input_file, mode='r', encoding='utf-8') as infile, open(output_file, mode='w', encoding='utf-8', newline='') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)
        
        header = next(reader)
        writer.writerow(header)
        
        for row in reader:
            name, latitude, longitude = row[0], float(row[1]), float(row[2])
            writer.writerow([name, latitude, longitude])
            
            for i in range(60):
                sub_name = f"{name}_{i}"
                sub_latitude = latitude + 0.05 * (i + 1)
                sub_longitude = longitude + 0.05 * (i + 1)
                writer.writerow([sub_name, sub_latitude, sub_longitude])

input_file = 'app\static\data\markers\markers_org.csv'
output_file = 'app/static/data/markers/markers_1000.csv'

create_markers_1000(input_file, output_file)
