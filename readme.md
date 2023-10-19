# Sourcatenate
Recursively concatenate files into few bulks files, limited by number of tokens per file.

## Features

- 📂 Recursively walks through directories and subdirectories.
- 📝 Concatenates file contents and saves them into output files.
- 📊 Generates a metadata file with the file hierarchy and total token count.
- 📄 Splits output into multiple files based on a token threshold.


## Customization

- Adjust the `TOKEN_THRESHOLD` in `directoryWalker.js` to change the maximum number of tokens per output
- Currently catered or certain specific requirements, such as:
  - ❌ Skipping directories named "tests".
  - Skipping rust module blocks annotated as tests

## Usage

Set the `ROOT_DIR` and `OUTPUT_FILE` environment variables to specify the root directory to scan and the base name for the output files, respectively.

Run the script:

```bash
ROOT_DIR=/path/to/directory OUTPUT_FILE=output.txt node index.js
```

This will generate output files like `output_1.txt`, `output_2.txt`, etc., and a metadata file named `output_metadata.txt`.
