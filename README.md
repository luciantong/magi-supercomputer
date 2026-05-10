# 📟 NERV HQ — MAGI SYSTEM V3.0 INTERFACE

Welcome, Chief. I watched *Neon Genesis Evangelion* and decided to make this, updated to operate on the modern web and process live queries using generative AI.

This interface features the three "personalities" of the MAGI units—Melchior (Scientist), Balthasar (Mother), and Casper (Woman)—as they deliberate over your inputs.

---

### 🖥️ Interface Preview

*(Once you have the project running, take a screenshot of your MAGI and replace this placeholder image)*

[SCREENSHOT_OF_MAGI_INTERFACE.png]

---

### 🚀 Initialization Protocol (Get it Running)

The MAGI system is designed as a specialized client application. To protect your access and avoid quota conflicts, you must **"Bring Your Own API Key."**

Follow these precise steps to initialize the network:

#### 1. Obtain authorization (Gemini API Key)
The system is optimized for the **Gemini 2.0 Flash** model.
* Go to [Google AI Studio](https://aistudio.google.com/).
* Sign in and generate a free API key.

#### 2. Synchronize your local files
* Download or Clone this repository to your computer.

#### 3. Define the Configuration File
* Look in the project folder for the file named `config.example.js`.
* **Rename** this file to `config.js`.
* Open `config.js` in any text editor.

#### 4. Inject the API Key
* Replace the placeholder text with your actual Gemini API key. It should look like this:
    ```javascript
    // config.js
    window.MAGI_API_KEY = "YourActualKeyHere123abcDEFghi...";
    ```
* Save the file.

#### 5. Launch the System
* Open `index.html` in your web browser.
* **Congratulations.** You now have access to the MAGI Supercomputer.

---

### ⚠️ System Protocols and Safety

#### Security and Quota Management
We use a separate `config.js` file specifically so that you **never** accidentally share your API key when uploading changes to Git or GitHub. This project includes a `.gitignore` file that instructs Git to ignore `config.js`.

#### Quota Limits and Sequencing
Because every query triggers three (3) distinct API calls—one for each MAGI unit—you are at high risk of hitting the Gemini Free Tier limits quickly.

The logic in `app.js` is programmed to run the MAGI units **sequentially** (Melchior, then Balthasar, then Casper) with a **2-second delay** between them. If you still see quota errors, you must wait at least 60 seconds before retrying.

### 📜 Attribution

* **Design:** Authentic recreation based on original production UI from *Neon Genesis Evangelion*.
* **Code:** Built for educational purposes to demonstrate rate-limited AI API implementation in the browser.
* **AI:** Responses provided by the Google Gemini API.

---
**NERV Headquarters – Tokyo-3**
*Pattern Blue – Clearance Level 1 Confirmed.*