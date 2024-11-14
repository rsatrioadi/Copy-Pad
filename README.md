# Copy-Pad

## Overview

**Copy-Pad** is a simple web app that lets you add, organize, and copy multiple pieces of text with ease. You can add texts, organize them using checkboxes, and copy selected texts to your clipboard, all in a minimalistic interface.

## Running the App

To run the app, serve the files using any simple web server. For example, you can use Python's built-in HTTP server:

```shell
$ python -m http.server
```

Once the server is running, open your browser and navigate to `http://localhost:8000`.

## Usage

1. **Add Texts**:  
   Enter text in the input field at the top of the page and click the **Add** button (or press Enter) to add it to the list. Each entry will appear with an associated checkbox.

2. **Select Texts to Copy**:  
   Check the boxes next to the texts you want to copy. You can use the **Select All** and **Deselect All** buttons to quickly manage your selection.

3. **Copy Selected Texts**:  
   Click the **Copy** button, and all the selected texts will be copied to your clipboard, joined together with new-line characters.

## Features

- Add texts to a list.
- Toggle selection using checkboxes.
- Copy selected texts with a single click.
- Save and load text lists from files.
- Supports keyboard shortcuts (e.g., `Ctrl+C`/`⌘C` for copying, `Ctrl+S`/`⌘S` for saving).