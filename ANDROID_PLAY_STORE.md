# 🤖 Deploying SIMATS FitX to the Google Play Store

We have fully integrated **Capacitor (Option 2)** into your project. This transforms your React/Vite web application into a high-performance native Android application wrapper.

Here is a summary of the preparations we have completed for you:
1. **Dependencies Installed**: Added `@capacitor/core`, `@capacitor/android`, and `@capacitor/cli` to `package.json`.
2. **Configured Settings**: Set up `capacitor.config.json` targeting the compiled static output directory (`dist`) with a clean app identifier (`com.simatsfitx.app`).
3. **Native Folder Created**: Executed the native configuration to generate the standard `/android` platform folder fully bundled with the compiled app.
4. **Convenience Scripts**: Embedded `npm run cap:sync` and `npm run cap:open` commands into `package.json`.

---

## 🛠️ Step 1: Local Setup & Customization
To complete the build and compile it into a production-ready Android package (`.aab` or `.apk`), download this codebase using the **Settings ⚙️ &rarr; Export as ZIP** menu in AI Studio and follow these steps on your personal machine.

### 📋 Prerequisites
Confirm the following are installed on your machine:
* **Node.js** (v18 or higher)
* **Android Studio** (Llatest version)
* **Java Development Kit (JDK)** (JDK 17 is recommended)

### 🎨 App Icon & Splash Screen Setup
By default, the application uses standard Android launcher templates. To generate beautiful custom app icons and splash screens:
1. In the terminal of your exported project, install the utility:
   ```bash
   npm i -D @capacitor/assets
   ```
2. Place a high-quality square icon (`icon-only.png` or `icon.png`, min 1024x1024px) and a splash graphic (`splash.png`, min 2732x2732px) in an `assets/` folder in your root directory.
3. Run the generator to automatically crop, size, and inject icons into correct Android resolution folders:
   ```bash
   npx capacitor-assets generate --android
   ```

---

## 💻 Step 2: The Build & Sync Workflow
Whenever you make updates to your React/Vite source code and want to see them on your device or prepare a new build, run these commands:

1. **Build the current React application web assets**:
   ```bash
   npm run build
   ```
2. **Sync the newly compiled assets into your native Android container**:
   ```bash
   npm run cap:sync
   ```
3. **Open the project in Android Studio**:
   ```bash
   npm run cap:open
   ```

---

## 📱 Step 3: Compiling the Signed App Bundle (.aab)
Google Play Store requires a **signed Android App Bundle (.aab)** for publication.

### 🔑 A. Generate a Secure Keystore
A keystore is a digital signature that identifies you as the developer. Keep this file very safe!
In your terminal, generate an upload key using `keytool` (adjust values to your needs):
```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### 📦 B. Build the App Bundle inside Android Studio
1. Open Android Studio via `npm run cap:open`.
2. Wait for Gradle synchronization (indexing) to complete successfully.
3. In the top toolbar, navigate to **Build &rarr; Generate Signed Bundle / APK...**
4. Select **Android App Bundle** and click **Next**.
5. Select **Choose Existing...** and point it to the `my-release-key.jks` file you generated.
6. Enter your password, alias name (`my-key-alias`), and alias password. Click **Next**.
7. Under Destination Directory, choose your output path, select **release** build variant, and click **Create / Finish**.
8. After a moment, a notification will appear: "Generate Signed Bundle: App bundle(s) generated successfully." Click **Locate** to find your `app-release.aab` file!

---

## 🚀 Step 4: Publishing on the Google Play Console
1. **Register**: Navigate to the [Google Play Console](https://play.google.com/console) and register a Developer Account (one-time $25 fee).
2. **Create App**: Click **Create app**, fill out your app name (**SIMATS FitX**), select default language, and choose "App" (not game).
3. **Set Up App Details**: Complete the store requirements:
   * Define your target audiences, content ratings, and category.
   * Provide a Link to a Privacy Policy page.
4. **Configure Store Listing**:
   * **Short description**: Futuristic Tactical Fitness Dashboard with Bio-Performance Metrics.
   * **Full description**: Train like a commander. Monitor advanced heart rates, custom exercise protocols, roster rosters, and neural fitness synchronization on a dark sci-fi dashboard.
   * Upload design screenshots, feature graphics, and your app icon.
5. **Release Track selection**:
   * Navigate to **Testing &rarr; Closed testing** (highly recommended first to invite friends/testers) OR **Release &rarr; Production** track.
   * Create a new Release, upload the `app-release.aab` bundle from Step 3.
   * Fill out Release Notes.
   * Save and click **Rollout to Production**! Google will review your app (typically takes 2-5 days for first-time releases) and it will launch on the Play Store.
