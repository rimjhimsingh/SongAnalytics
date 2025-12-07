/*
  CSV Download Utility
  --------------------
  A helper function that handles the client-side generation and downloading of CSV files.
  
  How it works:
  1. It converts a JSON array into a comma-separated string.
  2. It creates a 'Blob' (Binary Large Object) to hold the data in the browser's memory.
  3. It programmatically clicks a temporary link to force the browser to save the file.
*/

export function downloadCSV(rows, name) {
  
    if (!rows || rows.length === 0) return;
  
    // 1. CSV Construction
    // Extract headers from the keys of the first object (e.g., "id,title,tempo")
    const header = Object.keys(rows[0]).join(",");
  
    // Map over every row to convert values to a comma-separated string
    // Note: In a production app, we would also need to handle values containing commas (by wrapping them in quotes).
    const data = rows.map((row) => Object.values(row).join(",")).join("\n");
    const csvContent = header + "\n" + data;
  
    // 2. Blob Creation
    // Create a Blob with the specific MIME type for CSV.
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
    // Create a temporary URL pointing to this Blob object in memory
    const url = URL.createObjectURL(blob);
  
    // 3. Download Trigger (DOM Hack)
    // Browsers don't have a direct "download" function for JS variables.
    // We must create an invisible <a> tag, point it to our Blob, and simulate a click.
    const link = document.createElement("a");
    link.href = url;
    link.download = `songs_${name}.csv`; // Sets the default filename for the user
    link.click();
  
    // 4. Memory Cleanup
    // Important: URL.createObjectURL() allocates memory that is not automatically freed.
    // We must manually revoke the URL to prevent memory leaks in the browser.
    URL.revokeObjectURL(url);
  }